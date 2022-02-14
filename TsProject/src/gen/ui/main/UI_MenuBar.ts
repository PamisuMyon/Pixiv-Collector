/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UI_CollectionMenu from "./UI_CollectionMenu";

import { FairyGUI } from "csharp";

export default class UI_MenuBar extends FairyGUI.GComponent {

	public m_Back: FairyGUI.GButton;
	public m_Menu: FairyGUI.GButton;
	public m_Search: FairyGUI.GButton;
	public m_Collection: UI_CollectionMenu;
	public m_MenuBar: FairyGUI.GGroup;
	public static URL: string = "ui://paw0rq8stkn4ic";

	public static createInstance<T extends UI_MenuBar>(): T {
		const obj = <UI_MenuBar>(FairyGUI.UIPackage.CreateObject("main", "MenuBar"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_Back = <FairyGUI.GButton>(this.GetChildAt(0));
		this.m_Menu = <FairyGUI.GButton>(this.GetChildAt(1));
		this.m_Search = <FairyGUI.GButton>(this.GetChildAt(2));
		this.m_Collection = <UI_CollectionMenu>(this.GetChildAt(3));
		this.m_MenuBar = <FairyGUI.GGroup>(this.GetChildAt(4));
	}
}