using System;
using System.Threading.Tasks;
using FairyGUI;
using UnityEngine;
using UnityEngine.AddressableAssets;

namespace Pamisu.Common
{
    public class AssetManager
    {
        private static AssetManager instance;
        private readonly static object locker = new object();
        public static AssetManager Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (locker)
                    {
                        if (instance == null)
                        {
                            instance = new AssetManager();
                        }
                    }
                }
                return instance;
            }
        }
        
        private AssetManager()
        {
            // FGUI destroy
            NTexture.CustomDestroyMethod += texture =>
            {
                Debug.Log($"FGUI Releasing: {texture.name}");
                Addressables.Release(texture);
            };
        }

        public async Task<T> Load<T>(string address, Action<T> onComplete = null)
        {
            var go = await Addressables.LoadAssetAsync<T>(address).Task;
            onComplete?.Invoke(go);
            return go;
        }

        public async Task AddFGUIPackage(string packageName)
        {
            var desc = await Load<TextAsset>(packageName);
            UIPackage.AddPackage(
                desc.bytes,
                packageName,
                async (name, extension, type, item) =>
                {
                    if (type == typeof(Texture))
                    {
                        var texture = await Load<Texture>(name + extension);
                        item.owner.SetItemAsset(item, texture, DestroyMethod.Custom);
                    }
                });
            Addressables.Release(desc);
        }
    }
}