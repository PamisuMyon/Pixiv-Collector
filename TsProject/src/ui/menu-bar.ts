import UI_MenuBar from "../gen/ui/main/UI_MenuBar";
import MenuPopup from "./menu-popup";

export enum MenuMode {
    Menu,
    MenuOnly,
    Back
}

export default class MenuBar {

    private menu: UI_MenuBar;

    private _menuPopup: MenuPopup;
    public get menuPopup() {
        if (!this._menuPopup) {
            this._menuPopup = MenuPopup.createInstance();
        }
        return this._menuPopup;
    }

    constructor(menu: UI_MenuBar, mode: MenuMode = MenuMode.Menu, showSearch = true) {
        this.menu = menu;
        if (mode == MenuMode.Menu) {
            this.menuMode(showSearch);
        } else if (mode == MenuMode.MenuOnly) {
            this.menuOnlyMode();
        } else if (mode == MenuMode.Back) {
            this.backMode();
        }
    }

    public onDispose() {
        if (this._menuPopup)
            this._menuPopup.Dispose();
    }

    private backMode() {
        this.menu.m_Back.visible = true;
        this.menu.m_Menu.visible = false;
        this.menu.m_Search.visible = false;
        this.menu.m_Collection.visible = false;
    }

    private menuOnlyMode() {
        this.menu.m_Back.visible = false;
        this.menu.m_Menu.visible = true;
        this.menu.m_Search.visible = false;
        this.menu.m_Collection.visible = false;
        this.registerMenuButton();
    }

    private menuMode(showSearch = true) {
        this.menu.m_Back.visible = false;
        this.menu.m_Menu.visible = true;
        this.menu.m_Search.visible = showSearch;
        this.menu.m_Collection.visible = true;

        this.registerMenuButton();
        this.menu.m_Collection.m_Collection.onClick.Set(() => {
            this.menu.m_Collection.m_c1.selectedIndex = 1;
        });
        this.menu.m_Collection.m_Close.onClick.Set(() => {
            this.menu.m_Collection.m_c1.selectedIndex = 0;
        });
    }

    private registerMenuButton() {
        this.menu.m_Menu.onClick.Set(() => {
            this.menuPopup.show(this.menu.m_Menu);
        });
    }
}