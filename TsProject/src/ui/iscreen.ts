export default interface IScreen {

    /**
     * called when navigate to / back to the screen
     * may be called several times because of pooling
     * @param data data to pass
     */
    onNavTo(data?: any): void;

    /**
     * called when escape / back event triggered
     */
    onBackPressed?(): void;
}