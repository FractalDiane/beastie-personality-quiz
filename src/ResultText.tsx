export interface ResultTextProps {
	text: string;
	subtext: string;
}

export default function ResultText(props: ResultTextProps) {
	return <>
		<div className="resultText top">{props.subtext}</div>
		<div className="resultText bottom">{props.text}</div>
	</>
}
