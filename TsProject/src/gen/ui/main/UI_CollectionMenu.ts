/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_CollectionMenu extends FairyGUI.GComponent {

	public m_c1: FairyGUI.Controller;
	public m_Collection: FairyGUI.GButton;
	public m_Close: FairyGUI.GButton;
	public m_SelectAll: FairyGUI.GButton;
	public m_Clear: FairyGUI.GButton;
	public m_Collect: FairyGUI.GButton;
	public m_Remove: FairyGUI.GButton;
	public m_CollectionBar: FairyGUI.GGroup;
	public static URL: string = "ui://paw0rq8stkn4ih";

	public static createInstance<T extends UI_CollectionMenu>(): T {
		const obj = <UI_CollectionMenu>(FairyGUI.UIPackage.CreateObject("main", "CollectionMenu"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_c1 = this.GetControllerAt(0);
		this.m_Collection = <FairyGUI.GButton>(this.GetChildAt(0));
		this.m_Close = <FairyGUI.GButton>(this.GetChildAt(1));
		this.m_SelectAll = <FairyGUI.GButton>(this.GetChildAt(3));
		this.m_Clear = <FairyGUI.GButton>(this.GetChildAt(5));
		this.m_Collect = <FairyGUI.GButton>(this.GetChildAt(7));
		this.m_Remove = <FairyGUI.GButton>(this.GetChildAt(9));
		this.m_CollectionBar = <FairyGUI.GGroup>(this.GetChildAt(10));
	}
}