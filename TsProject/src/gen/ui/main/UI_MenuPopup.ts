/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_MenuPopup extends FairyGUI.GLabel {

	public m_list: FairyGUI.GList;
	public static URL: string = "ui://paw0rq8saapxjr";

	public static createInstance<T extends UI_MenuPopup>(): T {
		const obj = <UI_MenuPopup>(FairyGUI.UIPackage.CreateObject("main", "MenuPopup"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_list = <FairyGUI.GList>(this.GetChildAt(1));
	}
}