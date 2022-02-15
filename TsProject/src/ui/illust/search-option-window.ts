import { FairyGUI } from "csharp";
import UI_SearchOptionWindow from "../../gen/ui/main/UI_SearchOptionWindow";

export default class SearchOptionWindow extends UI_SearchOptionWindow {
    private window: FairyGUI.Window;
    public onApply: OnApply;

    protected onConstruct(): void {
        super.onConstruct();
        this.m_Offset.m_text.restrict = '[0-9]';
        this.m_MinBookMarks.m_text.restrict = '[0-9]';

        this.window = new FairyGUI.Window();
        this.window.contentPane = this;
        this.window.Center();
        this.window.modal = true;
        this.m_CancelButton.onClick.Set(() => {
            this.hide();
        });
        this.m_ConfirmButton.onClick.Set(() => {
            // Values of combo boxes were set in the FairyGUI project
            // check main/SearchOptionWindow component
            const option: SearchOption = {
                word: this.m_Keywords.m_text.text,
                search_target: this.m_Target1.value,
                sort: this.m_Order.value,
                offset: parseInt(this.m_Offset.m_text.text),
                minBookmarks: parseInt(this.m_MinBookMarks.m_text.text)
            };

            this.hide();
            if (this.onApply)
                this.onApply(option);
        });
    }

    public show() {
        FairyGUI.GRoot.inst.modalLayer.onClick.Set(() => {
            FairyGUI.GRoot.inst.modalLayer.onClick.Set(null);
            this.hide();
        });
        this.window.Show();
    }

    public hide() {
        FairyGUI.GRoot.inst.modalLayer.onClick.Set(null);
        this.window.Hide();
    }

    public get isShowing() {
        return this.window != null && this.window.isShowing;
    }

}

export interface SearchOption {
    word?: string;
    search_target?: string;
    sort?: string;
    offset?: number;
    minBookmarks?: number
}

interface OnApply {
    (option: SearchOption): void;
}