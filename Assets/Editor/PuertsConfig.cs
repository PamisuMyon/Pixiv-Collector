using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Puerts;
using UnityEngine;
using UnityEngine.SceneManagement;
using System.Reflection;

namespace Pxkore.Editor
{
    //1、配置类必须打[Configure]标签
    //2、必须放Editor目录
    [Configure]
    public class PuertsConfig
    {
        static IEnumerable<Type> Bindings
        {
            get
            {
                return new List<Type>()
                {
                    typeof(Debug),
                    typeof(Vector3),
                    typeof(List<int>),
                    typeof(Dictionary<string, List<int>>),
                    typeof(Time),
                    typeof(Transform),
                    typeof(Component),
                    typeof(GameObject),
                    typeof(UnityEngine.Object),
                    typeof(Delegate),
                    typeof(System.Object),
                    typeof(Type),
                    typeof(ParticleSystem),
                    typeof(Canvas),
                    typeof(RenderMode),
                    typeof(Behaviour),
                    typeof(MonoBehaviour),
                    typeof(SceneManager),
                    typeof(Scene),
                    typeof(Screen),
                    typeof(Resources)
                };
            }
        }

        [Binding]
        static IEnumerable<Type> DynamicBindings
        {
            get
            {
                // 在这里添加名字空间
                var namespaces = new List<string>()
                {
                    "UnityEngine",
                    "System.IO",
                    "FairyGUI",
                    "FairyGUI.Utils",
                    "Pamisu.Common",
                    "Pxkore",
                };
                var unityTypes = (from assembly in AppDomain.CurrentDomain.GetAssemblies()
                    where !(assembly.ManifestModule is System.Reflection.Emit.ModuleBuilder)
                    from type in assembly.GetExportedTypes()
                    where type.Namespace != null && namespaces.Contains(type.Namespace) && !IsExcluded(type)
                    select type);
                string[] customAssemblys = new string[]
                {
                    "Assembly-CSharp",
                };
                var customTypes = (from assembly in customAssemblys.Select(s => Assembly.Load(s))
                    where !(assembly.ManifestModule is System.Reflection.Emit.ModuleBuilder)
                    from type in assembly.GetExportedTypes()
                    where type.Namespace == null || !type.Namespace.StartsWith("Puerts")
                        && !IsExcluded(type)
                    select type);
                return unityTypes
                    .Concat(customTypes)
                    .Concat(Bindings)
                    .Distinct();
            }
        }

        static bool IsExcluded(Type type)
        {
            if (type == null)
                return false;

            string assemblyName = Path.GetFileName(type.Assembly.Location);
            if (excludeAssemblys.Contains(assemblyName))
                return true;

            string fullname = type.FullName != null ? type.FullName.Replace("+", ".") : "";
            if (excludeTypes.Contains(fullname))
                return true;
            return IsExcluded(type.BaseType);
        }

        //需要排除的程序集
        static List<string> excludeAssemblys = new List<string>
        {
            "UnityEditor.dll",
            "Assembly-CSharp-Editor.dll",
        };
        //需要排除的类型
        static List<string> excludeTypes = new List<string>
        {
            "UnityEngine.iPhone",
            "UnityEngine.iPhoneTouch",
            "UnityEngine.iPhoneKeyboard",
            "UnityEngine.iPhoneInput",
            "UnityEngine.iPhoneAccelerationEvent",
            "UnityEngine.iPhoneUtils",
            "UnityEngine.iPhoneSettings",
            "UnityEngine.AndroidInput",
            "UnityEngine.AndroidJavaProxy",
            "UnityEngine.BitStream",
            "UnityEngine.ADBannerView",
            "UnityEngine.ADInterstitialAd",
            "UnityEngine.RemoteNotification",
            "UnityEngine.LocalNotification",
            "UnityEngine.NotificationServices",
            "UnityEngine.MasterServer",
            "UnityEngine.Network",
            "UnityEngine.NetworkView",
            "UnityEngine.ParticleSystemRenderer",
            "UnityEngine.ParticleSystem.CollisionEvent",
            "UnityEngine.ProceduralPropertyDescription",
            "UnityEngine.ProceduralTexture",
            "UnityEngine.ProceduralMaterial",
            "UnityEngine.ProceduralSystemRenderer",
            "UnityEngine.TerrainData",
            "UnityEngine.HostData",
            "UnityEngine.RPC",
            "UnityEngine.AnimationInfo",
            "UnityEngine.UI.IMask",
            "UnityEngine.Caching",
            "UnityEngine.Handheld",
            "UnityEngine.MeshRenderer",
            "UnityEngine.UI.DefaultControls",
            "UnityEngine.AnimationClipPair", //Obsolete
            "UnityEngine.CacheIndex", //Obsolete
            "UnityEngine.SerializePrivateVariables", //Obsolete
            "UnityEngine.Networking.NetworkTransport", //Obsolete
            "UnityEngine.Networking.ChannelQOS", //Obsolete
            "UnityEngine.Networking.ConnectionConfig", //Obsolete
            "UnityEngine.Networking.HostTopology", //Obsolete
            "UnityEngine.Networking.GlobalConfig", //Obsolete
            "UnityEngine.Networking.ConnectionSimulatorConfig", //Obsolete
            "UnityEngine.Networking.DownloadHandlerMovieTexture", //Obsolete
            "AssetModificationProcessor", //Obsolete
            "AddressablesPlayerBuildProcessor", //Obsolete
            "UnityEngine.WWW", //Obsolete
            "UnityEngine.EventSystems.TouchInputModule", //Obsolete
            "UnityEngine.MovieTexture", //Obsolete[ERROR]
            "UnityEngine.NetworkPlayer", //Obsolete[ERROR]
            "UnityEngine.NetworkViewID", //Obsolete[ERROR]
            "UnityEngine.NetworkMessageInfo", //Obsolete[ERROR]
            "UnityEngine.UI.BaseVertexEffect", //Obsolete[ERROR]
            "UnityEngine.UI.IVertexModifier", //Obsolete[ERROR]
            //Windows Obsolete[ERROR]
            "UnityEngine.EventProvider",
            "UnityEngine.UI.GraphicRebuildTracker",
            "UnityEngine.GUI.GroupScope",
            "UnityEngine.GUI.ScrollViewScope",
            "UnityEngine.GUI.ClipScope",
            "UnityEngine.GUILayout.HorizontalScope",
            "UnityEngine.GUILayout.VerticalScope",
            "UnityEngine.GUILayout.AreaScope",
            "UnityEngine.GUILayout.ScrollViewScope",
            "UnityEngine.GUIElement",
            "UnityEngine.GUILayer",
            "UnityEngine.GUIText",
            "UnityEngine.GUITexture",
            "UnityEngine.ClusterInput",
            "UnityEngine.ClusterNetwork",
            //System
            "System.Tuple",
            "System.Double",
            "System.Single",
            "System.ArgIterator",
            "System.SpanExtensions",
            "System.TypedReference",
            "System.StringBuilderExt",
            "System.IO.Stream",
            "System.Net.HttpListenerTimeoutManager",
            "System.Net.Sockets.SocketAsyncEventArgs",
        };
    }
}