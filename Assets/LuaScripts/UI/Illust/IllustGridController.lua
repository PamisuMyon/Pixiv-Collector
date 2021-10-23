local rapidjson = require('rapidjson')
local util = require('xlua.util')
local Util = require('Common.Util')
---@type Settings
local Settings = require('Common.Settings')

---@class IllustGridController
local IllustGridController = Class('IllustGridController')

---Ctor
---@param view IllustGridView
function IllustGridController:Ctor(view)
    self.view = view
    ---@type IllustModel
    self.model = require('UI.Illust.IllustModel').New()
    ---@type CollectorApi
    self.collectorApi = require('Api.CollectorApi'):GetInstance()
end

function IllustGridController:GetDataCount()
    if self.illusts then
        return #self.illusts
    else
        return 0
    end
end

function IllustGridController:GetDataAt(index)
    if self.illusts then
        local illust = self.illusts[index]
        if not illust.modified then
            illust.imageUrl = illust.image_urls.large
            local enableMirror = Settings:GetInstance():GetInt(Settings.KeyEnableMirror)
            if enableMirror == 1 then
                illust.imageUrl = string.gsub(illust.image_urls.large, 'i.pximg.net', Settings.DefaultImageMirror)
            end
            local split = Util.Split(illust.imageUrl, '/')
            illust.imageKey = split[#split]
            illust.modified = true
        end
        return illust
    end
end

function IllustGridController:InitSelection(illusts)
    for i = 1, #illusts do
        --illusts[i].selected = self.view.selectAll
        illusts[i].selected = false
    end
end

function IllustGridController:SelectAll(b)
    for i = 1, #self.illusts do
        self.illusts[i].selected = b
    end
end

function IllustGridController:SetSelected(index, selected)
    self.illusts[index].selected = selected
end

---Call in coroutine
function IllustGridController:InitCollection(illusts)
    local ids = rapidjson.array()
    for i = 1, #illusts do
        table.insert(ids, illusts[i].id)
    end
    local info = self.collectorApi:IllustInfo(ids)
    if not info or not info.data or not #info.data then
        for i = 1, #illusts do
            illusts[i].collected = false
        end
        return
    end
    for i = 1, #illusts do
        local exist = false
        for _, v in pairs(info.data) do
            if v.id == illusts[i].id then
                exist = true
                break
            end
        end
        illusts[i].collected = exist
    end
end

function IllustGridController:IsCollected(index)
    return self.collection[index]
end

function IllustGridController:Collect()
    util.coroutine_call(function()
        local s, r = pcall(function()
            local toCollect = {}
            for i = 1, #self.illusts do
                if self.illusts[i].selected and not self.illusts[i].collected then
                    table.insert(toCollect, self.illusts[i])
                end
            end
            if #toCollect == 0 then
                print('Nothing to collect')
                return
            end
            local result = self.collectorApi:IllustPut(toCollect)
            print('Illust collect result: '..result.msg)
            self:InitCollection(toCollect)
            self.view:UpdateCurrentCells()
        end)
        if not s then
            print('IllustGridController Collect error: '..r)
        end
    end)()
end

function IllustGridController:Delete()
    util.coroutine_call(function()
        local s, r = pcall(function()
            local toDelete = {}
            for i = 1, #self.illusts do
                if self.illusts[i].selected and self.illusts[i].collected then
                    table.insert(toDelete, self.illusts[i])
                end
            end
            if #toDelete == 0 then
                print('Nothing to delete')
                return
            end
            local ids = rapidjson.array()
            for i = 1, #toDelete do
                table.insert(ids, toDelete[i].id)
            end
            local result = self.collectorApi:IllustDelete(ids)
            print('Illust delete result: '..result.msg)
            self:InitCollection(toDelete)
            self.view:UpdateCurrentCells()
        end)
        if not s then
            print('IllustGridController Delete error: '..r)
        end
    end)()
end

return IllustGridController