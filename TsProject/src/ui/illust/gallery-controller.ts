import { Illust } from "../../api/entities";
import PixivAppApi, { IllustSearchArguments, UserIllustsArguments } from "../../api/pixiv-app-api";
import Settings from "../../common/settings";
import Util from "../../common/util";
import CollectorContoller from "./base-collector-controller";
import type GalleryScreen from "./gallery-screen";
import { SearchOption } from "./search-option-window";
import { UserDetailOption } from "./user-detail-option-window";

enum DataType {
    None,
    Recommended,
    Search,
    UserIllusts,
    UserBookmarksIllust,
}

export default class GalleryController extends CollectorContoller {
    private view: GalleryScreen;
    private dataType = DataType.None;
    private cancelToken: string;
    private nextUrl: string;
    private searchOption: SearchOption;
    private userDetailOption: UserDetailOption;

    constructor(view: GalleryScreen) {
        super();
        this.view = view;
    }

    public refreshView(): void {
        this.view.refresh();
    }

    public async getRecommended(nextUrl?: string) {
        this.view.updateStatus(false);

        if (this.dataType != DataType.Recommended
            || !nextUrl) {
            this.dataType = DataType.Recommended;
            this.illusts = [];
            this.refreshView();
        }
        const cancelToken = Util.generateToken();
        this.cancelToken = cancelToken;
        let args: any;
        if (nextUrl) {
            args = PixivAppApi.instance.parseQueryString(nextUrl);
        }
        const result = await PixivAppApi.instance.illustRecommended(args);
        // if token mismatch, cancel this request
        if (cancelToken != this.cancelToken) {
            return;
        }
        this.nextUrl = result.next_url;

        // complete data & update view
        this.completeData(result.illusts);
        await this.initCollection(result.illusts);
        this.illusts.push(...result.illusts);
        this.refreshView();
    }

    public async search(nextUrl?: string, option?: SearchOption, numToFill = -1) {
        let args: IllustSearchArguments;
        if (nextUrl) {
            args = PixivAppApi.instance.parseQueryString(nextUrl) as IllustSearchArguments;
        } else {
            args = option || {};
            if (!args.word) {
                await this.getRecommended();
                return;
            }
        }

        if (this.dataType != DataType.Search
            || !nextUrl) {
            this.dataType = DataType.Search;
            this.illusts = [];
            this.refreshView();
        }
        const cancelToken = Util.generateToken();
        this.cancelToken = cancelToken;

        const result = await PixivAppApi.instance.searchIllust(args);
        // if token mismatch, cancel this request
        if (cancelToken != this.cancelToken) {
            return;
        }
        this.nextUrl = result.next_url;
        this.searchOption = option;
        if (option.minBookmarks && option.minBookmarks > 0) {
            // filter results
            const filtered = this.filterIllusts(result.illusts, option.minBookmarks);
            if (numToFill == -1)
                numToFill = 30;
            if (this.nextUrl && filtered.length < numToFill) {
                numToFill = numToFill - filtered.length;
            } else {
                numToFill = 0;
            }
            result.illusts = filtered;
        }

        // complete data & update view
        this.completeData(result.illusts);
        await this.initCollection(result.illusts);
        this.illusts.push(...result.illusts);
        this.refreshView();

        let total = isNaN(args.offset)? 0 : parseInt(args.offset as any);
        total += 30;
        this.view.updateStatus(true, total, this.illusts.length);

        // do another request when the page needs to be filled
        if (numToFill > 0) {
            console.log(`Search results less than one page after filtering, num to fill: ${numToFill}`)
            const interval = Settings.config.apiRequestInterval;
            Util.sleep(interval).then(() => {
                console.log('Slept');
                this.search(this.nextUrl, this.searchOption, numToFill);
            });
        }
    }

    public async getUserIllusts(nextUrl?: string, option?: UserDetailOption) {
        let args;
        if (nextUrl) {
            args = PixivAppApi.instance.parseQueryString(nextUrl);
        } else {
            args = option || {};
        }

        const targetDataType = option.action == 'user_bookmarks_illust'? 
            DataType.UserBookmarksIllust : DataType.UserIllusts;
        if (this.dataType != targetDataType || !nextUrl) {
            this.dataType = targetDataType;
            this.illusts = [];
            this.refreshView();
        }

        const cancelToken = Util.generateToken();
        this.cancelToken = cancelToken;

        let result: any;
        if (option.action == 'user_bookmarks_illust')
            result = await PixivAppApi.instance.userBookmarksIllust(args);
        else
            result = await PixivAppApi.instance.userIllusts(args);
        
        // if token mismatch, cancel this request
        if (cancelToken != this.cancelToken) {
            return;
        }
        this.nextUrl = result.next_url;
        this.userDetailOption = option;
        
        // complete data & update view
        this.completeData(result.illusts);
        await this.initCollection(result.illusts);
        this.illusts.push(...result.illusts);
        this.refreshView();
    }

    private filterIllusts(illusts: Illust[], minBookmarks: number) {
        const r = new Array<Illust>();
        illusts.forEach(it => {
            if (it.total_bookmarks >= minBookmarks)
                r.push(it);
        });
        return r;
    }

    public async nextPage() {
        if (!this.nextUrl)
            return;
        if (this.dataType == DataType.Recommended) {
            await this.getRecommended(this.nextUrl);
        } else if (this.dataType == DataType.Search) {
            await this.search(this.nextUrl, this.searchOption);
        } else if (this.dataType == DataType.UserIllusts) {
            await this.getUserIllusts(this.nextUrl, this.userDetailOption);
        } else if (this.dataType == DataType.UserBookmarksIllust) {
            await this.getUserIllusts(this.nextUrl, this.userDetailOption);
        }
    }

}