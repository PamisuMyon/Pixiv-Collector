/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_TagItem extends FairyGUI.GComponent {

	public m_title: FairyGUI.GTextField;
	public static URL: string = "ui://paw0rq8sqvrviz";

	public static createInstance<T extends UI_TagItem>(): T {
		const obj = <UI_TagItem>(FairyGUI.UIPackage.CreateObject("main", "TagItem"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_title = <FairyGUI.GTextField>(this.GetChildAt(1));
	}
}