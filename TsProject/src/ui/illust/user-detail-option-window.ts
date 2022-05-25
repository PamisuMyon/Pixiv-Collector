import { FairyGUI } from "csharp";
import UI_UserDetailOptionWindow from "../../gen/ui/main/UI_UserDetailOptionWindow";


export default class UserDetailOptionWindow extends UI_UserDetailOptionWindow {
    private window: FairyGUI.Window;
    public onApply: OnApply;

    protected onConstruct(): void {
        super.onConstruct();
        this.m_Offset.m_text.restrict = '[0-9]';

        this.window = new FairyGUI.Window();
        this.window.contentPane = this;
        this.window.Center();
        this.window.modal = true;
        this.m_CancelButton.onClick.Set(() => {
            this.hide();
        });
        this.m_ConfirmButton.onClick.Set(() => {
            // Values of combo boxes were set in the FairyGUI project
            // check main/UserDetailOptionWindow component
            const option: UserDetailOption = {
                user_id: parseInt(this.m_Keywords.m_text.text),
                action: this.m_Target1.value,
                offset: parseInt(this.m_Offset.m_text.text),
            };
            if (!isNaN(option.offset) && option.action == 'user_bookmarks_illust') {
                option.max_bookmark_id = option.offset;
            }

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

export interface UserDetailOption {
    user_id?: number;
    offset?: number;
    max_bookmark_id?: number;
    restrict?: string;
    action: string,
}

interface OnApply {
    (option: UserDetailOption): void;
}