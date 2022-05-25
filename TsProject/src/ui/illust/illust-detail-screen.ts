import CSharp, { FairyGUI } from "csharp";
import { Illust } from "../../api/entities";
import UI_IllustDetailScreen from "../../gen/ui/main/UI_IllustDetailScreen";
import UI_TagItem from "../../gen/ui/main/UI_TagItem";
import IScreen, { NavigationMessage } from "../iscreen";
import UiMain from "../ui-main";
import GalleryScreen from "./gallery-screen";

export default class IllustDetailScreen extends UI_IllustDetailScreen implements IScreen {

    private illust: Illust;
    private clickTime = 0;

    protected onConstruct(): void {
        super.onConstruct();
        
        this.m_Back.onClick.Set(() => {
            UiMain.instance.navigator.navBack();
        });
    }

    public onNavTo(message: NavigationMessage): void {
        if (!message.data)
            return;
        this.illust = message.data as Illust;

        // image
        this.m_Image.url = this.illust.imageUrl;

        // detail
        this.m_Detail.m_Title.text = this.illust.title;
        this.m_Detail.m_Description.text = this.illust.caption;
        let details = 
`ID: [url=https://www.pixiv.net/artworks/${this.illust.id}]${this.illust.id}[/url]    Type: ${this.illust.type}
User: [url=user://${this.illust.user.id}]${this.illust.user.name}[/url]    Create Date: ${this.illust.create_date}
Bookmarks: ${this.illust.total_bookmarks}    View: ${this.illust.total_view}
Sanity Level: ${this.illust.sanity_level}    Pages: ${this.illust.page_count}`;
        this.m_Detail.m_Details.text = details;
        this.m_Detail.m_Details.onClickLink.Add((context: FairyGUI.EventContext) => {
            const time = new Date().getTime();
            if (time - this.clickTime < 500)
                return;
            this.clickTime = time;
            const url = context.data;
            if (/^http/.test(url)) {
                CSharp.UnityEngine.Application.OpenURL(url);
            } else if (/^user/.test(url)) {
                const data = { 
                    action: 'UserDetail',
                    userId: url.replace('user://', ''),
                };
                UiMain.instance.navigator.navTo(GalleryScreen.URL, data, false, false);
            }
        });

        // tags
        const tags: string[] = [];
        this.illust.tags.forEach(tag => {
            tags.push(tag.name);
            if (tag.translated_name)
                tags.push(tag.translated_name);
        });
        const tagList = this.m_Detail.m_Tags;
        tagList.RemoveChildrenToPool();
        for (const tag of tags) {
            const item = tagList.AddItemFromPool(UI_TagItem.URL) as UI_TagItem;
            item.m_title.text = tag;
        }
        
        // TODO tag edit
    }

    public onBackPressed(): void {
        UiMain.instance.navigator.navBack();
    }

}