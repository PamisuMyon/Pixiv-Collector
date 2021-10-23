local util = require 'xlua.util'
local Stack = require('Common.Stack')

---@type PixivCollector.AddressablesManager
local addressablesManager = AddressablesManager.GetInstance()
local load = util.async_to_sync(addressablesManager.Load)

local windows = {
    ['LoginView'] = require('UI.Login.LoginView'),
    ['IllustSearchView'] = require('UI.Illust.Search.IllustSearchView'),
    ['IllustCollectView'] = require('UI.Illust.Collect.IllustCollectView'),
    ['IllustDetailView'] = require('UI.Illust.IllustDetailView'),
}

---@class UIManager
local UIManager = Class('UIManager')

function UIManager:Init()
    ---@type Stack
    self.navStack = Stack.New()
    ---@type UnityEngine.GameObject
    self.uiRoot = GameObject.Find('UIRoot')
    --暂时不做嵌套导航
    self.windowRoot = self.uiRoot.transform:Find('WindowRoot')
    local menuViewGo = self.uiRoot.transform:Find('MenuRoot/MenuView')
    ---@type MenuView
    self.menuView = require('UI.Menu.MenuView').New(self, menuViewGo)
end

---OpenWindow
---@param window string
function UIManager:OpenWindow(windowName, data)
    local clazz = windows[windowName]
    assert(clazz, 'Window not exists!')
    util.coroutine_call(function()
        local s, r = pcall(function()
            ---@type BaseWindow
            local window = clazz.New(self)
            local prefab = load(addressablesManager, window.prefabName)
            local go = GameObject.Instantiate(prefab, self.windowRoot.transform)
            self.navStack:Push(window)
            window:OnInit(go)
            window:OnOpen(data)
        end)
        if not s then
            print('Open window error: '..r)
        end
    end)()
end

function UIManager:ChangeWindow(windowName, data)
    local clazz = windows[windowName]
    assert(clazz, 'Window not exists!')
    while self:NavBack(true) do end
    self:OpenWindow(windowName, data)
end

function UIManager:NavBack(clear)
    if self.navStack:Count() == 0 then
        return false
    end
    if self.navStack:Count() > 1 or clear then
        ---@type BaseWindow
        local window = self.navStack:Pop(1)
        window:OnClose()
        window:OnDispose()
        --TODO 对象池
        GameObject.Destroy(window.gameObject)
        return true
    end
    return false
end

function UIManager:OnDispose()
    local s, r = pcall(function()
        for _, v in pairs(self.navStack.data) do
            v:OnDispose()
        end
        if self.menuView then
            self.menuView:OnDispose()
        end
    end)
    if not s then
        print('UIManager OnDispose error: '..r)
    end
end

return UIManager
