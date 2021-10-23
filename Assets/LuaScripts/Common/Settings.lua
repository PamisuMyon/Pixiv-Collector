---@class Settings
local Settings = Class('Settings')

Settings.KeyRefreshToken = 'RefreshToken'
Settings.KeyProxy = 'Proxy'
Settings.KeyEnableMirror = 'EnableMirror'
Settings.KeyServerUrl = 'ServerUrl'
Settings.KeyRequestInterval = 'RequestInterval'
Settings.DefaultImageMirror = 'i.pixiv.cat'
local entries = {
    [Settings.KeyServerUrl] = 'http://127.0.0.1:7007',
    [Settings.KeyEnableMirror] = 0,
    [Settings.KeyRequestInterval] = 1
}

function Settings:Ctor()
    --print('Settings Ctor')
end

---@return Settings
function Settings:GetInstance()
    if self.instance == nil then
        self.instance = self.New()
    end
    return self.instance
end

function Settings:GetString(key)
    return PlayerPrefs.GetString(key, entries[key])
end

function Settings:GetInt(key)
    return PlayerPrefs.GetInt(key, entries[key])
end

function Settings:SetString(key, value)
    PlayerPrefs.SetString(key, value)
end
function Settings:SetInt(key, value)
    PlayerPrefs.SetInt(key, value)
end

return Settings