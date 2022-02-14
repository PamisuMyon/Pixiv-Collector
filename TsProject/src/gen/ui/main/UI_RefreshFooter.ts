/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_RefreshFooter extends FairyGUI.GComponent {

	public m_c1: FairyGUI.Controller;
	public m_c2: FairyGUI.Controller;
	public m_title: FairyGUI.GTextField;
	public m_hint: FairyGUI.GTextField;
	public m_t0: FairyGUI.Transition;
	public static URL: string = "ui://paw0rq8sg4wrj2";

	public static createInstance<T extends UI_RefreshFooter>(): T {
		const obj = <UI_RefreshFooter>(FairyGUI.UIPackage.CreateObject("main", "RefreshFooter"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_c1 = this.GetControllerAt(0);
		this.m_c2 = this.GetControllerAt(1);
		this.m_title = <FairyGUI.GTextField>(this.GetChildAt(1));
		this.m_hint = <FairyGUI.GTextField>(this.GetChildAt(2));
		this.m_t0 = this.GetTransitionAt(0);
	}
}