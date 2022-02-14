import { FairyGUI } from "csharp";
import Settings from "../common/settings";
import UI_SettingsWindow from "../gen/ui/main/UI_SettingsWindow";

export default class SettingsWindow extends UI_SettingsWindow {

    private window: FairyGUI.Window;

    protected onConstruct(): void {
        super.onConstruct();
        this.window = new FairyGUI.Window();
        this.window.contentPane = this;
        this.window.Center();
        this.window.modal = true;
        this.m_CancelButton.onClick.Set(() => {
            this.hide();
        });
        this.m_ConfirmButton.onClick.Set(() => {
            this.applyValues();
            this.hide();
        });
    }

    public show() {
        this.initValues();
        this.window.Show();
        FairyGUI.GRoot.inst.modalLayer.onClick.Set(() => {
            FairyGUI.GRoot.inst.modalLayer.onClick.Set(null);
            this.hide();
        });
    }

    public hide() {
        FairyGUI.GRoot.inst.modalLayer.onClick.Set(null);
        this.window.Hide();
    }

    private initValues() {
        const config = Settings.config;
        this.m_ProxyInput.m_text.text = config.proxyHost + ':' + config.proxyPort;
        this.m_CollectorServerInput.m_text.text = config.collectorServer;
        this.m_RequestIntervalInput.m_text.text = config.apiRequestInterval + '';
    }

    private applyValues() {
        Settings.updateProxySettings(this.m_ProxyInput.m_text.text);
        Settings.config = {
            collectorServer: this.m_CollectorServerInput.m_text.text,
            apiRequestInterval: parseInt(this.m_RequestIntervalInput.m_text.text)
        };
    }
}