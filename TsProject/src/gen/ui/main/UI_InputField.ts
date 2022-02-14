/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_InputField extends FairyGUI.GComponent {

	public m_text: FairyGUI.GTextInput;
	public static URL: string = "ui://paw0rq8sgzsdiq";

	public static createInstance<T extends UI_InputField>(): T {
		const obj = <UI_InputField>(FairyGUI.UIPackage.CreateObject("main", "InputField"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_text = <FairyGUI.GTextInput>(this.GetChildAt(1));
	}
}