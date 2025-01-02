import { useEffect, useState } from "react";
import { jsonStringToJSX } from "./TextFunctions";

export interface TextBoxProps {
	text: string;
	centerText: boolean;
	showBox: boolean;
	smallText: boolean;
}

export default function TextBox(props: TextBoxProps) {
	const [charIndex, setCharIndex] = useState(0);

	useEffect(() => {
		const interval = setTimeout(() => {
			const newCharIndex = charIndex + 1;
			setCharIndex(newCharIndex);
			if (newCharIndex == props.text.length) {
				clearTimeout(interval);
			}
		}, 12);

		return () => clearTimeout(interval);
	}, [charIndex]);

	useEffect(() => {
		setCharIndex(0);
	}, [props.text]);

	const text = jsonStringToJSX(props.text, charIndex);
	
	return <div className="textBox" style={{
			backgroundColor: `rgba(0, 0, 0, ${props.showBox ? 1 : 0})`,
			border: `1px solid rgba(255, 255, 255, ${props.showBox ? 1 : 0})`,
		}}>
		<div className={`text ${props.smallText ? "small" : ""}`} style={{textAlign: `${props.centerText ? "center" : "left"}`}}>{text}</div>
	</div>;
}
