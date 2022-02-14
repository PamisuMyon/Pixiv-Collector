/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_Navigator extends FairyGUI.GComponent {

	public m_Container: FairyGUI.GComponent;
	public static URL: string = "ui://paw0rq8sgzsdin";

	public static createInstance<T extends UI_Navigator>(): T {
		const obj = <UI_Navigator>(FairyGUI.UIPackage.CreateObject("main", "Navigator"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_Container = <FairyGUI.GComponent>(this.GetChildAt(1));
	}
}