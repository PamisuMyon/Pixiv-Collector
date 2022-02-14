/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UI_ImageList from "./UI_ImageList";
import UI_MenuBar from "./UI_MenuBar";

import { FairyGUI } from "csharp";

export default class UI_CollectionScreen extends FairyGUI.GComponent {

	public m_ImageList: UI_ImageList;
	public m_MenuBar: UI_MenuBar;
	public static URL: string = "ui://paw0rq8so6gwju";

	public static createInstance<T extends UI_CollectionScreen>(): T {
		const obj = <UI_CollectionScreen>(FairyGUI.UIPackage.CreateObject("main", "CollectionScreen"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_ImageList = <UI_ImageList>(this.GetChildAt(0));
		this.m_MenuBar = <UI_MenuBar>(this.GetChildAt(1));
	}
}