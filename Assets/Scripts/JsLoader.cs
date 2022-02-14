using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Puerts;
using UnityEngine;
using UnityEngine.AddressableAssets;

namespace Pxkore
{
    public class JsLoader : ILoader
    {
        private string root;
        private Dictionary<string, string> jsCacheDict;

        public JsLoader(string root = "")
        {
            this.root = root;
        }

        public async Task PreloadAll(string label = "javascript")
        {
            jsCacheDict ??= new Dictionary<string, string>();
            var assets = await Addressables.LoadAssetsAsync<TextAsset>(label, null).Task;
            foreach (var asset in assets)
            {
                jsCacheDict.Add(asset.name, asset.text);
            }
        }

        private string PathToUse(string filepath)
        {
            return
                // .cjs asset is only supported in unity2018+
#if UNITY_2018_1_OR_NEWER
                filepath.EndsWith(".cjs") || filepath.EndsWith(".mjs")
                    ? filepath.Substring(0, filepath.Length - 4)
                    :
#endif
                    filepath;
        }

        public bool FileExists(string filepath)
        {
            if (jsCacheDict != null
                && jsCacheDict.ContainsKey(filepath))
                return true;
#if PUERTS_GENERAL
            return File.Exists(Path.Combine(root, filepath));
#else
            string pathToUse = this.PathToUse(filepath);
            bool exist = Resources.Load(pathToUse) != null;
#if !PUERTS_GENERAL && UNITY_EDITOR && !UNITY_2018_1_OR_NEWER
            if (!exist) 
            {
                UnityEngine.Debug.LogWarning("【Puerts】unity 2018- is using, if you found some js is not exist, rename *.cjs,*.mjs in the resources dir with *.cjs.txt,*.mjs.txt");
            }
#endif
            return exist;
#endif
        }

        public string ReadFile(string filepath, out string debugpath)
        {
            debugpath = Path.Combine(root, filepath);
#if UNITY_EDITOR_WIN || UNITY_STANDALONE_WIN
            debugpath = debugpath.Replace("/", "\\");
#endif
            if (jsCacheDict != null
                && jsCacheDict.ContainsKey(filepath))
                return jsCacheDict[filepath];
#if PUERTS_GENERAL
            return File.ReadAllText(debugpath);
#else
            string pathToUse = this.PathToUse(filepath);
            TextAsset file = (TextAsset)Resources.Load(pathToUse);
            return file == null ? null : file.text;
#endif
        }
    }
}