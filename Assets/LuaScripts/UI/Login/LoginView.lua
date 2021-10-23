local Util = require('Common.Util')
local Settings = require('Common.Settings')
local LuaApplication = require('LuaApplication')

local BaseWindow = require('UI.BaseWindow')

---@class LoginView
local LoginView = Class('LoginView', BaseWindow)

function LoginView:Ctor(uiManager)
    LoginView.super.Ctor(self, uiManager)
    self.prefabName = 'LoginView'
end

---@param go UnityEngine.GameObject
function LoginView:OnInit(go)
    LoginView.super.OnInit(self, go)

    self.tokenInput = go.transform:Find('Panel/Panel/TokenInput'):GetComponent('InputField')
    self.loginButton = go.transform:Find('Panel/Panel/Buttons/LoginButton'):GetComponent('Button')
    self.infotext = go.transform:Find('Panel/Panel/InfoText'):GetComponent('Text')
    Util.AddButtonListener(self.loginButton, function() self:OnLogin() end)
end

function LoginView:OnOpen(data)
    LoginView.super.OnOpen(data)
    local settings = Settings:GetInstance()
    self.tokenInput.text = settings:GetString(Settings.KeyRefreshToken)
end

function LoginView:OnDispose()
    LoginView.super.OnDispose(self)
    Util.RemoveButtonListeners(self.loginButton)
end

function LoginView:OnLogin()
    local token = self.tokenInput.text
    token = Util.Trim(token)
    if not token or token == '' then
        self.infotext.text = '请输入Refresh Token'
        return
    end
    Settings:GetInstance():SetString(Settings.KeyRefreshToken, token)
    self.loginButton.enabled = false
    self.infotext.text = '登录中...'
    LuaApplication:GetInstance():Login(function(code)
        if code == 1 then
            self.uiManager:ChangeWindow('IllustSearchView')
        elseif code == 0 then
            self.infotext.text = '登录失败'
        else
            self.infotext.text = '登录出错'
        end
        self.loginButton.enabled = true
    end)
end

return LoginView