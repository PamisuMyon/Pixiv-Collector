export default interface IScreen {
    // this will be called when navigate to / back to the screen
    // may be called several times because of pooling
    onNavTo(data?: any): void;
}