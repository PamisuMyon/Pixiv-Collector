import Settings from "../../common/settings";
import UI_LoginScreen from "../../gen/ui/main/UI_LoginScreen";
import MenuBar, { MenuMode } from "../menu-bar";
import GalleryScreen from "../illust/gallery-screen";
import UiMain from "../ui-main";import LoginController from "./login-controller";
import IScreen from "../iscreen";
import { app } from "../../app";

export default class LoginScreen extends UI_LoginScreen implements IScreen {

    private controller: LoginController;
    private menubar: MenuBar;

    constructor() {
        super();
        this.controller = new LoginController();
    }

    protected onConstruct(): void {
        super.onConstruct();
        this.menubar = new MenuBar(this.m_Menu, MenuMode.MenuOnly);

        // TODO auto login
        // fill refresh token input
        const refreshToken = Settings.config.refreshToken;
        this.m_Panel.m_TokenInput.m_text.text = refreshToken;

        this.m_Panel.m_LoginButton.onClick.Set(() => {
            this.onLoginButtonClick();
        });
    }

    private async onLoginButtonClick() {
        const token = this.m_Panel.m_TokenInput.m_text.text
        if (!token)
            return;
        this.m_Panel.m_LoginButton.enabled = false;
        this.m_Panel.m_HintText.text = '';
        const b = await this.controller.login(token);
        if (b) {
            console.log('Login succeed!');
            Settings.config = { refreshToken: token }
            // navigate to gallery
            // const illustGallery = IllustGalleryScreen.createInstance<IllustGalleryScreen>();
            app.loggedIn = true;
            UiMain.instance.navigator.navTo(GalleryScreen.URL, null, true);
        } else {
            this.m_Panel.m_HintText.text = 'Login failed.'
            this.m_Panel.m_LoginButton.enabled = true;
        }
    }

    protected onDispose() {
        if (this.menubar) {
            this.menubar.onDispose();
        }
    }

    public onNavTo(message: any): void {
    }

    public onBackPressed(): void {
        if (this.menubar)
            this.menubar.onBackPressed();
    }

}
