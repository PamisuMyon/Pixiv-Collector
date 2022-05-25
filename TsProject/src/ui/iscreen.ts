export default interface IScreen {

    /**
     * called when navigate to / back to the screen
     * may be called several times because of pooling
     * @param message navigation message
     */
    onNavTo(message: NavigationMessage): void;

    /**
     * called when escape / back event triggered
     */
    onBackPressed?(): void;
}

export interface NavigationMessage {
    isNavBack?: boolean;
    data?: any;
}