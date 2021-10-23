local IllustGridView = require('UI.Illust.IllustGridView')

---@class IllustSearchView
local IllustSearchView = Class('IllustSearchView', IllustGridView)

function IllustSearchView:Ctor(uiManager)
    IllustSearchView.super.Ctor(self, uiManager)
    ---@type IllustSearchController
    self.controller = require('UI.Illust.Search.IllustSearchController').New(self)
end

function IllustSearchView:OnInit(go)
    IllustSearchView.super.OnInit(self, go)
    ---@type SearchAction
    self.searchAction = require('UI.Illust.SearchAction').New(go)
    self.searchAction:SetOnSearchListener(function(keyword, target, sort, offset, minFavorite)
        self.controller:Search(nil, keyword, target, sort, offset, minFavorite)
        self.searchAction:HideDialog()
    end)
end

function IllustSearchView:OnOpen(data)
    IllustSearchView.super.OnOpen(self, data)
    self.controller:ShowRecommended()
end

return IllustSearchView