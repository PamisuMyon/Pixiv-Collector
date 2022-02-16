/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UI_IllustDetail from "./UI_IllustDetail";

import { FairyGUI } from "csharp";

export default class UI_IllustDetailScreen extends FairyGUI.GComponent {

	public m_Image: FairyGUI.GLoader;
	public m_Detail: UI_IllustDetail;
	public m_Back: FairyGUI.GButton;
	public static URL: string = "ui://paw0rq8sqvrviw";

	public static createInstance<T extends UI_IllustDetailScreen>(): T {
		const obj = <UI_IllustDetailScreen>(FairyGUI.UIPackage.CreateObject("main", "IllustDetailScreen"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_Image = <FairyGUI.GLoader>(this.GetChildAt(1));
		this.m_Detail = <UI_IllustDetail>(this.GetChildAt(2));
		this.m_Back = <FairyGUI.GButton>(this.GetChildAt(3));
	}
}