import CollectorApi from "../../api/collector-api";
import { Illust } from "../../api/entities";

export default abstract class BaseCollectorContoller {

    protected illusts: Illust[];
    
    public abstract refreshView(): void;

    public completeData(illusts: Illust[]) {
        for (const illust of illusts) {
            illust.imageUrl = illust.image_urls.large;
            const sp = illust.imageUrl.split('/');
            illust.imageKey = sp[sp.length - 1];
            illust.selected = false;
        }
    }

    public selectDataAt(index: number, isSelected: boolean) {
        this.illusts[index].selected = isSelected;
    }

    public clearSelection() {
        this.illusts.forEach(elem => {
            elem.selected = false;
        });
        this.refreshView();
    }

    public getDataAt(index: number) {
        return this.illusts[index];
    }

    public getItemNum() {
        if (!this.illusts)
            return 0;
        return this.illusts.length;
    }

    public async initCollection(illusts: Illust[]) {
        const ids: number[] = [];
        for (const illust of illusts) {
            ids.push(illust.id);
        }
        const info = await CollectorApi.instance.illustInfo(ids);
        if (!info || !info.data || info.data.length == 0) {
            for (const illust of illusts) {
                illust.collected = false;
            }
            return;
        }
        for (const illust of illusts) {
            let exist = false;
            for (const item of info.data) {
                if (item.id == illust.id) {
                    exist = true;
                    break;
                }
            }
            illust.collected = exist;
        }
    }

    public async collect() {
        const toCollect: Illust[] = [];
        for (const illust of this.illusts) {
            if (illust.selected && !illust.collected)
                toCollect.push(illust);
        }
        if (toCollect.length == 0) {
            console.log('Nothing to collect.');
            return;
        }
        const result = await CollectorApi.instance.illustPut(toCollect);
        console.log('Illust collect result: ' + result.msg)
        await this.initCollection(toCollect);
        this.clearSelection();
        this.refreshView();
    }

    public async delete() {
        const toDelete: Illust[] = [];
        for (const illust of this.illusts) {
            if (illust.selected && illust.collected)
                toDelete.push(illust);
        }
        if (toDelete.length == 0) {
            console.log('Nothing to delete.');
            return;
        }
        const ids: number[] = [];
        toDelete.forEach(e => {
            ids.push(e.id);
        });
        const result = await CollectorApi.instance.illustDelete(ids);
        console.log('Illust delete result: ' + result.msg)
        await this.initCollection(toDelete);
        this.clearSelection();
        this.refreshView();
    }
}