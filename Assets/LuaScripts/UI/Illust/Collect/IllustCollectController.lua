local util = require('xlua.util')
local Util = require('Common.Util')

local IllustGridController = require('UI.Illust.IllustGridController')

---@class IllustCollectController
local IllustCollectController = Class('IllustCollectController', IllustGridController)

function IllustCollectController:ShowCollected(offsetOid)
    util.coroutine_call(function()
        local s, r = pcall(function()
            local result = self.collectorApi:IllustList(offsetOid)
            print('Illust list result: '..result.count)
            for _, v in pairs(result.data) do
                v.collected = true
                v.image_urls = v.urls
            end
            if offsetOid then
                Util.InsertAll(self.illusts, result.data)
            else
                self.illusts = result.data
                self.view:Show()
            end
            self.loading = false
        end)
        if not s then
            print('IllustGridController Collect error: '..r)
            self.loading = false
        end
    end)()
end

function IllustCollectController:NextPage()
    if self.loading then
        return
    end
    if self.illusts and #self.illusts > 0 then
        local oid = self.illusts[#self.illusts]._id
        self.loading = true
        self:ShowCollected(oid)
    end
end

return IllustCollectController
