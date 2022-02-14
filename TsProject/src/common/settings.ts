import { Pxkore, UnityEngine } from "csharp"
import PixivAppApi from "../api/pixiv-app-api";

interface Config {
    refreshToken?: string,
    proxyHost?: string,
    proxyPort?: number,
    collectorServer?: string,
    apiRequestInterval?: number,
}

const defaultConfig: Config = {
    refreshToken: '',
    proxyHost: '',
    proxyPort: 80,
    collectorServer: 'http://127.0.0.1:7007',
    apiRequestInterval: 1000,
}

export default class Settings {

    private static _config: Config;
    
    public static get config() {
        if (!this._config) {
            const str = UnityEngine.PlayerPrefs.GetString('config');
            if (str)
                this._config = JSON.parse(str);
            else
                this._config = defaultConfig;
        }
        return this._config
    }

    public static set config(value: Config) {
        const origin = this.config;
        if (value.refreshToken)
            origin.refreshToken = value.refreshToken;
        if (value.collectorServer)
            origin.collectorServer = value.collectorServer;
        if (value.apiRequestInterval != null
            && !isNaN(value.apiRequestInterval))
            origin.apiRequestInterval = Math.max(0, value.apiRequestInterval);
        this._config = origin;
        this.updateConfig();
    }

    private static updateConfig() {
        const str = JSON.stringify(this._config);
        UnityEngine.PlayerPrefs.SetString('config', str);
    }

    public static updateProxySettings(proxy?: string): any {
        let host: string, port: number;
        if (proxy) {
            const sp = proxy.split(':');
            host = sp[0];
            port = sp.length > 1 ? parseInt(sp[1]) : 80;
            this.config.proxyHost = host;
            this.config.proxyPort = port;
            this.updateConfig();
        }
        PixivAppApi.instance.setProxy(this.config.proxyHost, this.config.proxyPort);

        Pxkore.FImageLoader.GetInstance().AddHeader('Referer', 'https://www.pixiv.net');
        Pxkore.FImageLoader.GetInstance().SetProxy(this.config.proxyHost, this.config.proxyPort);
   }
   
}

