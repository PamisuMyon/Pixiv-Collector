---@type AppApi
local AppApi = require('Api.AppApi')

---@class IllustModel
local IllustModel = Class('IllustModel')

function IllustModel:Recommended(nextUrl, args)
    args = args or {}
    if nextUrl then
        args = AppApi.ParseQueryString(nextUrl)
    else
        args = {
            offset = args.offset or 0
        }
    end
    local result = AppApi:GetInstance():IllustRecommended(args)
    return result
end

function IllustModel:Search(nextUrl, args)
    args = args or {}
    if nextUrl then
        args = AppApi.ParseQueryString(nextUrl)
    else
        args = {
            word = args.word, 
            search_target = args.search_target or 'partial_match_for_tags', 
            sort = args.sort or 'date_desc', 
            offset = args.offset,
            duration = nil,
            start_date = nil,
            end_date = nil,
       }
    end
    local result = AppApi:GetInstance():SearchIllust(args)
    return result
end

return IllustModel