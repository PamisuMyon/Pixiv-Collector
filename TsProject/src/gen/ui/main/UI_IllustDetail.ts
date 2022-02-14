/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_IllustDetail extends FairyGUI.GComponent {

	public m_Title: FairyGUI.GTextField;
	public m_Description: FairyGUI.GTextField;
	public m_Details: FairyGUI.GTextField;
	public m_Tags: FairyGUI.GList;
	public static URL: string = "ui://paw0rq8sqvrviy";

	public static createInstance<T extends UI_IllustDetail>(): T {
		const obj = <UI_IllustDetail>(FairyGUI.UIPackage.CreateObject("main", "IllustDetail"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_Title = <FairyGUI.GTextField>(this.GetChildAt(0));
		this.m_Description = <FairyGUI.GTextField>(this.GetChildAt(1));
		this.m_Details = <FairyGUI.GTextField>(this.GetChildAt(2));
		this.m_Tags = <FairyGUI.GList>(this.GetChildAt(3));
	}
}