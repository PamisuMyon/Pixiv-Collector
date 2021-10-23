using System;
using MK.FlexGridLayout;
using UnityEngine;

namespace PixivCollector
{
    [RequireComponent(typeof(FlexGridLayout))]
    public class TagGridDataSource : MonoBehaviour
    {
        FlexGridLayout flexGrid;

        void Awake()
        {
            flexGrid = GetComponent<FlexGridLayout>();
        }

        public void AddEntries(string[] entries)
        {
            foreach (var entry in entries)
            {
                if (entry != null)
                    flexGrid.AddEntry(entry, false, null);
            }
        }
    }
}