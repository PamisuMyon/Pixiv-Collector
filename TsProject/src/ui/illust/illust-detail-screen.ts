import { Illust } from "../../api/entities";
import UI_IllustDetailScreen from "../../gen/ui/main/UI_IllustDetailScreen";
import UI_TagItem from "../../gen/ui/main/UI_TagItem";
import IScreen from "../iscreen";
import MenuBar, { MenuMode } from "../menu-bar";
import UiMain from "../ui-main";

export default class IllustDetailScreen extends UI_IllustDetailScreen implements IScreen {

    private illust: Illust;
    private menubar: MenuBar;

    protected onConstruct(): void {
        super.onConstruct();
        // menu actions
        this.menubar = new MenuBar(this.m_MenuBar, MenuMode.Back);
        this.m_MenuBar.m_Back.onClick.Set(() => {
            UiMain.instance.navigator.navBack();
        });
    }

    public onNavTo(data?: any): void {
        if (!data)
            return;
        this.illust = data as Illust;

        // image
        this.m_Image.url = this.illust.imageUrl;

        // detail
        this.m_Detail.m_Title.text = this.illust.title;
        this.m_Detail.m_Description.text = this.illust.caption;
        let details = 
`ID: ${this.illust.id}
User: ${this.illust.user.name}    Create Date: ${this.illust.create_date}
Bookmarks: ${this.illust.total_bookmarks}    View: ${this.illust.total_view}
Sanity Level: ${this.illust.sanity_level}    Pages: ${this.illust.page_count}`;
        this.m_Detail.m_Details.text = details;

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

}