local util = require('xlua.util')
local Util = require('Common.Util')
local Settings = require('Common.Settings')
local AppApi = require('Api.AppApi')

---@class LuaApplication
local LuaApplication = Class('LuaApplication')

---@return LuaApplication
function LuaApplication:GetInstance()
    if self.instance == nil then
        self.instance = self.New()
    end
    return self.instance
end

function LuaApplication:Init()
    ---@type UIManager
    self.uiManager = require('UI.UIManager').New()
    self.uiManager:Init()
    self:UpdateProxySettings()
end

function LuaApplication:UpdateProxySettings()
    local settings = Settings:GetInstance()
    local proxy = settings:GetString(Settings.KeyProxy)
    local host, port = Util.SplitProxy(proxy)
    -- Pixiv API 代理
    local appApi = AppApi:GetInstance()
    if host and host ~= '' then
        appApi:SetProxy(host, port)
    end
    
    -- ImageLoader 代理 默认不使用代理访问图片镜像站
    local enableMirror = settings:GetInt(Settings.KeyEnableMirror)
    if enableMirror == 1 then
        ImageLoader.GetInstance():SetProxy(nil, 0)
        ImageLoader.GetInstance():ClearHeaders()
    else
        ImageLoader.GetInstance():SetProxy(host, port)
        ImageLoader.GetInstance():AddHeader('Referer', 'https://www.pixiv.net/')
    end
end

function LuaApplication:ShowLogin()
    self.uiManager:OpenWindow('LoginView')
end

function LuaApplication:Login(callback)
    local settings = Settings:GetInstance()
    local refreshToken = settings:GetString(Settings.KeyRefreshToken)
    util.coroutine_call(function()
        local s, r = pcall(function()
            local appApi = AppApi:GetInstance()
            appApi:SetAddtionalHeaders({ ['Accept-Language'] = 'zh-cn' })
            local token = appApi:Auth(refreshToken)
            if token then
                print('Auth succeeded.')
                callback(1)
                self.isAuthed = true
            else
                callback(0)
                print('Auth failed.')
            end
        end)
        if not s then
            callback(-1)
            print('Init error: '..r)
        end
    end)()
end

function LuaApplication:OnDispose()
    if self.uiManager then
        self.uiManager:OnDispose()
    end
end

return LuaApplication