/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_MenuBar extends FairyGUI.GComponent {

	public m_Menu: FairyGUI.GButton;
	public m_Actions: FairyGUI.GList;
	public static URL: string = "ui://paw0rq8sfus5jv";

	public static createInstance<T extends UI_MenuBar>(): T {
		const obj = <UI_MenuBar>(FairyGUI.UIPackage.CreateObject("main", "MenuBar"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_Menu = <FairyGUI.GButton>(this.GetChildAt(1));
		this.m_Actions = <FairyGUI.GList>(this.GetChildAt(2));
	}
}