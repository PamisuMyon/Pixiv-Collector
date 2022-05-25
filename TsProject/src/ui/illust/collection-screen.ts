import { FairyGUI } from "csharp";
import UI_CollectionScreen from "../../gen/ui/main/UI_CollectionScreen";
import UI_ImageItem from "../../gen/ui/main/UI_ImageItem";
import IScreen from "../iscreen";
import MenuBar, { MenuMode } from "../menu-bar";
import UiMain from "../ui-main";
import CollectionController from "./collection-controller";
import IllustDetailScreen from "./illust-detail-screen";

export default class CollectionScreen extends UI_CollectionScreen implements IScreen {

    private controller: CollectionController;
    private menubar: MenuBar;
    private imageList: FairyGUI.GList;

    constructor() {
        super();
        this.controller = new CollectionController(this);
    }

    protected onConstruct(): void {
        super.onConstruct();
        // menu actions
        this.menubar = new MenuBar(this.m_MenuBar, MenuMode.Menu, false);
        this.menubar.selectAll.onClick.Set(() => {
            this.selectCurrentPage();
        });
        this.menubar.clear.onClick.Set(() => {
            this.controller.clearSelection();
        });
        this.menubar.collect.onClick.Set(() => {
            this.controller.collect();
        });
        this.menubar.remove.onClick.Set(() => {
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

        this.controller.getCollection();
    }

    protected onDispose() {
        if (this.menubar) {
            this.menubar.onDispose();
        }
    }

    public onNavTo(message: any): void {
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

    public setNoMore(noMore = true) {
        const footer = this.imageList.scrollPane.footer;
        const c2 = footer.GetController('c2');
        c2.selectedIndex = noMore? 1 : 0;
    }

}