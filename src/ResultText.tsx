export interface ResultTextProps {
	text: string;
	subtext: string;
}

export default function ResultText(props: ResultTextProps) {
	return <div className="resultText">
		<center><div className="top">{props.subtext}</div></center>
		<center><div className="bottom">{props.text}</div></center>
	</div>
}
