local util = require('xlua.util')
local Util = require('Common.Util')
local Settings = require('Common.Settings')

local IllustGridController = require('UI.Illust.IllustGridController')

---@class IllustSearchController
local IllustSearchController = Class('IllustSearchController', IllustGridController)

local DataType = {
    None = 0,
    Recommended = 1,
    Search = 2
}

function IllustSearchController:ShowRecommended(nextUrl)
    if self.dataType ~= DataType.Recommended then
        self.illusts = {}
        self.dataType = DataType.Recommended
    end
    util.coroutine_call(function()
        local s, r = pcall(function()
            self.requestToken = Util.GenToken()
            local requestToken = self.requestToken
            local recommended = self.model:Recommended()
            --中途执行了其他请求，则取消
            if self.dataType ~= DataType.Recommended or requestToken ~= self.requestToken then
                return
            end
            self.nextUrl = recommended.next_url
            if nextUrl then
                Util.InsertAll(self.illusts, recommended.illusts)
                self:InitCollection(recommended.illusts)
                self:InitSelection(recommended.illusts)
            else
                self.illusts = recommended.illusts
                self:InitCollection(self.illusts)
                self:InitSelection(self.illusts)
                self.view:Show()
            end
            self.loading = false
        end)
        if not s then
            print('ShowRecommended error: '..r)
            self.loading = false
        end
    end)()
end

function IllustSearchController:Search(nextUrl, keyword, target, sort, offset, minFavorite, numToFill)
    if self.dataType ~= DataType.Search then
        self.illusts = {}
        self.dataType = DataType.Search
    end
    keyword = Util.Trim(keyword)
    if (not keyword or keyword == '') and not nextUrl then
        self:ShowRecommended()
        return
    end
    util.coroutine_call(function()
        local s, r = pcall(function()
            local args = {
                word = keyword,
                search_target = target,
                sort = sort,
                offset = offset,
            }
            self.requestToken = Util.GenToken()
            local requestToken = self.requestToken
            local search = self.model:Search(nextUrl, args)
            if self.dataType ~= DataType.Search or requestToken ~= self.requestToken then
                return
            end
            self.nextUrl = search.next_url
            --根据收藏数过滤
            self.minFavorite = minFavorite
            local needFilter = minFavorite and minFavorite > 0
            print('need filter:'..tostring(needFilter))
            if needFilter then
                local filtered = self:FilterIllusts(search.illusts, minFavorite)
                --不满一页的情况下需要再次请求，目前每页数量固定
                numToFill = numToFill or 30
                if self.nextUrl and type(self.nextUrl) == 'string' and #filtered < numToFill then
                    numToFill = numToFill - #filtered
                else
                    numToFill = 0
                end
                search.illusts = filtered
            end
            --获取收录情况并显示
            if nextUrl then
                Util.InsertAll(self.illusts, search.illusts)
                self:InitCollection(search.illusts)
                self:InitSelection(search.illusts)
                self.view:Show(true)
            else
                self.illusts = search.illusts
                self:InitCollection(self.illusts)
                self:InitSelection(self.illusts)
                self.view:Show()
            end
            if numToFill and numToFill > 0 then
                print('Search results less than one page after filtering, num to fill: '..tostring(numToFill))
                local interval = Settings:GetInstance():GetInt(Settings.KeyRequestInterval)
                Util.Sleep(interval, function()
                    print('Slept')
                    self:Search(self.nextUrl, keyword, target, sort, offset, minFavorite, numToFill)
                end)
            else
                self.loading = false
            end
        end)
        if not s then
            print('Search error: '..r)
            self.loading = false
        end
    end)()
end

function IllustSearchController:NextPage()
    if self.loading then
        return
    end
    if not self.nextUrl or type(self.nextUrl) ~= 'string' then
        print('No next url')
        return
    end
    self.loading = true
    print('Loading next page')
    if self.dataType == DataType.Recommended then
        self:ShowRecommended(self.nextUrl)
    else
        self:Search(self.nextUrl, nil, nil, nil, nil, self.minFavorite)
    end
end

function IllustSearchController:FilterIllusts(illusts, minFavorite)
    local filteredIllusts = {}
    for _, v in pairs(illusts) do
        if tonumber(v.total_bookmarks) >= minFavorite then
            table.insert(filteredIllusts, v);
        end
    end
    return filteredIllusts
end

return IllustSearchController
