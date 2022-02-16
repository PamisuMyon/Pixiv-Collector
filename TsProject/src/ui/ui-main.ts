import { FairyGUI, Pamisu, Pxkore } from "csharp";
import { $promise, $typeof } from "puerts";
import UiBinder from "./ui-binder";
import LoginScreen from "./login/login-screen";
import Navigator from "./navigator";

export default class UiMain {

    private _navigator: Navigator;
    public get navigator() { return this._navigator; }

    private static _instance: UiMain;
    public static get instance() {
        if (!this._instance)
            this._instance = new UiMain();
        return this._instance;
    }
    private constructor() {}

    async init() {
        // set custom loader for images
        FairyGUI.UIObjectFactory.SetLoaderExtension($typeof(Pxkore.PxkoreGLoader));
        // add main package
        const assetManager = Pamisu.Common.AssetManager.Instance;
        await $promise(assetManager.AddFGUIPackage('main'));
        // bind all ui component classes
        UiBinder.bindAll();

        // show
        this._navigator = Navigator.createInstance();
        // no need to scale
        // FairyGUI.GRoot.inst.SetContentScaleFactor(1280, 800, FairyGUI.UIContentScaler.ScreenMatchMode.MatchWidthOrHeight);
        FairyGUI.GRoot.inst.AddChild(this._navigator);

        this.showLogin();
    }

    public showLogin() {
        const loginScreen = LoginScreen.createInstance<LoginScreen>();
        this.navigator.navTo(loginScreen);
    }

}
