using FairyGUI;
using UnityEngine.Scripting;

namespace Pxkore
{
    [Preserve]
    public class PxkoreGLoader : GLoader
    {

        protected override void LoadExternal()
        {
            if (url.StartsWith("http://")
                || url.StartsWith("https://"))
            {
                FImageLoader.Instance.Load(this, url, 
                    onComplete: t => onExternalLoadSuccess(new NTexture(t)), 
                    onFailed: onExternalLoadFailed);
            }
            else
                base.LoadExternal();
        }

        protected override void FreeExternal(NTexture texture)
        {
            base.FreeExternal(texture);
        }
    }
}