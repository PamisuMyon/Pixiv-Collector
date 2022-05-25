import { Pamisu } from "csharp";
import { $promise, $typeof } from "puerts";
import Util from "../common/util";
import { Illust, RequestOption } from "./entities";

const clientId = 'MOBrBDS8blbauoSck0ZfDbtuzpyT';
const clientSecret = 'lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj';
const hashSecret = '28c1fdd170a5204386cb1313c7077b34f83e4aaf4aa829ce78c231e05b0bae2c';

export default class PixivAppApi {

    private userId = 0;
    private accessToken: string;
    private refreshToken: string ;
    private addtionalHeaders: any = {};
    private host = 'https://app-api.pixiv.net';
    private proxyHost: string;
    private proxyPort: number;
    private networkManager: Pamisu.Common.NetworkManager;

    private static _instance: PixivAppApi;

    public static get instance(): PixivAppApi {
        if (!this._instance)
            this._instance = new PixivAppApi();
        return this._instance;
    }

    private constructor() {
        this.networkManager = Pamisu.Common.NetworkManager.Instance;
    }

    public setHost(host: string) {
        this.host = host;
    }

    public setProxy(proxyHost: string, proxyPort: number) {
        this.proxyHost = proxyHost;
        this.proxyPort = proxyPort;
    }

    public setAddtionalHeaders(addtionalHeaders: any) {
        this.addtionalHeaders = addtionalHeaders;
    }

    private async request(url: string, option: RequestOption = null, auth = true) {
        console.log(`Requesting url: ${url} auth: ${auth}`);
        option = option || {};
        option.headers = option.headers || {};
        if (auth) {
            if (!this.accessToken) {
                console.log('Authentication required');
                return
            }
            option.headers['Authorization'] = `Bearer ${this.accessToken}`;
        }
        // common headers
        if (!option.headers['user-agent']) {
            option.headers['app-os'] = 'ios';
            option.headers['app-os-version'] = '14.6';
            option.headers['user-agent'] = 'PixivIOSApp/7.13.3 (iOS 14.6; iPhone13,2)';
        }
        // additional headers
        if (this.addtionalHeaders) {
            for (const key in this.addtionalHeaders) {
                option.headers[key] = this.addtionalHeaders[key];
            }
        }
        // proxy
        if (this.proxyHost) {
            option.proxyHost = this.proxyHost;
            option.proxyPort = this.proxyPort;
        }
        
        return await this.doRequest(url, option);
    }

    private async doRequest(url: string, option: RequestOption) {
        const opt = Util.jsToCharp(option, $typeof(Pamisu.Common.RequestOption));
        const result = await $promise(this.networkManager.RequestAsync(url, opt));
        if (result) 
            return result;
        else 
            console.error('Request error: ' + url);
    }

    public parse(str: string): any {
        try {
            return JSON.parse(str);
        } catch (error) {
            console.error('Json parse error.');
            console.log(error);
        }
    }

    public parseQueryString(url: string): any {
        if (!url)
            return null;
        let sp = url.split('?');
        sp = sp[1].split('&');
        const result: any = {};
        for (const item of sp) {
            const s = item.split('=');
            result[s[0]] = decodeURI(s[1]);
        }
        return result;
    }

    public async auth(refreshToken: string, headers?: any) {
        headers = headers || {};
        const time = Util.dateFormat('YY-mm-ddTHH:MM:SS+00:00', new Date());
        headers['x-client-time'] = time
        headers['x-client-hash'] = Pamisu.Common.Util.GetMD5Hash(time + hashSecret);
        const authHost = 'https://oauth.secure.pixiv.net';
        const url = authHost + '/auth/token';
        const data: any = {
            get_secure_url: '1',
            client_id: clientId,
            client_secret: clientSecret,
        };
        data.grant_type = 'refresh_token'
        data.refresh_token = refreshToken || this.refreshToken

        const option: RequestOption = {
            method: 'POST',
            headers,
            formUrlencodedDatas: data,
        };
        const result = await this.request(url, option, false);
        if (!result
            || [200, 301, 302].indexOf(result.statusCode) == -1) {
            console.error('Auth failed.');
            if (result) {
                console.log(`Status code: ${result.statusCode} Body: ${result.body}`);
            }
            return;
        }
        const obj = this.parse(result.body);
        if (obj) {
            this.userId = obj.user.id;
            this.accessToken = obj.access_token;
            this.refreshToken = obj.refresh_token;
            console.log(this.accessToken);
        }
        return obj;
    }

