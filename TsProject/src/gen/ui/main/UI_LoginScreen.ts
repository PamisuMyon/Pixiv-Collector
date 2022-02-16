/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UI_MenuBar from "./UI_MenuBar";
import UI_LoginPanel from "./UI_LoginPanel";

import { FairyGUI } from "csharp";

export default class UI_LoginScreen extends FairyGUI.GComponent {

	public m_Menu: UI_MenuBar;
	public m_Panel: UI_LoginPanel;
	public static URL: string = "ui://paw0rq8sgzsdim";

	public static createInstance<T extends UI_LoginScreen>(): T {
		const obj = <UI_LoginScreen>(FairyGUI.UIPackage.CreateObject("main", "LoginScreen"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_Menu = <UI_MenuBar>(this.GetChildAt(1));
		this.m_Panel = <UI_LoginPanel>(this.GetChildAt(2));
	}
}