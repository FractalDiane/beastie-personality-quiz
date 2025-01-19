import { PropsWithChildren } from "react";
import { ButtonType } from "./types";

//import arrowImage from "./assets/arrow.svg";

export interface BmdButtonProps {
	buttonType: ButtonType;
	title?: string;
	disable?: boolean;
	onClick: () => void;
}

export default function BmdButton(props: PropsWithChildren<BmdButtonProps>) {
	return <>
		<button className={`bmd-button ${props.buttonType}`} title={props.title} disabled={props.disable} onClick={props.onClick}>{props.children}</button>
	</>;
}
