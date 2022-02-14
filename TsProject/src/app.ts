import './utils/source-map-support';
import UiMain from './ui/ui-main';
import Settings from './common/settings';
import PixivAppApi from './api/pixiv-app-api';

class PxkoreApplication {

    public loggedIn = false;

    constructor() {
        UiMain.instance.init();

        PixivAppApi.instance.setAddtionalHeaders({
            'Accept-Language': 'zh-cn'
        });

        Settings.updateProxySettings();
    }
}

export const app = new PxkoreApplication();