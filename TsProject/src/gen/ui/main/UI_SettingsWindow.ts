/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UI_InputField from "./UI_InputField";

import { FairyGUI } from "csharp";

export default class UI_SettingsWindow extends FairyGUI.GLabel {

	public m_ProxyInput: UI_InputField;
	public m_CollectorServerInput: UI_InputField;
	public m_RequestIntervalInput: UI_InputField;
	public m_CancelButton: FairyGUI.GButton;
	public m_ConfirmButton: FairyGUI.GButton;
	public static URL: string = "ui://paw0rq8smi4aj0";

	public static createInstance<T extends UI_SettingsWindow>(): T {
		const obj = <UI_SettingsWindow>(FairyGUI.UIPackage.CreateObject("main", "SettingsWindow"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_ProxyInput = <UI_InputField>(this.GetChildAt(3));
		this.m_CollectorServerInput = <UI_InputField>(this.GetChildAt(5));
		this.m_RequestIntervalInput = <UI_InputField>(this.GetChildAt(7));
		this.m_CancelButton = <FairyGUI.GButton>(this.GetChildAt(9));
		this.m_ConfirmButton = <FairyGUI.GButton>(this.GetChildAt(10));
	}
}