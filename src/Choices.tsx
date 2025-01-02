import { Question } from "./types";
import { jsonStringToJSX } from "./TextFunctions";

export interface ChoicesProps {
	question: Question;
	onClickCallback: (points: string[]) => void;
}

export default function Choices(props: ChoicesProps) {
	const result = [];
	for (let i = 0; i < props.question.answers.length; ++i) {
		result.push(<center key={i}><button className="bmd-button choice" onClick={() => props.onClickCallback(props.question.answers[i].points)}>
			{jsonStringToJSX(props.question.answers[i].answer, Infinity)}
		</button><div className="spacer" /></center>);
	}

	return <div id="choices">{result}</div>;
}
