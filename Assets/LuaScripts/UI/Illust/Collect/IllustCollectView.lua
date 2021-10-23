local IllustGridView = require('UI.Illust.IllustGridView')

---@class IllustCollectView
local IllustCollectView = Class('IllustCollectView', IllustGridView)

function IllustCollectView:Ctor(uiManager)
    IllustCollectView.super.Ctor(self, uiManager)
    ---@type IllustCollectController
    self.controller = require('UI.Illust.Collect.IllustCollectController').New(self)
end

function IllustCollectView:OnInit(go)
    IllustCollectView.super.OnInit(self, go)
    ---@type SearchAction
    self.searchAction = require('UI.Illust.SearchAction').New(go)
    --self.searchAction:SetConfirmButtonListener(function() self:OnSearch() end)
    self.searchAction.searchButton.gameObject:SetActive(false)

    self.collectorAction.collectButton.gameObject:SetActive(false)
end

function IllustCollectView:OnOpen(data)
    IllustCollectView.super.OnOpen(self, data)
    self.controller:ShowCollected()
end

return IllustCollectView