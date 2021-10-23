using System;
using PolyAndCode.UI;
using UnityEngine;
using UnityEngine.UI;
using XLua;

namespace PixivCollector
{
    public class IllustGridCell : MonoBehaviour, ICell
    {
        public Button button;
        public Text idLabel;
        public Image image;
        public Toggle selectToggle;
        public Image collectedIcon;
        public int index = -1;

        [CSharpCallLua]
        public delegate void OnCellClickFunc(int index);
        [CSharpCallLua]
        public delegate void OnCellToggleFunc(int index, bool selected);
        
        public OnCellClickFunc OnCellClick { get; set; }
        public OnCellToggleFunc OnCellToggle { get; set; }

        void Awake()
        {
            InitImage();
            button.onClick.AddListener(() => OnCellClick?.Invoke(index));
            selectToggle.onValueChanged.AddListener(b => OnCellToggle?.Invoke(index, b));
        }

        void InitImage()
        {
            Debug.Assert(image != null, "Null image");
            var rect = image.GetComponent<RectTransform>();
            var ar = rect.GetWidth() / rect.GetHeight();
            image.material.SetFloat("_AspectRatio", ar);
        }

    }
}