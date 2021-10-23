local BaseWindow = require('UI.BaseWindow')

---@class IllustGridView
local IllustGridView = Class('IllustGridView', BaseWindow)

function IllustGridView:Ctor(uiManager)
    IllustGridView.super.Ctor(self, uiManager)
    self.prefabName = 'IllustGridView'
    ---@type IllustGridController
    --self.controller = require('UI.Illust.IllustGridController').New(self)
end

---@param go UnityEngine.GameObject
function IllustGridView:OnInit(go)
    IllustGridView.super.OnInit(self, go)
    
    ---@type PixivCollector.IllustGridDataSource
    self.dataSource = go.transform:Find('Panel/IllustGrid'):GetComponent('IllustGridDataSource')
    self.dataSource:ReigisterDelegates(
            function() return self:GetItemCount() end, 
            function(cell, index) self:SetCell(cell, index)  end,
            function() self:OnScrollToEnd() end)
    --TODO 暂时固定列数，需要通过设置控制
    self.dataSource:GetComponent('RecyclableScrollRect').Segments = 5
    
    --self.selectAll = false
    ---@type CollectorAction
    self.collectorAction = require('UI.Illust.CollectorAction').New(go)
    --self.collectorAction:SetOnSelectAllToggleListener(function(b) self:OnSelectAllToggle(b) end)
    self.collectorAction:SetOnSelectAllListener(function() self:OnSelectAll() end)
    self.collectorAction:SetOnClearListener(function() self:OnClearSelection() end)
    self.collectorAction:SetOnCollectListener(function() self:OnCollect() end)
    self.collectorAction:SetOnDeleteListener(function() self:OnDelete() end)
end

function IllustGridView:OnOpen(data)
    
end

function IllustGridView:OnClose()

end

function IllustGridView:OnDispose()
    IllustGridView.super.OnDispose(self)
    self.dataSource:ClearDelegates()
    local cells = self.dataSource:GetCells()
    for i = 0, cells.Length - 1 do
        cells[i].OnCellClick = nil
        cells[i].OnCellToggle = nil
    end
    self.searchAction:OnDispose()
    self.collectorAction:OnDispose()
end

function IllustGridView:Show(lazy)
    if lazy then
        --仅在当前cell不满一页情况下刷新，以解决后续数据数量比初始化时数量多的情况下，cell数量不足以显示全部数据的问题
        --TODO 临时解决方案，判断数量固定，之后需要在RecyclableScrollRect中直接修复该问题
        local cells = self.dataSource:GetCells(false)
        if cells and cells.Length > 15 then
            return
        end
    end
    if self.dataSourceInitialized then
        self.dataSource:Reload()
    else
        self.dataSource:Init()
        self.dataSourceInitialized = true
    end
end

---@deprecated 全选改为按钮，使用OnSelectAll替代 
function IllustGridView:OnSelectAllToggle(b)
    --self.selectAll = b
    self.controller:SelectAll(b)
    self:UpdateCurrentCells()
end

---仅选中当前页
function IllustGridView:OnSelectAll()
    local cells = self.dataSource:GetCells(true)
    for i = 0, cells.Length - 1 do
        ---@type PixivCollector.IllustGridCell
        local cell = cells[i]
        cell.selectToggle.isOn = true
    end
end

function IllustGridView:OnClearSelection()
    self.controller:SelectAll(false)
    self:UpdateCurrentCells()
end

function IllustGridView:OnCollect()
    self.controller:Collect()
end

function IllustGridView:OnDelete()
    self.controller:Delete()
end

---更新当前cell状态
function IllustGridView:UpdateCurrentCells()
    local cells = self.dataSource:GetCells(true)
    for i = 0, cells.Length - 1 do
        ---@type PixivCollector.IllustGridCell
        local cell = cells[i]
        local illust = self.controller:GetDataAt(cell.index + 1)
        cell.selectToggle.isOn = illust.selected
        cell.collectedIcon.gameObject:SetActive(illust.collected)
    end
end

--- DataSource delgates begin ---

function IllustGridView:GetItemCount()
    return self.controller:GetDataCount()
end

---SetCell
---@param cell PixivCollector.IllustGridCell
---@param index number
function IllustGridView:SetCell(cell, index)
    cell.index = index
    if not cell.OnCellClick then
        cell.OnCellClick = function(i) self:OnCellClick(i) end
    end
    if not cell.OnCellToggle then
        cell.OnCellToggle = function(i, b) self:OnCellToggle(i, b) end
    end
    
    local illust = self.controller:GetDataAt(index + 1)
    if illust then
        cell.idLabel.text = tostring(index + 1)
        ImageLoader.GetInstance():Load(cell.image, illust.imageUrl, illust.imageKey)
    else
        cell.idLabel.text = 'failed '..tostring(index + 1)
    end
    
    cell.selectToggle.isOn = illust.selected
    cell.collectedIcon.gameObject:SetActive(illust.collected)
end

function IllustGridView:OnScrollToEnd()
    self.controller:NextPage()
end

function IllustGridView:OnCellClick(index)
    local illust = self.controller:GetDataAt(index + 1)
    self.uiManager:OpenWindow('IllustDetailView', illust)
end

function IllustGridView:OnCellToggle(index, selected)
    self.controller:SetSelected(index + 1, selected)
end

--- DataSource delgates end ---

return IllustGridView