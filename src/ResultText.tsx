export interface ResultTextProps {
	text: string;
	subtext: string;
}

export default function ResultText(props: ResultTextProps) {
	return <div className="resultText">
		<div className="center"><div className="top">{props.subtext}</div></div>
		<div className="center"><div className="bottom">{props.text}</div></div>
	</div>
}
