import { FairyGUI } from "csharp";
import UI_Navigator from "../gen/ui/main/UI_Navigator"
import IScreen from "./iscreen";

type Screen = FairyGUI.GObject & IScreen;

export default class Navigator extends UI_Navigator {

    private navStack: Screen[] = [];
    private pool: FairyGUI.GObjectPool;

    protected onConstruct(): void {
        super.onConstruct();
        this.makeFullScreen(this);

        this.pool = new FairyGUI.GObjectPool(this.container.cachedTransform);
    }

    protected onDispose() {
        this.pool.Clear();
    }

    private makeFullScreen(obj: FairyGUI.GObject) {
        obj.MakeFullScreen();
        obj.AddRelation(FairyGUI.GRoot.inst, FairyGUI.RelationType.Size);
    }

    public clearNavStack() {
        while (this.navStack.length > 0) {
            const obj = this.navStack.pop();
            this.m_Container.RemoveChild(obj, true);
            // this.pool.ReturnObject(obj);
        }
    }

    public navTo(screenOrUrl: Screen | string, data?: any, clearStack = false, singleTop = true) {
        if (clearStack) {
            this.clearNavStack();
        } 

        let screen: Screen;
        if (typeof screenOrUrl == 'string') {
            if (singleTop && this.navStack.length > 0) {
                const top = this.navStack[this.navStack.length - 1];
                if (top.resourceURL == screenOrUrl)
                    return;
            }
            // pooling
            screen = this.pool.GetObject(screenOrUrl) as Screen;
        } else {
            if (singleTop && this.navStack.length > 0) {
                const top = this.navStack[this.navStack.length - 1];
                if (top.resourceURL == screenOrUrl.resourceURL)
                    return;
            }
            // without pooling
            screen = screenOrUrl;
        }

        this.makeFullScreen(screen);
        this.m_Container.AddChild(screen);
        this.navStack.push(screen);
        screen.onNavTo(data);
    }

    public navBack(data?: any, dispose = false) {
        if (this.navStack.length > 0) {
            const obj = this.navStack.pop();
            this.m_Container.RemoveChild(obj, dispose);
            if (!dispose)
                this.pool.ReturnObject(obj);
            if (this.navStack.length > 0) {
                this.navStack[this.navStack.length - 1].onNavTo(data);
            }
        }
    }

}