/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_StatusBar extends FairyGUI.GComponent {

	public m_title: FairyGUI.GTextField;
	public static URL: string = "ui://paw0rq8sqix0jt";

	public static createInstance<T extends UI_StatusBar>(): T {
		const obj = <UI_StatusBar>(FairyGUI.UIPackage.CreateObject("main", "StatusBar"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_title = <FairyGUI.GTextField>(this.GetChildAt(1));
	}
}