local Util = require('Common.Util')

---@type LuaApplication
local LuaApplication = require('LuaApplication')
---@type Settings
local Settings = require('Common.Settings')

---@class MenuView
local MenuView = Class('MenuView')

---@param uiManager UIManager
---@param go UnityEngine.GameObject
function MenuView:Ctor(uiManager, go)
    self.uiManager = uiManager
    self.menuButton = go.transform:Find('MenuButton'):GetComponent('Button')
    Util.AddButtonListener(self.menuButton, function() self:ShowMenu() end)
    
    --菜单
    local menuPath = 'MenuPanel/MenuPopup/List/'
    self.menuPanel = go.transform:Find('MenuPanel')
    self.searchButton = go.transform:Find(menuPath..'SearchButton'):GetComponent('Button')
    self.collectButton = go.transform:Find(menuPath..'CollectButton'):GetComponent('Button')
    self.settingsButton = go.transform:Find(menuPath..'SettingsButton'):GetComponent('Button')
    
    Util.AddButtonListener(self.searchButton, function()
        if LuaApplication:GetInstance().isAuthed then
            self.uiManager:ChangeWindow('IllustSearchView')
        else
            self.uiManager:ChangeWindow('LoginView')
        end
        self:HideMenu()
    end)
    Util.AddButtonListener(self.collectButton, function() 
        self.uiManager:ChangeWindow('IllustCollectView')
        self:HideMenu()
    end)
    Util.AddButtonListener(self.settingsButton, function() 
        self:ShowSettings() 
        self:HideMenu()
    end)
    local trigger = self.menuPanel:GetComponent('EventTrigger')
    Util.AddEventTriggerListener(trigger, function(_) self:HideMenu() end)
    
    --设置
    self.settingsDialogPanel = go.transform:Find('SettingsDialogPanel')
    local dialogPath = 'SettingsDialogPanel/SettingsDialog/'
    self.tokenInput = go.transform:Find(dialogPath..'TokenInput'):GetComponent('InputField')
    self.proxyInput = go.transform:Find(dialogPath..'ProxyInput'):GetComponent('InputField')
    self.mirrorToggle = go.transform:Find(dialogPath..'MirrorToggle'):GetComponent('Toggle')
    self.serverInput = go.transform:Find(dialogPath..'ServerInput'):GetComponent('InputField')
    self.requestIntervalInput = go.transform:Find(dialogPath..'RequestIntervalInput'):GetComponent('InputField')
    self.settingsCancelButton = go.transform:Find(dialogPath..'Buttons/Panel/CancelButton'):GetComponent('Button')
    self.settingsConfirmButton = go.transform:Find(dialogPath..'Buttons/Panel/ConfirmButton'):GetComponent('Button')
    
    Util.AddButtonListener(self.settingsConfirmButton, function() self:OnSettingsConfirm() end)
    Util.AddButtonListener(self.settingsCancelButton, function() self:HideSettings() end)
    trigger = self.settingsDialogPanel:GetComponent('EventTrigger')
    Util.AddEventTriggerListener(trigger, function(_) self:HideSettings() end)
end

function MenuView:ShowMenu()
    self.menuPanel.gameObject:SetActive(true)
end

function MenuView:HideMenu()
    self.menuPanel.gameObject:SetActive(false)
end

function MenuView:ShowSettings()
    self.settingsDialogPanel.gameObject:SetActive(true)
    local settings = Settings:GetInstance()
    self.tokenInput.text = settings:GetString(Settings.KeyRefreshToken)
    self.proxyInput.text = settings:GetString(Settings.KeyProxy)
    self.mirrorToggle.isOn = settings:GetInt(Settings.KeyEnableMirror) == 1
    self.serverInput.text = settings:GetString(Settings.KeyServerUrl)
    self.requestIntervalInput.text = settings:GetInt(Settings.KeyRequestInterval)
end

function MenuView:HideSettings()
    self.settingsDialogPanel.gameObject:SetActive(false)
end

function MenuView:OnSettingsConfirm()
    local settings = Settings:GetInstance()
    settings:SetString(Settings.KeyRefreshToken, Util.Trim(self.tokenInput.text))
    settings:SetString(Settings.KeyProxy, Util.Trim(self.proxyInput.text))
    settings:SetInt(Settings.KeyEnableMirror, self.mirrorToggle.isOn and 1 or 0)
    settings:SetString(Settings.KeyServerUrl, Util.Trim(self.serverInput.text))
    settings:SetInt(Settings.KeyRequestInterval, math.max(0, tonumber(self.requestIntervalInput.text)))

    -- 更新代理设置
    LuaApplication:GetInstance():UpdateProxySettings()

    self:HideSettings()
end

function MenuView:ShowButton()
    self.menuButton.gameObject:SetActive(true)
end

function MenuView:HideButton()
    self.menuButton.gameObject:SetActive(false)
end

function MenuView:OnDispose()
    Util.RemoveButtonListeners(self.menuButton)

    Util.RemoveButtonListeners(self.searchButton)
    Util.RemoveButtonListeners(self.collectButton)
    Util.RemoveButtonListeners(self.settingsButton)
    local trigger = self.menuPanel:GetComponent('EventTrigger')
    Util.RemoveEventTriggerListeners(trigger)

    Util.RemoveButtonListeners(self.settingsConfirmButton)
    Util.RemoveButtonListeners(self.settingsCancelButton)
    trigger = self.settingsDialogPanel:GetComponent('EventTrigger')
    Util.RemoveEventTriggerListeners(trigger)
end

return MenuView