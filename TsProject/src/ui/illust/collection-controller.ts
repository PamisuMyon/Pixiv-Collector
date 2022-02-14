import CollectionScreen from "./collection-screen";
import BaseCollectorContoller from "./base-collector-controller";
import CollectorApi from "../../api/collector-api";
import { Illust } from "../../api/entities";

export default class CollectionController extends BaseCollectorContoller {

    private view: CollectionScreen;

    constructor(view: CollectionScreen) {
        super();
        this.view = view;
    }

    public refreshView(): void {
        this.view.refresh();
    }

    public override completeData(illusts: Illust[]) {
        for (const illust of illusts) {
            const item = illust as any;
            illust.imageUrl = item.urls.large;
            const sp = illust.imageUrl.split('/');
            illust.imageKey = sp[sp.length - 1];
            illust.user = {
                id: item.author_id,
                name: item.author_name
            }
            const tags = new Array();
            item.tags.forEach((it: any) => {
                tags.push({name: it});
            });
            illust.tags = tags;
            illust.selected = false;
            illust.collected = true;
        }
    }

    public async getCollection(offsetOid?: string) {
        if (!offsetOid) {
            this.illusts = [];
            this.refreshView();   
        }
        const result = await CollectorApi.instance.illustList(offsetOid);
        const illusts = result.data as Illust[];
        this.completeData(illusts);
        this.illusts.push(...illusts);
        this.refreshView();
    }

    public async nextPage() {
        if (this.illusts && this.illusts.length > 0) {
            const oid = this.illusts[this.illusts.length - 1]._id;
            await this.getCollection(oid);
        }
    }
}