import { useEffect, useState } from "react";
import { jsonStringToJSX } from "./TextFunctions";

import ballshroomImage from "./assets/ballshroom.svg";

export interface TextBoxProps {
	text: string;
	showAdvanceIndicator: boolean;
	textFinishedCallback: () => void;
	centerText: boolean;
	showBox: boolean;
	smallText: boolean;
}

export default function TextBox(props: TextBoxProps) {
	const useTypewriter = (text: string, speed: number) => {
		const [charIndex, setCharIndex] = useState(0);
	
		useEffect(() => {
			let i = 0;
			const interval = setInterval(() => {
				if (i < text.length) {
					setCharIndex(i + 1);
					++i;
				} else {
					clearInterval(interval);
					props.textFinishedCallback();
				}
			}, speed);
	
			return () => clearInterval(interval);
		}, [text, speed]);
	
		useEffect(() => {
			setCharIndex(0);
		}, [text]);
		
		return charIndex;
	};

	const charIndex = useTypewriter(props.text, 12);
	const text = jsonStringToJSX(props.text, charIndex);
	
	return <>
		{ props.showBox ? <div className="textBoxBackground" /> : <></> }
		<div className={`textBox ${props.showBox ? "polygon" : ""}`} style={{
			backgroundColor: `rgba(0, 0, 0, ${props.showBox ? 1 : 0})`,
			border: `1px solid rgba(255, 255, 255, ${props.showBox ? 1 : 0})`,
		}}>
		<div className={`text ${props.smallText ? "small" : ""}`} style={{textAlign: `${props.centerText ? "center" : "left"}`}}>{text}</div>
		<center><img className="textIndicator" src={ballshroomImage} style={{opacity: props.showAdvanceIndicator && charIndex == props.text.length ? 1 : 0}} /></center>
	</div></>;
}
