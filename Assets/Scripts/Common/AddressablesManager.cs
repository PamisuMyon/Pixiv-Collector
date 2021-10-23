using System;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.AddressableAssets;

namespace PixivCollector
{
    public class AddressablesManager
    {
        static AddressablesManager instance;
        readonly static object locker = new object();

        public static AddressablesManager GetInstance()
        {
            if (instance == null)
            {
                lock (locker)
                {
                    if (instance == null)
                    {
                        instance = new AddressablesManager();
                    }
                }
            }
            return instance;
        }

        public async Task<GameObject> Load(string address, Action<GameObject> onComplete)
        {
            var go = await Addressables.LoadAssetAsync<GameObject>(address).Task;
            onComplete?.Invoke(go);
            return go;
        }
        
    }
}