import { FairyGUI } from "csharp";
import UI_MenuBar from "../gen/ui/main/UI_MenuBar";
import MenuPopup from "./menu-popup";
import UiMain from "./ui-main";

export enum MenuMode {
    Menu,
    MenuOnly
}

export default class MenuBar {

    private bar: UI_MenuBar;
    public menu: FairyGUI.GButton;
    public back: FairyGUI.GButton;
    public actions: FairyGUI.GList;
    public search: FairyGUI.GObject;
    public selectAll: FairyGUI.GObject;
    public clear: FairyGUI.GObject;
    public collect: FairyGUI.GObject;
    public remove: FairyGUI.GObject;

    private _menuPopup: MenuPopup;
    public get menuPopup() {
        if (!this._menuPopup) {
            this._menuPopup = MenuPopup.createInstance();
        }
        return this._menuPopup;
    }

    constructor(menubar: UI_MenuBar, mode: MenuMode = MenuMode.Menu, showSearch = true, showBack = false) {
        this.bar = menubar;
        this.menu = menubar.m_Menu;
        this.back = menubar.m_Back;
        this.actions = menubar.m_Actions;
        this.search = menubar.m_Actions.GetChild('Search');
        this.selectAll = menubar.m_Actions.GetChild('SelectAll');
        this.clear = menubar.m_Actions.GetChild('Clear');
        this.collect = menubar.m_Actions.GetChild('Collect');
        this.remove = menubar.m_Actions.GetChild('Remove');

        if (mode == MenuMode.Menu) {
            this.menuMode(showSearch, showBack);
        } else if (mode == MenuMode.MenuOnly) {
            this.menuOnlyMode();
        }
    }

    public onDispose() {
        if (this._menuPopup)
            this._menuPopup.Dispose();
    }

    private menuOnlyMode() {
        this.menu.visible = true;
        this.back.visible = false;
        this.actions.visible = false;
        this.registerMenuButton();
    }

    private menuMode(showSearch = true, showBack = false) {
        this.menu.visible = true;
        this.actions.visible = true;
        this.search.visible = showSearch;
        this.back.visible = showBack;
        this.registerMenuButton();
    }

    private registerMenuButton() {
        this.menu.onClick.Set(() => {
            this.menuPopup.show(this.bar.m_Menu);
        });
        this.back.onClick.Set(() => {
            this.onBackPressed();
        });
    }

    public toggleBackButton(showBack: boolean) {
        this.back.visible = showBack;
        this.menu.visible = !showBack;
    }

    public onBackPressed() {
        let handled = false;
        if (this._menuPopup)
            handled = this._menuPopup.onBackPressed();
        if (!handled && this.back.visible)
            UiMain.instance.navigator.navBack();
    }
}