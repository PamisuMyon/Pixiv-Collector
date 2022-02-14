using System.IO;
using FairyGUI;
using Pamisu.Common;
using Puerts;
using UnityEngine;

namespace Pxkore
{
    public class JsManager : SingletonBehaviour<JsManager>
    {
        [SerializeField]
        private bool enableDebug;
        
        private static JsEnv jsEnv;

        protected override void Awake()
        {
            base.Awake();
            RunScript();
        }

        private async void RunScript()
        {
            if (jsEnv == null)
            {
                JsLoader loader;
                if (enableDebug)
                {
                    var root = Path.Combine(Application.dataPath, "../TsProject/output/");
                    Debug.Log($"js debug root: {root}");
                    loader = new JsLoader(root);
                    await loader.PreloadAll();
                    jsEnv = new JsEnv(loader, 7700);
                    await jsEnv.WaitDebuggerAsync();
                }
                else
                {
                    loader = new JsLoader();
                    await loader.PreloadAll();
                    jsEnv = new JsEnv(loader);
                }
            }
            RegisterUsings();
            jsEnv.Eval("require('bundle');");
        }
        
        private void RegisterUsings()
        {
            jsEnv.UsingAction<int, GObject>();
        }

        private void Update()
        {
            jsEnv?.Tick();
        }
        
        void OnDestroy()
        {
            jsEnv?.Dispose();
        }
    }
}