    public async illustDetail(illustId: string) {
        const url = this.host + '/v1/illust/detail';
        const option: RequestOption = {
            method: 'GET',
            parameters: {
                illust_id: illustId
            }
        };
        const result = await this.request(url, option);
        return this.parse(result.body);
    }

    public async illustRecommended(args: IllustRecommendedArguments) {
        args = args || {};
        args = {
            content_type: args.content_type || 'illust',
            max_bookmark_id_for_recommend: args.max_bookmark_id_for_recommend, 
            min_bookmark_id_for_recent_illust: args.min_bookmark_id_for_recent_illust,
            offset: args.offset || 0,
            include_ranking_illusts: args.include_ranking_illusts, 
            bookmark_illust_ids: args.bookmark_illust_ids,
            include_privacy_policy: args.include_privacy_policy, 
            include_ranking_label: true,
            filter: 'for_ios',
        };
        const url = this.host + '/v1/illust/recommended';
        const option: RequestOption = {
            method: 'GET',
            parameters: args
        };
        const result = await this.request(url, option);
        return this.parse(result.body) as IllustResult;
    }

    //search_target - 搜索类型
    //  partial_match_for_tags  - 标签部分一致
    //  exact_match_for_tags    - 标签完全一致
    //  title_and_caption       - 标题说明文
    //sort: [date_desc, date_asc, popular_desc] - popular_desc为会员的热门排序
    //duration: [within_last_day, within_last_week, within_last_month]
    //start_date, end_date: '2020-07-01'
    public async searchIllust(args: IllustSearchArguments) {
        args = args || {};
        args = {
            word: args.word,
            search_target: args.search_target || 'partial_match_for_tags',
            sort: args.sort || 'date_desc',
            duration: args.duration,
            start_date: args.start_date, 
            end_date: args.end_date, 
            offset: args.offset || 0,
            filter: 'for_ios'
        }
        const url = this.host + '/v1/search/illust';
        const option = {
            method: 'GET',
            parameters: args
        };
        const result = await this.request(url, option);
        return this.parse(result.body) as IllustResult;
    }

    public async userIllusts(args: UserIllustsArguments) {
        args = args || {};
        args = {
            user_id: args.user_id,
            type: args.type || 'illust',
            offset: args.offset || 0,
            filter: 'for_ios'
        }
        const url = this.host + '/v1/user/illusts';
        const option = {
            method: 'GET',
            parameters: args
        };
        const result = await this.request(url, option);
        return this.parse(result.body) as IllustResult;
    }

    public async userBookmarksIllust(args: UserBookmarksIllustArguments) {
        args = args || {};
        args = {
            user_id: args.user_id,
            max_bookmark_id: args.max_bookmark_id,
            tag: args.tag,
            restrict: 'public',
            filter: 'for_ios'
        }
        if (!args.max_bookmark_id)
            delete args.max_bookmark_id;
        if (!args.tag)
            delete args.tag;
        const url = this.host + '/v1/user/bookmarks/illust';
        const option = {
            method: 'GET',
            parameters: args
        };
        const result = await this.request(url, option);
        return this.parse(result.body) as IllustResult;
    }
    
}

interface IllustResult {
    illusts: Illust[]
    ranking_illusts?: Illust[]
    next_url: string
}

export interface IllustRecommendedArguments {
    content_type?: string,
    max_bookmark_id_for_recommend?: string, 
    min_bookmark_id_for_recent_illust?: string,
    offset?: number,
    bookmark_illust_ids?: string[],
    include_ranking_illusts?: boolean, 
    include_privacy_policy?: boolean, 
    include_ranking_label?: boolean,
    filter?: string,
}

export interface IllustSearchArguments {
    word?: string;
    search_target?: string;
    sort?: string;
    duration?: string;
    start_date?: string;
    end_date?: string;
    offset?: number;
    filter?: string;
}

export interface UserIllustsArguments {
    user_id?: number;
    offset?: number;
    type?: string;
    filter?: string;
}

export interface UserBookmarksIllustArguments {
    user_id?: number;
    max_bookmark_id?: number;
    restrict?: string;
    tag?: string;
    filter?: string;
}