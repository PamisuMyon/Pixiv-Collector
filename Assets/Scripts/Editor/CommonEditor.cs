using UnityEditor;
using UnityEngine;

namespace PixivCollector
{
    public class CommonEditor : Editor
    {

        [MenuItem("GameObject/CopyPath", false, 11)]
        public static void CopyPath()
        {
            GameObject go = Selection.activeGameObject;
            string path = GetPath(go);
            path = path.Replace("Canvas (Environment)/", "");
            GUIUtility.systemCopyBuffer = path;
        }

        public static string GetPath(GameObject go)
        {
            GameObject current = go;
            string path = current.name;
            while (null != current.transform.parent)
            {
                current = current.transform.parent.gameObject;
                path = current.name + "/" + path;
            }
            return path;
        }
    }
}

