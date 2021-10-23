local Util = require('Common.Util')

---@class SearchAction
local SearchAction = Class('SearchAction')

function SearchAction:Ctor(root)
    self.searchButton = root.transform:Find('Panel/Actions/SearchButton'):GetComponent('Button')
    ---@type UnityEngine.GameObject
    self.dialogPanel = root.transform:Find('Panel/SearchDialogPanel')
    local dialogPath = 'Panel/SearchDialogPanel/SearchDialog/'
    self.kewordInput = root.transform:Find(dialogPath..'KeywordInput'):GetComponent('InputField')
    self.targetDropdown = root.transform:Find(dialogPath..'TargetDropdown'):GetComponent('Dropdown')
    self.sortDropdown = root.transform:Find(dialogPath..'SortDropdown'):GetComponent('Dropdown')
    self.offsetInput = root.transform:Find(dialogPath..'Offset/OffsetInput'):GetComponent('InputField')
    self.minFavoriteInput = root.transform:Find(dialogPath..'MinFavorite/MinFavoriteInput'):GetComponent('InputField')
    self.cancelButton = root.transform:Find(dialogPath..'Buttons/Panel/CancelButton'):GetComponent('Button')
    self.confirmButton = root.transform:Find(dialogPath..'Buttons/Panel/ConfirmButton'):GetComponent('Button')
    
    Util.AddButtonListener(self.searchButton, function() self:ShowDialog() end)
    Util.AddButtonListener(self.cancelButton, function() self:HideDialog() end)
    Util.AddButtonListener(self.confirmButton, function() self:OnConfirmButton() end)
    local trigger = self.dialogPanel:GetComponent('EventTrigger')
    Util.AddEventTriggerListener(trigger, function(_) self:HideDialog() end)
    
    self.dialogPanel.gameObject:SetActive(false)
end

function SearchAction:OnConfirmButton()
    local keyword = Util.Trim(self.kewordInput.text)
    local target = self.targetDropdown.value
    if target == 2 then
        target = 'title_and_caption'
    elseif target == 1 then
        target = 'exact_match_for_tags'
    else
        target = 'partial_match_for_tags'
    end
    local sort = self.sortDropdown.value
    if sort == 2 then
        sort = 'popular_desc'
    elseif sort == 1 then
        sort = 'date_asc'
    else
        sort = 'date_desc'
    end
    local offset = tonumber(Util.Trim(self.offsetInput.text))
    local minFavorite = tonumber(Util.Trim(self.minFavoriteInput.text))
    if self.onSearch then
        self.onSearch(keyword, target, sort, offset, minFavorite)
    end
end

function SearchAction:SetOnSearchListener(func)
    self.onSearch = func
end

function SearchAction:ShowDialog()
    self.dialogPanel.gameObject:SetActive(true)
end

function SearchAction:HideDialog()
    self.dialogPanel.gameObject:SetActive(false)
end

function SearchAction:OnDispose()
    Util.RemoveButtonListeners(self.searchButton)
    Util.RemoveButtonListeners(self.cancelButton)
    Util.RemoveButtonListeners(self.confirmButton)
    local trigger = self.dialogPanel:GetComponent('EventTrigger')
    Util.RemoveEventTriggerListeners(trigger)
end

return SearchAction