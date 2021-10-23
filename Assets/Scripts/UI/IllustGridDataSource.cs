using System.Collections.Generic;
using PolyAndCode.UI;
using UnityEngine;
using XLua;

namespace PixivCollector
{
    [RequireComponent(typeof(RecyclableScrollRect))]
    public class IllustGridDataSource : MonoBehaviour, IRecyclableScrollRectDataSource
    {
        [CSharpCallLua]
        public delegate int GetItemCountFunc();
        [CSharpCallLua]
        public delegate void SetCellFunc(IllustGridCell cell, int index);
        [CSharpCallLua]
        public delegate void OnScrollToEndFunc();

        GetItemCountFunc getItemCountFunc;
        SetCellFunc setCellFunc;
        OnScrollToEndFunc onScrollToEndFunc;
        
        RecyclableScrollRect recycle;

        void Awake()
        {
            recycle = GetComponent<RecyclableScrollRect>();
        }

        public void ReigisterDelegates(GetItemCountFunc getItemCount, SetCellFunc setCell, OnScrollToEndFunc onScrollToEnd)
        {
            getItemCountFunc = getItemCount;
            setCellFunc = setCell;
            onScrollToEndFunc = onScrollToEnd;
        }

        public void ClearDelegates()
        {
            getItemCountFunc = null;
            setCellFunc = null;
            onScrollToEndFunc = null;
        }
        
        public void Init()
        {
            if (recycle == null)
                recycle = GetComponent<RecyclableScrollRect>();
            recycle.Initialize(this);
        }

        public void Reload()
        {
            recycle.ReloadData();
        }
        
        public int GetItemCount()
        {
            if (getItemCountFunc != null)
                return getItemCountFunc.Invoke();
            return 0;
        }

        public void SetCell(ICell cell, int index)
        {
            var iCell = cell as IllustGridCell;
            setCellFunc?.Invoke(iCell, index);
        }

        public void OnScrollToEnd()
        {
            onScrollToEndFunc?.Invoke();
        }

        public IllustGridCell[] GetCells(bool inBounds)
        {
            return recycle.GetCells<IllustGridCell>(inBounds);
        }

    }
}