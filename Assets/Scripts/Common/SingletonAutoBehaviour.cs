using UnityEngine;

namespace PixivCollector
{
    public abstract class SingletonAutoBehaviour<T> : MonoBehaviour where T : MonoBehaviour
    {
        protected static T instance;
        
        public static T Instance
        {
            get
            {
                if (instance == null)
                {
                    GameObject go = new GameObject();
                    go.name = typeof(T).ToString();
                    instance = go.AddComponent<T>();
                }
                return instance;
            }
        }
        
    }
}