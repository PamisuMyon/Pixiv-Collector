/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_Dropdown_popup extends FairyGUI.GComponent {

	public m_list: FairyGUI.GList;
	public static URL: string = "ui://paw0rq8saapxjk";

	public static createInstance<T extends UI_Dropdown_popup>(): T {
		const obj = <UI_Dropdown_popup>(FairyGUI.UIPackage.CreateObject("main", "Dropdown_popup"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_list = <FairyGUI.GList>(this.GetChildAt(1));
	}
}