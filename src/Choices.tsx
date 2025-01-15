import { ButtonType, Question } from "./types";
import { jsonStringToJSX } from "./TextFunctions";
import BmdButton from "./BmdButton";

export interface ChoicesProps {
	question: Question;
	onClickCallback: (points: string[], index: number) => void;
}

export default function Choices(props: ChoicesProps) {
	const result = [];
	for (let i = 0; i < props.question.answers.length; ++i) {
		result.push(<center key={i}><BmdButton buttonType={ButtonType.Choice} onClick={() => props.onClickCallback(props.question.answers[i].points, i)}>
			<div className="choiceText">{jsonStringToJSX(props.question.answers[i].answer, Infinity)}</div>
		</BmdButton><div className="spacer" /></center>);
	}

	return <div id="choices">{result}</div>;
}
