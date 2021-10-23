using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;
using Random = UnityEngine.Random;

namespace PixivCollector
{
    public class ImageLoader
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
            
            public Task Set(string key, byte[] bytes)
            {
                return Task.Run(() =>
                {
                    var path = Path.Combine(cacheDirectory, key);
                    // Debug.Log("Write file to disk: " + path);
                    File.WriteAllBytes(path, bytes);
                });
            }

            public bool Has(string key)
            {
                var path = Path.Combine(cacheDirectory, key);
                return File.Exists(path);
            }

            public Task<byte[]> Get(string key)
            {
                return Task.Run(() =>
                {
                    var path = Path.Combine(cacheDirectory, key);
                    // Debug.Log("Read file from disk: " + path);
                    var bytes = File.ReadAllBytes(path);
                    return bytes;
                });
            }
        }

        class MemoryCache
        {
            Dictionary<string, byte[]> dict = new Dictionary<string, byte[]>();
            
            public void Set(string key, byte[] bytes)
            {
                if (dict.ContainsKey(key))
                    dict[key] = bytes;
                else
                    dict.Add(key, bytes);
            }

            public byte[] Get(string key)
            {
                if (dict.ContainsKey(key))
                    return dict[key];
                else
                    return null;
            }
        }
        
        #endregion

        static ImageLoader instance;
        readonly static object locker = new object();

        DiskCache diskCache;
        MemoryCache memoryCache;
        AsyncImageLoader.LoaderSettings loaderSettings;
        Dictionary<Image, string> loadingDict;
        int retryTimes = 3;
        string proxyHost;
        int proxyPort;
        Dictionary<string, string> additionalHeaders;

        public static ImageLoader GetInstance()
        {
            if (instance == null)
            {
                lock (locker)
                {
                    if (instance == null)
                    {
                        instance = new ImageLoader();
                    }
                }
            }
            return instance;
        }

        private ImageLoader()
        {
            if (instance != null)
                throw new NotImplementedException("Instance already exists!");

            var cacheDirectory = System.Environment.CurrentDirectory;
            cacheDirectory = Path.Combine(cacheDirectory, "Cache");
            Debug.Log("Image cache directory: " + cacheDirectory);
            diskCache = new DiskCache(cacheDirectory);
            memoryCache = new MemoryCache();
            loadingDict = new Dictionary<Image, string>();
            additionalHeaders = new Dictionary<string, string>();

            loaderSettings = AsyncImageLoader.LoaderSettings.Default;
            loaderSettings.generateMipmap = false;
        }

        public void SetProxy(string host, int port)
        {
            proxyHost = host;
            proxyPort = port;
        }

        public void AddHeader(string key, string value)
        {
            additionalHeaders.Add(key, value);
        }

        public void ClearHeaders()
        {
            additionalHeaders.Clear();
        }

        public async Task<bool> Load(Image image, string url, string key = null)
        {
            var token = "" + image.GetInstanceID() + Random.Range(0, 10000);
            if (!loadingDict.ContainsKey(image))
                loadingDict.Add(image, token);
            else
                loadingDict[image] = token;

            if (key == null)
                key = url;

            var bytes = memoryCache.Get(key);
            if (bytes != null)
            {
                // Debug.Log("Load image from memory: " + key);
                return await Show(image, bytes, token);
            }

            image.overrideSprite = null;

            if (diskCache.Has(key))
            {
                bytes = await diskCache.Get(key);
                if (bytes != null)
                {
                    // Debug.Log("Load image from disk: " + key);
                    var b = await Show(image, bytes, token);
                    memoryCache.Set(key, bytes);
                    return b;
                }
            }

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
                result = await NetworkManager.GetInstance().Request(url, option);
                retryCount++;
            } while (retryCount <= retryTimes && (result == null || result.bytes == null));
            if (result.bytes != null)
            {
                // Debug.Log("Load image from net: " + key);
                var b = await Show(image, result.bytes, token);
                memoryCache.Set(key, result.bytes);
                diskCache.Set(key, result.bytes);
                return b;
            }
            return false;
        }

        async Task<bool> Show(Image image, byte[] bytes, string token)
        {
            if (bytes != null && bytes.Length > 0)
            {
                if (!loadingDict.ContainsKey(image) || loadingDict[image] != token)
                    return false;
                
                RectTransform tranform = (RectTransform)image.transform;
                Texture2D texture = new Texture2D((int)tranform.sizeDelta.x, (int)tranform.sizeDelta.y);
                var b = await AsyncImageLoader.LoadImageAsync(texture, bytes, loaderSettings);
                if (b)
                    image.overrideSprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), Vector2.zero);
                else
                    Debug.Log("Image load failed");
                return b;
            }
            return false;
        }

        public async void LoadAndFillParent(Image image, RectTransform parent, string url, string key = null)
        {
            var b = await Load(image, url, key);
            if (!b)
                return;
            if (image.overrideSprite && image.overrideSprite.texture)
            {
                try
                {
                    var apsectRatio = (float) image.overrideSprite.texture.width / image.overrideSprite.texture.height;
                    var rect = image.GetComponent<RectTransform>();
                    if (apsectRatio > 1)
                    {
                        rect.SetWidth(parent.GetWidth());
                        rect.SetHeight(parent.GetWidth() / apsectRatio);
                    }
                    else
                    {
                        rect.SetHeight(parent.GetHeight());
                        rect.SetWidth(parent.GetHeight() * apsectRatio);
                    }
                }
                catch (Exception e)
                {
                    Debug.Log(e.StackTrace);
                }
            }
        }

    }
}