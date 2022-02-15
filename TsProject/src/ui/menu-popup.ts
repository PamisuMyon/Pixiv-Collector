import { FairyGUI } from "csharp";
import { app } from "../app";
import UI_MenuPopup from "../gen/ui/main/UI_MenuPopup";
import CollectionScreen from "./illust/collection-screen";
import GalleryScreen from "./illust/gallery-screen";
import LoginScreen from "./login/login-screen";
import SettingsWindow from "./settings-window";
import UiMain from "./ui-main";

export default class MenuPopup extends UI_MenuPopup {

    private window: FairyGUI.Window;
    private _settingsWindow: SettingsWindow;
    private get settingsWindow() {
        if (!this._settingsWindow)
            this._settingsWindow = SettingsWindow.createInstance();
        return this._settingsWindow
    }

    protected onConstruct(): void {
        super.onConstruct();
        this.window = new FairyGUI.Window();
        this.window.contentPane = this;
        this.window.modal = true;

        this.m_list.onClickItem.Set(context => {
            if (context.data) {
                const index = this.m_list.GetChildIndex(context.data);
                if (index == 0) {
                    if (app.loggedIn)
                        UiMain.instance.navigator.navTo(GalleryScreen.URL, null, true);
                    else 
                        UiMain.instance.navigator.navTo(LoginScreen.URL, null, true);
                } else if (index == 1) {
                    UiMain.instance.navigator.navTo(CollectionScreen.URL, null, true);
                } else if (index == 2) {
                    this.settingsWindow.show();
                }
            }
            this.hide();
        });
    }

    protected onDispose() {
        if (this._settingsWindow)
            this._settingsWindow.Dispose();
    }

    public show(target: FairyGUI.GObject) {
        FairyGUI.GRoot.inst.ShowPopup(this.window, target);
    }

    public hide() {
        FairyGUI.GRoot.inst.HidePopup(this.window);
    }

    public onBackPressed() {
        if (this._settingsWindow && this._settingsWindow.isShowing) {
            this._settingsWindow.hide();
        } else if (this.window && this.window.isShowing) {
            this.hide();
        }
    }
    
}