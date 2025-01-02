import { Beastie } from "./BeastieCarouselBeastie";
import BeastieCarouselBeastie from "./BeastieCarouselBeastie";
import { Fragment } from "react/jsx-runtime";

export interface BeastieCarouselProps {
	beasties: Beastie[];
	radiusX: number;
	radiusY: number;
	selectedIndex: number;
	rotationAdd: number;
	yAdd: number;
	show: boolean;
	fadeIn: boolean;
	playCheerAnimation: boolean;
}

export default function BeastieCarousel(props: BeastieCarouselProps) {
	const angleIncrement = Math.PI * 2 / props.beasties.length;
	const result: JSX.Element[] = [];

	props.beasties.forEach((beastie: Beastie, index: number) => {
		result.push(<Fragment key={index}>
			<BeastieCarouselBeastie beastie={beastie} angle={angleIncrement * index + angleIncrement * (props.beasties.length - props.selectedIndex) + props.rotationAdd} radiusX={props.radiusX} radiusY={props.radiusY} isSelected={index == props.selectedIndex} fadeIn={props.fadeIn} playCheerAnimation={props.playCheerAnimation} />
		</Fragment>);
	});

	return <div className="beastieCarousel" style={{
		transform: `translateY(${props.yAdd}vh)`,
		opacity: props.show ? 1 : 0,
	}}>{result}</div>;
}
