local util = require 'xlua.util'

---@class Requests
Requests = Class('Requests')

---@type PixivCollector.NetworkManager
local networkManager = NetworkManager.GetInstance()

local syncRequest = util.async_to_sync(networkManager.Request)

---Request sync
---@param url string
---@param option table
function Requests.RequestSync(url, option)
    return syncRequest(networkManager, url, option)
end

return Requests
