using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.AddressableAssets;
using UnityEngine.SceneManagement;
using XLua;
using XLua.LuaDLL;

namespace PixivCollector
{
    public class LuaManager : SingletonBehaviour<LuaManager>
    {
        static LuaEnv luaEnv;
        static float lastGCTime = 0;
        const float GCInterval = 1;

        Dictionary<string, LuaAsset> luaCaches;

        Action luaOnDispose;
        Action LuaOnDispose => GetLuaFunc(ref luaOnDispose, "OnDispose");

        LuaTable scriptEnv;

        public static LuaManager GetInstance() => Instance;

        protected override void Awake()
        {
            base.Awake();
            Init();
        }

        async void Init()
        {
            await LoadAllLuaFilesToCache();

            luaEnv = new LuaEnv();
            luaEnv.AddLoader(CustomLoader);
            luaEnv.AddBuildin("rapidjson", Lua.LoadRapidJson);
            
            scriptEnv = luaEnv.NewTable();
            
            // 为每个脚本设置一个独立的环境，可一定程度上防止脚本间全局变量、函数冲突
            LuaTable meta = luaEnv.NewTable();
            meta.Set("__index", luaEnv.Global);
            scriptEnv.SetMetaTable(meta);
            meta.Dispose();
            
            LoadScript("Requirements");
        }

        async Task LoadAllLuaFilesToCache()
        {
            luaCaches = new Dictionary<string, LuaAsset>();
            IEnumerable<object> keys = new List<object> { "Lua" };
            var locations = await Addressables.LoadResourceLocationsAsync(keys, Addressables.MergeMode.UseFirst).Task;
            foreach (var location in locations)
            {
                var asset = await Addressables.LoadAssetAsync<LuaAsset>(location).Task;
                luaCaches.Add(location.InternalId, asset);
            }
        }

        LuaAsset GetLuaCache(string path)
        {
            if (luaCaches != null)
            {
                luaCaches.TryGetValue(path, out LuaAsset asset);
                if (asset != null)
                    return asset;
            }
            return null;
        }

        void Update()
        {
            // if (Input.GetKeyDown(KeyCode.R))
            // {
            //     Debug.Log("Scene reloading...");
            //     CallLuaDispose();
            //     Reload();
            //     return;
            // }
            
            if (luaEnv != null && Time.time - lastGCTime > GCInterval)
            {
                luaEnv.Tick();
                lastGCTime = Time.time;
            }
        }

        void CallLuaDispose()
        {
            LuaOnDispose?.Invoke();
            luaOnDispose = null;
        }

        void Reload()
        {
            // luaEnv.DoString("require('xlua.util').print_func_ref_by_csharp()");
            luaEnv.Dispose();
            luaEnv = null;
            Instance = null;
            SceneManager.LoadScene(SceneManager.GetActiveScene().name);
            Destroy(gameObject);
        }

        void LoadScript(string scriptName)
        {
            DoString(string.Format("require('{0}')", scriptName));
        }

        void DoString(string script)
        {
            if (luaEnv != null)
            {
                luaEnv.DoString(script);
            }
        }

        const string luaPath = "Assets/LuaScripts/"; 
        public static byte[] CustomLoader(ref string filePath)
        {
            filePath = luaPath + filePath.Replace(".", "/") + ".lua";
            var asset = Instance.GetLuaCache(filePath);
            if (asset)
            {
                // Debug.Log(Encoding.UTF8.GetString(asset.data));
                return asset.data;
            }
            return null;
        }

        Action GetLuaFunc(ref Action func, string name)
        {
            if (scriptEnv == null)
                return null;
            if (func != default)
                return null;
            scriptEnv.Get(name, out func);
            return func;
        }

        void OnDestroy()
        {
            if (luaCaches != null && luaCaches.Count > 0)
            {
                foreach (var item in luaCaches)
                {
                    Addressables.Release(item.Value);
                }
            }
        }
    }
}


