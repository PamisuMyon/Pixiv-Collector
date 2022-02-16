/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UI_InputField from "./UI_InputField";

import { FairyGUI } from "csharp";

export default class UI_LoginPanel extends FairyGUI.GComponent {

	public m_TokenInput: UI_InputField;
	public m_LoginButton: FairyGUI.GButton;
	public m_HintText: FairyGUI.GTextField;
	public static URL: string = "ui://paw0rq8snhm2jy";

	public static createInstance<T extends UI_LoginPanel>(): T {
		const obj = <UI_LoginPanel>(FairyGUI.UIPackage.CreateObject("main", "LoginPanel"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_TokenInput = <UI_InputField>(this.GetChildAt(1));
		this.m_LoginButton = <FairyGUI.GButton>(this.GetChildAt(2));
		this.m_HintText = <FairyGUI.GTextField>(this.GetChildAt(3));
	}
}