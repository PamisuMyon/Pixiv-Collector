import { FairyGUI } from "csharp";
import UI_ImageItem from "../../gen/ui/main/UI_ImageItem";
import MenuBar from "../menu-bar";
import GalleryController from "./gallery-controller";
import IllustDetailScreen from "./illust-detail-screen";
import UiMain from "../ui-main";
import IScreen from "../iscreen";
import SearchOptionWindow from "./search-option-window";
import UI_GalleryScreen from "../../gen/ui/main/UI_GalleryScreen";

export default class GalleryScreen extends UI_GalleryScreen implements IScreen {

    private controller: GalleryController;
    private menubar: MenuBar;
    private imageList: FairyGUI.GList;
    private searchOptionWindow: SearchOptionWindow;

    constructor() {
        super();
        this.controller = new GalleryController(this);
    }

    protected onConstruct(): void {
        super.onConstruct();

        this.searchOptionWindow = SearchOptionWindow.createInstance();
        this.searchOptionWindow.onApply = option => {
            this.controller.search(null, option);
        };

        // menu actions
        this.menubar = new MenuBar(this.m_MenuBar);
        this.m_MenuBar.m_Search.onClick.Set(() => {
            this.searchOptionWindow.show();
        });
        const collectionMenu = this.m_MenuBar.m_Collection;
        collectionMenu.m_SelectAll.onClick.Set(() => {
            this.selectCurrentPage();
        });
        collectionMenu.m_Clear.onClick.Set(() => {
            this.controller.clearSelection();
        });
        collectionMenu.m_Collect.onClick.Set(() => {
            this.controller.collect();
        });
        collectionMenu.m_Remove.onClick.Set(() => {
            this.controller.delete();
        });

        // image list
        this.imageList = this.m_ImageList.m_ImageList;
        this.imageList.SetVirtual();
        // scrollStep will be changed to item's size when calling SetVirtual
        // so do this after that if you want to change it
        this.imageList.scrollPane.scrollStep /= 3;
        this.imageList.scrollPane.onPullUpRelease.Set(() => {
            this.onPullUpRefresh();
        });
        this.imageList.itemRenderer = (index: number, obj: FairyGUI.GObject) => {
            this.onRenderItem(index, obj);
        };

        this.controller.getRecommended();
    }

    protected onDispose() {
        if (this.menubar) {
            this.menubar.onDispose();
        }
    }

    public onNavTo(data: any): void {
    }

    private onRenderItem(index: number, obj: FairyGUI.GObject) {
        const item = obj as UI_ImageItem;
        const data = this.controller.getDataAt(index);
        item.m_Image.url = data.imageUrl;
        item.m_Image.onClick.Set(() => {
            // navigate to detail
            UiMain.instance.navigator.navTo(IllustDetailScreen.URL, data);
        });
        item.m_CollectedIcon.visible = data.collected? data.collected : false;
        item.m_SelectRadio.selected = data.selected? data.selected : false;
        item.m_SelectRadio.onChanged.Set(() => {
            this.controller.getDataAt(index).selected = item.m_SelectRadio.selected;
        });
    }

    private async onPullUpRefresh() {
        const footer = this.imageList.scrollPane.footer;
        const c1 = footer.GetController('c1');
        c1.selectedIndex = 1;
        this.imageList.scrollPane.LockFooter(footer.sourceHeight);
        await this.controller.nextPage();
        c1.selectedIndex = 0;
        this.imageList.scrollPane.LockFooter(0);
    }

    private selectCurrentPage() {
        for (let i = 0; i < this.imageList.numChildren; i++) {
            const child = this.imageList.GetChildAt(i) as UI_ImageItem;
            child.m_SelectRadio.selected = true;
        }
    }

    public refresh() {
        this.imageList.numItems = this.controller.getItemNum();
        this.imageList.RefreshVirtualList();
    }

    public updateStatus(show: boolean, total?: number, actual?: number) {
        this.m_StatusBar.visible = show;
        if (show) {
            this.m_StatusBar.m_title.text = `total: ${total} actual: ${actual}`;
        }
    }

    public setNoMore(noMore = true) {
        const footer = this.imageList.scrollPane.footer;
        const c2 = footer.GetController('c2');
        c2.selectedIndex = noMore? 1 : 0;
    }
    
}
