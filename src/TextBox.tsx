import { useEffect, useState } from "react";
import { jsonStringToJSX } from "./TextFunctions";
import { TextBoxType } from "./types";

import ballshroomImage from "./assets/ballshroom.svg";
import fadedBoxImage from "./assets/box_blur.png";

export interface TextBoxProps {
	text: string;
	showAdvanceIndicator: boolean;
	textFinishedCallback: () => void;
	centerText: boolean;
	boxType: TextBoxType;
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
		{ props.boxType === TextBoxType.Box ? <div className="textBoxBackground" /> : <></> }
		<img src={fadedBoxImage} style={{opacity: 0, position: `absolute`, width: `1px`, height: `1px` /* THIS IS HORRIBLE */}} />
		<div className={`textBox ${props.boxType === TextBoxType.Box ? "polygon" : props.boxType === TextBoxType.Faded ? "faded" : ""}`} style={{
			backgroundColor: `rgba(0, 0, 0, ${props.boxType === TextBoxType.Box ? 1 : props.boxType === TextBoxType.Faded ? 0 : 0})`,
		}}>
		<div className={`text ${props.smallText ? "small" : "large"}`} style={{textAlign: `${props.centerText ? "center" : "left"}`, paddingTop: `${props.boxType === TextBoxType.Faded ? `5vh` : `0px`}`}}>{text}</div>
		<center><img className="textIndicator" src={ballshroomImage} style={{opacity: props.showAdvanceIndicator && charIndex == props.text.length ? 1 : 0}} /></center>
	</div></>;
}
