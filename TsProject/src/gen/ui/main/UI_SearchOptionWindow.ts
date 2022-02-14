/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import UI_InputField from "./UI_InputField";

import { FairyGUI } from "csharp";

export default class UI_SearchOptionWindow extends FairyGUI.GLabel {

	public m_Keywords: UI_InputField;
	public m_Target1: FairyGUI.GComboBox;
	public m_Order: FairyGUI.GComboBox;
	public m_Offset: UI_InputField;
	public m_MinBookMarks: UI_InputField;
	public m_CancelButton: FairyGUI.GButton;
	public m_ConfirmButton: FairyGUI.GButton;
	public static URL: string = "ui://paw0rq8saapxjf";

	public static createInstance<T extends UI_SearchOptionWindow>(): T {
		const obj = <UI_SearchOptionWindow>(FairyGUI.UIPackage.CreateObject("main", "SearchOptionWindow"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_Keywords = <UI_InputField>(this.GetChildAt(3));
		this.m_Target1 = <FairyGUI.GComboBox>(this.GetChildAt(5));
		this.m_Order = <FairyGUI.GComboBox>(this.GetChildAt(7));
		this.m_Offset = <UI_InputField>(this.GetChildAt(9));
		this.m_MinBookMarks = <UI_InputField>(this.GetChildAt(12));
		this.m_CancelButton = <FairyGUI.GButton>(this.GetChildAt(15));
		this.m_ConfirmButton = <FairyGUI.GButton>(this.GetChildAt(16));
	}
}