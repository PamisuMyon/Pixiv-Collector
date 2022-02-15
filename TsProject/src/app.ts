import './common/source-map-support';
import UiMain from './ui/ui-main';
import Settings from './common/settings';
import PixivAppApi from './api/pixiv-app-api';
import EventEmitter from './common/event-emitter';
import { Pxkore } from 'csharp';

class PxkoreApplication {

    private _emitter: EventEmitter;
    public get emitter() {
        if (!this._emitter)
            this._emitter = new EventEmitter();
        return this._emitter;
    }

    public loggedIn = false;

    constructor() {
        const manager = Pxkore.JsManager.GetInstance();
        manager.jsUpdate = this.update.bind(this);

        UiMain.instance.init();

        PixivAppApi.instance.setAddtionalHeaders({
            'Accept-Language': 'zh-cn'
        });

        Settings.updateProxySettings();
    }

    private update() {
        this.emitter.emit('update');
    }
}

export const app = new PxkoreApplication();