/**
 * Use this ui binder instead of gen/ui/main/xxxBinder.ts
 * because we got some extended ui classes to bind.
 */

import { bind } from "../gen/ui/main/fairygui";
import UI_Dropdown_popup from "../gen/ui/main/UI_Dropdown_popup";
import UI_IllustDetail from "../gen/ui/main/UI_IllustDetail";
import UI_ImageItem from "../gen/ui/main/UI_ImageItem";
import UI_ImageList from "../gen/ui/main/UI_ImageList";
import UI_InputField from "../gen/ui/main/UI_InputField";
import UI_MenuBar from "../gen/ui/main/UI_MenuBar";
import UI_RefreshFooter from "../gen/ui/main/UI_RefreshFooter";
import UI_StatusBar from "../gen/ui/main/UI_StatusBar";
import UI_TagItem from "../gen/ui/main/UI_TagItem";
import CollectionScreen from "./illust/collection-screen";
import IllustDetailScreen from "./illust/illust-detail-screen";
import GalleryScreen from "./illust/gallery-screen";
import SearchOptionWindow from "./illust/search-option-window";
import LoginScreen from "./login/login-screen";
import Navigator from "./navigator";
import SettingsWindow from "./settings-window";
import MenuPopup from "./menu-popup";
import UI_LoginPanel from "../gen/ui/main/UI_LoginPanel";
import UserDetailOptionWindow from "./illust/user-detail-option-window";

export default class UiBinder {
    public static bindAll() {
		// bind(UI_IllustGalleryScreen);
		// bind(UI_SearchOptionWindow);
		bind(UI_Dropdown_popup);
		// bind(UI_MenuPopup);
		bind(UI_RefreshFooter);
		// bind(UI_LoginScreen);
		// bind(UI_Navigator);
		bind(UI_InputField);
		// bind(UI_SettingsWindow);
		bind(UI_LoginPanel);
		bind(UI_StatusBar);
		// bind(UI_IllustDetailScreen);
		bind(UI_IllustDetail);
		bind(UI_TagItem);
		bind(UI_MenuBar);
		bind(UI_ImageList);
		bind(UI_ImageItem);

        // extend classes
		bind(Navigator);
        bind(LoginScreen);
		bind(MenuPopup);
		bind(SettingsWindow);
		bind(GalleryScreen);
		bind(IllustDetailScreen);
		bind(SearchOptionWindow);
		bind(CollectionScreen);
		bind(UserDetailOptionWindow);
    }
}