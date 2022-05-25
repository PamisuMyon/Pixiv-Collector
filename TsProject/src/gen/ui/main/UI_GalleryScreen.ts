/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UI_ImageList from "./UI_ImageList";
import UI_StatusBar from "./UI_StatusBar";
import UI_MenuBar from "./UI_MenuBar";

import { FairyGUI } from "csharp";

export default class UI_GalleryScreen extends FairyGUI.GComponent {

	public m_ImageList: UI_ImageList;
	public m_StatusBar: UI_StatusBar;
	public m_MenuBar: UI_MenuBar;
	public static URL: string = "ui://paw0rq8s100ri0";

	public static createInstance<T extends UI_GalleryScreen>(): T {
		const obj = <UI_GalleryScreen>(FairyGUI.UIPackage.CreateObject("main", "GalleryScreen"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_ImageList = <UI_ImageList>(this.GetChildAt(1));
		this.m_StatusBar = <UI_StatusBar>(this.GetChildAt(2));
		this.m_MenuBar = <UI_MenuBar>(this.GetChildAt(3));
	}
}