/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UI_InputField from "./UI_InputField";
import UI_MenuBar from "./UI_MenuBar";

import { FairyGUI } from "csharp";

export default class UI_LoginScreen extends FairyGUI.GComponent {

	public m_TokenInput: UI_InputField;
	public m_LoginButton: FairyGUI.GButton;
	public m_HintText: FairyGUI.GTextField;
	public m_Menu: UI_MenuBar;
	public static URL: string = "ui://paw0rq8sgzsdim";

	public static createInstance<T extends UI_LoginScreen>(): T {
		const obj = <UI_LoginScreen>(FairyGUI.UIPackage.CreateObject("main", "LoginScreen"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_TokenInput = <UI_InputField>(this.GetChildAt(1));
		this.m_LoginButton = <FairyGUI.GButton>(this.GetChildAt(2));
		this.m_HintText = <FairyGUI.GTextField>(this.GetChildAt(3));
		this.m_Menu = <UI_MenuBar>(this.GetChildAt(5));
	}
}