import { Pamisu } from "csharp";
import { $promise, $typeof } from "puerts";
import Settings from "../common/settings";
import Util from "../common/util";
import { Illust, RequestOption } from "./entities";

const apiPrefix = '/api/v1';

export default class CollectorApi {

    private networkManager: Pamisu.Common.NetworkManager;

    private static _instance: CollectorApi;
    public static get instance(): CollectorApi {
        if (!this._instance)
            this._instance = new CollectorApi();
        return this._instance;
    }
    private constructor() {
        this.networkManager = Pamisu.Common.NetworkManager.Instance;
    }

    private get serverUrl() {
        return Settings.config.collectorServer + apiPrefix;
    }

    private async request(url: string, option: RequestOption = null) {
        option = option || {};
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

    public async illustInfo(ids: number[]) {
        const url = this.serverUrl + '/illust/info';
        const body = {
            breifMode: true,
            ids
        };
        const option: RequestOption = {
            method: 'POST',
            headers: {
                ['Content-Type']: 'application/json'
            },
            body: JSON.stringify(body),
        }
        const result = await this.request(url, option);
        if (result)
            return this.parse(result.body);
    }

    public async illustPut(illusts: Illust[]) {
        const url = this.serverUrl + '/illust';
        const option: RequestOption = {
            method: 'PUT',
            headers: {
                ['Content-Type']: 'application/json'
            },
            body: JSON.stringify(illusts)
        };
        const result = await this.request(url, option);
        if (result)
            return this.parse(result.body);
    }

    public async illustDelete(ids: number[]) {
        const url = this.serverUrl + '/illust';
        const option: RequestOption = {
            method: 'DELETE',
            headers: {
                ['Content-Type']: 'application/json'
            },
            body: JSON.stringify(ids)
        };
        const result = await this.request(url, option);
        if (result)
            return this.parse(result.body);
    }

    public async illustList(offsetOid?: string) {
        const url = this.serverUrl + '/illust/list';
        const body = { offsetOid };
        const option: RequestOption = {
            method: 'POST',
            headers: {
                ['Content-Type']: 'application/json'
            },
            body: JSON.stringify(body),
        }
        const result = await this.request(url, option);
        if (result)
            return this.parse(result.body);
    }

}
