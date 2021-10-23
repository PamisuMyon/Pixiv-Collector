local Requests = require('Common.Requests')
local Util = require('Common.Util')
local rapidjson = require('rapidjson')

---@class AppApi
local AppApi = Class('AppApi')

local clientId = 'MOBrBDS8blbauoSck0ZfDbtuzpyT'
local clientSecret = 'lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj'
local hashSecret = '28c1fdd170a5204386cb1313c7077b34f83e4aaf4aa829ce78c231e05b0bae2c'

function AppApi:Ctor()
    self.userId = 0
    self.accessToken = nil
    self.refreshToken = nil
    self.requests = require('Common/Requests')
    self.addtionalHeaders = {}
    self.hosts = 'https://app-api.pixiv.net'
end

---GetInstance
---@return AppApi
function AppApi:GetInstance()
    if self.instance == nil then
        self.instance = self.New()
    end
    return self.instance
end

function AppApi:SetHosts(hosts)
    self.hosts = hosts
end

function AppApi:SetProxy(proxyHost, proxyPort)
    self.proxyHost = proxyHost
    self.proxyPort = proxyPort
end

function AppApi:SetAddtionalHeaders(headers)
    self.addtionalHeaders = headers
end

function AppApi:Request(url, option, auth)
    if nil == auth then
        auth = true
    end
    print('Requesting url: '..url..' auth: '..tostring(auth))
    option = option or {}
    option.headers = option.headers or {}
    if auth then
        if not self.accessToken then
            print('Authentication required')
            return
        end
        option.headers['Authorization'] = 'Bearer '..self.accessToken
    end
    -- 通用headers
    if not option.headers['user-agent'] then
        option.headers['app-os'] = 'ios'
        option.headers['app-os-version'] = '14.6'
        option.headers['user-agent'] = 'PixivIOSApp/7.13.3 (iOS 14.6; iPhone13,2)'
    end
    -- 附加headers
    if self.addtionalHeaders then
        for k, v in pairs(self.addtionalHeaders) do
            option.headers[k] = v
        end
    end
    -- 代理
    if self.proxyHost then
        option.proxyHost = self.proxyHost
        option.proxyPort = self.proxyPort
    end
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

function AppApi:Decode(str)
    local s, r = pcall(function() return rapidjson.decode(str) end)
    if s then
        return r
    else
        print('Json decode error: '..tostring(r))
    end
end

function AppApi.ParseQueryString(url)
    if not url then
        return
    end
    local s, r = pcall(function()
        local split = Util.Split(url, '?')
        split = Util.Split(split[2], '&')
        local t = {}
        for _, v in pairs(split) do
            local s = Util.Split(v, '=')
            t[s[1]] = Util.UrlDecode(s[2])
        end
        return t
    end)
    if s then
        return r
    else
        print('Parse query string error: '..tostring(r)..' url: '..tostring(url))
    end
end

---RequireAppApiHosts
---@param hostName string
---@param timeOut number
function AppApi:RequireAppApiHosts(hostName, timeOut)
    hostName = hostName or "app-api.pixiv.net"
    timeOut = timeOut or 10000
    
    local urls = {
        "https://1.0.0.1/dns-query",
        "https://1.1.1.1/dns-query",
        "https://[2606:4700:4700::1001]/dns-query",
        "https://[2606:4700:4700::1111]/dns-query",
        "https://cloudflare-dns.com/dns-query",
    }
    params = {
        ["ct"] = "application/dns-json",
        ["name"] = hostName,
        ["type"] = "A",
        ["do"] = "false",
        ["cd"] = "false",
    }
    for _, v in pairs(urls) do
        local option = {
            parameters = params,
            timeOut = timeOut
        }
        local result = Requests.RequestSync(v, option)
        print(result)
        if result and result.statusCode == 200 and result.body then
            local decode = rapidjson.decode(result.body)
            self.hosts = 'https://' + decode.Answer[1].data
            print(self.hosts)
            break
        end
    end
end

