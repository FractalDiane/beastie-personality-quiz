import nextIcon from "./assets/next_arrow.svg";

export interface NextButtonProps {
	onClickCallback: () => void;
}

export default function NextButton(props: NextButtonProps) {
	return <button className="bmd-button next" onClick={props.onClickCallback}><img src={nextIcon} /></button>;
}
