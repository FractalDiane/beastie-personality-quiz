import { PropsWithChildren } from "react";
import { ButtonType } from "./types";

//import arrowImage from "./assets/arrow.svg";

export interface BmdButtonProps {
	buttonType: ButtonType;
	title?: string;
	onClick: () => void;
}

export default function BmdButton(props: PropsWithChildren<BmdButtonProps>) {
	return <>
		<button className={`bmd-button ${props.buttonType}`} title={props.title} onClick={props.onClick}>{props.children}</button>
	</>;
}
