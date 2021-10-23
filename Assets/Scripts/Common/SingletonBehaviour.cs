using UnityEngine;

namespace PixivCollector
{
    /// <summary>
    /// MonoBehaviour单例基类
    /// </summary>
    public abstract class SingletonBehaviour<T> : MonoBehaviour where T : MonoBehaviour
    {
        public static T Instance { get; protected set; }

        [Tooltip("保持不销毁")]
        public bool dontDestroyOnLoad = true;

        protected virtual void Awake()
        {
            if (Instance != null)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this.GetComponent<T>();
            if (dontDestroyOnLoad)
                DontDestroyOnLoad(gameObject);
        }

    }
}
