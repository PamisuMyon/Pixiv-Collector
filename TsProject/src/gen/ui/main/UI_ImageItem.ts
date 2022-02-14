/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

/* eslint-disable */

import { FairyGUI } from "csharp";

export default class UI_ImageItem extends FairyGUI.GComponent {

	public m_Image: FairyGUI.GLoader;
	public m_SelectRadio: FairyGUI.GButton;
	public m_CollectedIcon: FairyGUI.GImage;
	public static URL: string = "ui://paw0rq8stkn4ie";

	public static createInstance<T extends UI_ImageItem>(): T {
		const obj = <UI_ImageItem>(FairyGUI.UIPackage.CreateObject("main", "ImageItem"));
		return obj as T;
	}

	protected onConstruct () {
		this.m_Image = <FairyGUI.GLoader>(this.GetChildAt(0));
		this.m_SelectRadio = <FairyGUI.GButton>(this.GetChildAt(2));
		this.m_CollectedIcon = <FairyGUI.GImage>(this.GetChildAt(3));
	}
}