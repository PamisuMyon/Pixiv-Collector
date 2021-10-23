local Requests = require('Common.Requests')
local Settings = require('Common.Settings')
local Util = require('Common.Util')
local rapidjson = require('rapidjson')

local apiPrefix = '/api/v1'

---@class CollectorApi
local CollectorApi = Class('CollectorApi')

---@type CollectorApi
function CollectorApi:GetInstance()
    if self.instance == nil then
        self.instance = self.New()
    end
    return self.instance
end

function CollectorApi:GetApiUrl()
    return Settings:GetInstance():GetString(Settings.KeyServerUrl)..apiPrefix
end

---Call in coroutine
function CollectorApi:Request(url, option)
    option = option or {}
    Util.StringifyTableValues(option.headers)
    Util.StringifyTableValues(option.parameters)
    Util.StringifyTableValues(option.formData)
    Util.StringifyTableValues(option.formUrlencodedDatas)
    local r = Requests.RequestSync(url, option)
    if r then
        return r
    else
        print('Request error: '..url)
    end
end

---Call in coroutine
--@param ids rapidjson.array
function CollectorApi:IllustInfo(ids)
    local s, r = pcall(function()
        local url = self:GetApiUrl()..'/illust/info'
        local body = {
            breifMode = true,
            ids = ids
        }
        local option = {
            method = 'POST',
            headers = {
                ['Content-Type'] = 'application/json'
            },
            body = rapidjson.encode(body)
        }
        local result = self:Request(url, option)
        local decode = rapidjson.decode(result.body)
        return decode
    end)
    if s then
        return r
    else
        print('IllustInfo error: '..r)
    end
end

---Call in coroutine
function CollectorApi:IllustPut(illusts)
    local s, r = pcall(function()
        local url = self:GetApiUrl()..'/illust'
        local option = {
            method = 'PUT',
            headers = {
                ['Content-Type'] = 'application/json'
            },
            body = rapidjson.encode(illusts)
        }
        local result = self:Request(url, option)
        local decode = rapidjson.decode(result.body)
        return decode
    end)
    if s then
        return r
    else
        print('IllustPut error: '..r)
    end
end

---Call in coroutine
function CollectorApi:IllustDelete(ids)
    local s, r = pcall(function()
        local url = self:GetApiUrl()..'/illust'
        local option = {
            method = 'DELETE',
            headers = {
                ['Content-Type'] = 'application/json'
            },
            body = rapidjson.encode(ids)
        }
        local result = self:Request(url, option)
        local decode = rapidjson.decode(result.body)
        return decode
    end)
    if s then
        return r
    else
        print('IllustDelete error: '..r)
    end
end

---Call in coroutine
function CollectorApi:IllustList(offsetOid)
    local s, r = pcall(function()
        local url = self:GetApiUrl()..'/illust/list'
        local body = {
            offsetOid = offsetOid
        }
        local option = {
            method = 'POST',
            headers = {
                ['Content-Type'] = 'application/json'
            },
            body = rapidjson.encode(body)
        }
        local result = self:Request(url, option)
        local decode = rapidjson.decode(result.body)
        return decode
    end)
    if s then
        return r
    else
        print('IllustList error: '..r)
    end
end

return CollectorApi