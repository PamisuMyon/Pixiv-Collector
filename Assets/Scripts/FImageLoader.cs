using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using FairyGUI;
using Pamisu.Common;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.Profiling;
using Image = UnityEngine.UI.Image;
using Random = UnityEngine.Random;

namespace Pxkore
{
    public class FImageLoader : SingletonAutoBehaviour<FImageLoader>
    {
        #region Cache class

        class DiskCache
        {
            string cacheDirectory;

            public DiskCache(string cacheDirectory)
            {
                this.cacheDirectory = cacheDirectory;
                if (!Directory.Exists(cacheDirectory))
                    Directory.CreateDirectory(cacheDirectory);
            }

            public string GetPath(string key, bool withProtocol = false)
            {
                var path = Path.Combine(cacheDirectory, key);
                if (withProtocol)
                    path = "file://" + path;
                return path;
            }

            public Task Set(string key, byte[] bytes)
            {
                return Task.Run(() =>
                {
                    var path = GetPath(key);
                    // Debug.Log("Write file to disk: " + path);
                    File.WriteAllBytes(path, bytes);
                });
            }

            public bool Has(string key)
            {
                var path = GetPath(key);
                return File.Exists(path);
            }

            public Task<byte[]> Get(string key)
            {
                return Task.Run(() =>
                {
                    var path = GetPath(key);
                    // Debug.Log("Read file from disk: " + path);
                    var bytes = File.ReadAllBytes(path);
                    return bytes;
                });
            }
        }

        #endregion

        private DiskCache diskCache;
        private Dictionary<GLoader, string> loadingDict;
        private int retryTimes = 0;
        private string proxyHost;
        private int proxyPort;
        private Dictionary<string, string> additionalHeaders;

        private FImageLoader()
        {
            if (instance != null)
                throw new NotImplementedException("Instance already exists!");

            var cacheDirectory = Environment.CurrentDirectory;
            cacheDirectory = Path.Combine(cacheDirectory, "Cache");
            Debug.Log("Image cache directory: " + cacheDirectory);
            diskCache = new DiskCache(cacheDirectory);
            loadingDict = new Dictionary<GLoader, string>();
            additionalHeaders = new Dictionary<string, string>();
        }

        public static FImageLoader GetInstance() => Instance;

        public void SetProxy(string host, int port)
        {
            proxyHost = host;
            proxyPort = port;
        }

        public void AddHeader(string key, string value)
        {
            if (additionalHeaders.ContainsKey(key))
                additionalHeaders[key] = value;
            else 
                additionalHeaders.Add(key, value);
        }

        public void ClearHeaders()
        {
            additionalHeaders.Clear();
        }

        private string GetKeyFromUrl(string url)
        {
            var split = url.Split('/');
            return split[split.Length - 1];
        }

        public async void Load(GLoader image, string url, string key = null, Action<Texture> onComplete = null, Action onFailed = null)
        {
            // generate a token represents current loading task
            var token = "" + image.id + Random.Range(0, 10000);
            if (!loadingDict.ContainsKey(image))
                loadingDict.Add(image, token);
            else
                loadingDict[image] = token;

            key ??= GetKeyFromUrl(url);

            // Disk
            if (diskCache.Has(key))
            {
                // Debug.Log("Load image from disk: " + key);
                CompleteLoading(image, diskCache.GetPath(key, true), token, onComplete);
                return;
            }

            // Network
            var headers = new Dictionary<string, string>();
            headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36 Edg/94.0.992.38");
            foreach (var item in additionalHeaders)
            {
                headers.Add(item.Key, item.Value);
            }
            var option = new RequestOption()
            {
                resultInBytes = true,
                timeOut = 10000,
                headers = headers
            };
            if (proxyHost != null && proxyHost != null)
            {
                option.proxyHost = proxyHost;
                option.proxyPort = proxyPort;
            }
            int retryCount = -1;
            RequestResult result;
            do
            {
                result = await NetworkManager.Instance.RequestAsync(url, option);
                retryCount++;
            } while (retryCount <= retryTimes && (result == null || result.bytes == null));
            if (result != null && result.bytes != null)
            {
                // Debug.Log("Load image from net: " + key);
                await diskCache.Set(key, result.bytes);
                CompleteLoading(image, diskCache.GetPath(key, true), token, onComplete);
            }
            else
            {
                onFailed?.Invoke();
            }
        }

        void CompleteLoading(GLoader image, string path, string token, Action<Texture> onComplete = null, Action onFailed = null)
        {
            // token desn't match means the loading task has changed
            if (!loadingDict.ContainsKey(image) || loadingDict[image] != token)
                return;

            StartCoroutine(DoLoadTexture(path, onComplete, onFailed));
        }

        IEnumerator DoLoadTexture(string path, Action<Texture> onComplete = null, Action onFailed = null)
        {
            using (var request = UnityWebRequestTexture.GetTexture(path))
            {
                yield return request.SendWebRequest();
                if (request.result == UnityWebRequest.Result.Success)
                {
                    var texture = DownloadHandlerTexture.GetContent(request);
                    onComplete?.Invoke(texture);
                }
                else
                {
                    onFailed?.Invoke();
                }
            }
        }
    }
}