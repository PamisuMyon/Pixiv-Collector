local Util = require('Common.Util')

---@class CollectorAction
local CollectorAction = Class('CollectorAction')

function CollectorAction:Ctor(root)
    local path = 'Panel/Actions/Collector/'
    self.collectorButton = root.transform:Find(path..'CollectorButton'):GetComponent('Button')
    self.expandPanel = root.transform:Find(path..'Expand')
    self.closeButton = root.transform:Find(path..'Expand/CloseButton'):GetComponent('Button')
    --self.selectAllToggle = root.transform:Find(path..'Expand/SelectAllToggle'):GetComponent('Toggle')
    self.selectAllButton = root.transform:Find(path..'Expand/SelectAllButton'):GetComponent('Button')
    self.clearButton = root.transform:Find(path..'Expand/ClearButton'):GetComponent('Button')
    self.collectButton = root.transform:Find(path..'Expand/CollectButton'):GetComponent('Button')
    self.deleteButton = root.transform:Find(path..'Expand/DeleteButton'):GetComponent('Button')
    
    Util.AddButtonListener(self.collectorButton, function()
        self.expandPanel.gameObject:SetActive(true)
        self.collectorButton.gameObject:SetActive(false)
        if self.onShow then
            self.onShow()
        end
    end)
    Util.AddButtonListener(self.closeButton, function()
        self.expandPanel.gameObject:SetActive(false)
        self.collectorButton.gameObject:SetActive(true)
        if self.onClose then
            self.onClose()
        end
    end)
    --Util.AddToggleListener(self.selectAllToggle, function(b)
    --    if self.onSelectAllToggle then
    --        self.onSelectAllToggle(b)
    --    end
    --end)
    Util.AddButtonListener(self.selectAllButton, function()
        if self.onSelectAll then
            self.onSelectAll()
        end
    end)
    Util.AddButtonListener(self.clearButton, function()
        if self.onClear then
            self.onClear()
        end
    end)
    Util.AddButtonListener(self.collectButton, function()
        if self.onCollect then
            self.onCollect()
        end
    end)
    Util.AddButtonListener(self.deleteButton, function()
        if self.onDelete then
            self.onDelete()
        end
    end)
end

function CollectorAction:SetOnShowListener(func)
    self.onShow = func
end

function CollectorAction:SetOnCloseListener(func)
    self.onClose = func
end

---@deprecated 全选改为按钮
function CollectorAction:SetOnSelectAllToggleListener(func)
    self.onSelectAllToggle = func
end

function CollectorAction:SetOnSelectAllListener(func)
    self.onSelectAll= func
end

function CollectorAction:SetOnClearListener(func)
    self.onClear = func
end

function CollectorAction:SetOnCollectListener(func)
    self.onCollect = func
end

function CollectorAction:SetOnDeleteListener(func)
    self.onDelete = func
end

function CollectorAction:OnDispose()
    Util.RemoveButtonListeners(self.collectorButton)
    Util.RemoveButtonListeners(self.closeButton)
    --Util.RemoveToggleListeners(self.selectAllToggle)
    Util.RemoveButtonListeners(self.selectAllButton)
    Util.RemoveButtonListeners(self.clearButton)
    Util.RemoveButtonListeners(self.collectButton)
    Util.RemoveButtonListeners(self.deleteButton)
end

return CollectorAction