---Auth
---@param refreshToken string
---@param headers table
---@return table
function AppApi:Auth(refreshToken, headers)
    headers = headers or {}
    local time = os.date('!%Y-%m-%dT%H:%M:%S+00:00')
    headers['x-client-time'] = time
    headers['x-client-hash'] = Utils.GetMD5Hash(time..hashSecret)
    local authHosts
    if not self.hosts or self.hosts == 'https://app-api.pixiv.net' then
        authHosts = 'https://oauth.secure.pixiv.net'
    else
        authHosts = self.hosts
        headers['host'] = 'oauth.secure.pixiv.net'
    end
    local url = authHosts..'/auth/token'
    local data = {
        get_secure_url = '1',
        client_id = clientId,
        client_secret = clientSecret,
    }
    data.grant_type = 'refresh_token'
    data.refresh_token = refreshToken or self.refreshToken
    
    local option = {
        method = 'POST',
        headers = headers,
        formUrlencodedDatas = data
    }
    local result = self:Request(url, option, false)
    if result == nil 
            or (result.statusCode ~= 200 
            and result.statusCode ~= 301 
            and result.statusCode ~= 302) then
        print('Auth failed.')
        if result then
            print('Status code: '.. result.statusCode..' Body: '..result.body)
        end
        return
    end
    
    local decode = self:Decode(result.body)
    self.userId = decode.user.id
    self.accessToken = decode.access_token
    self.refreshToken = decode.refresh_token
    
    return decode
end

function AppApi:IllustDetail(illustId)
    local url = self.hosts..'/v1/illust/detail'
    local option = {
        method = 'GET',
        parameters = {
            illust_id = illustId
        }
    }
    local result = self:Request(url, option)
    return self:Decode(result.body)
end

---content_type: [illust, manga]
function AppApi:IllustRecommended(args)
    args = args or {}
    args = {
        content_type = args.content_type or 'illust',
        max_bookmark_id_for_recommend = args.max_bookmark_id_for_recommend, 
        min_bookmark_id_for_recent_illust = args.min_bookmark_id_for_recent_illust,
        offset = args.offset,
        include_ranking_illusts = args.include_ranking_illusts, 
        bookmark_illust_ids = args.bookmark_illust_ids,
        include_privacy_policy = args.include_privacy_policy, 
        include_ranking_label = true,
        filter = 'for_ios',
    }
    local url = self.hosts..'/v1/illust/recommended'
    local option = {
        method = 'GET',
        parameters = args
    }
    local result = self:Request(url, option)
    return self:Decode(result.body)
end

---mode: [day, week, month, day_male, day_female, week_original, week_rookie, day_manga]
---date: '2016-08-01'
function AppApi:IllustRanking(args)
    args = args or {}
    args = {
        mode = args.mode or 'day',
        date = args.date or nil,
        offset = args.offset or nil,
        filter = 'for_ios'
    }
    local url = self.hosts..'/v1/illust/ranking'
    local option = {
        parameters = args
    }
    local result = self:Request(url, option)
    return self:Decode(result.body)
end

---search_target - 搜索类型
---  partial_match_for_tags  - 标签部分一致
---  exact_match_for_tags    - 标签完全一致
---  title_and_caption       - 标题说明文
---sort: [date_desc, date_asc, popular_desc] - popular_desc为会员的热门排序
---duration: [within_last_day, within_last_week, within_last_month]
---start_date, end_date: '2020-07-01'
function AppApi:SearchIllust(args)
    args = args or {}
    args = {
        word = args.word,
        search_target = args.search_target or 'partial_match_for_tags',
        sort = args.sort or 'date_desc',
        duration = args.duration or nil,
        start_date = args.start_date or nil, 
        end_date = args.end_date or nil, 
        offset = args.offset or nil,
        filter = 'for_ios'
    }
    local url = self.hosts..'/v1/search/illust'
    local option = {
        method = 'GET',
        parameters = args
    }
    local result = self:Request(url, option)
    return self:Decode(result.body)
end

return AppApi