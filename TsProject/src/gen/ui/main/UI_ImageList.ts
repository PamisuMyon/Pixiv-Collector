/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_ImageList extends FairyGUI.GComponent {

	public m_ImageList: FairyGUI.GList;
	public static URL: string = "ui://paw0rq8stkn4id";

	public static createInstance<T extends UI_ImageList>(): T {
		const obj = <UI_ImageList>(FairyGUI.UIPackage.CreateObject("main", "ImageList"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_ImageList = <FairyGUI.GList>(this.GetChildAt(0));
	}
}