import { useEffect, useState } from "react";

export interface Beastie {
	name: string;
	spriteIdle: string;
	yAdjust: number;
}

export interface BeastieCarouselBeastieProps {
	beastie: Beastie;
	angle: number;
	radiusX: number;
	radiusY: number;
	isSelected: boolean;
	playCheerAnimation: boolean;
	fadeIn: boolean;
}

function clamp(what: number, min: number, max: number): number {
	return what < min ? min : what > max ? max : what;
}

function getClosest360(angle: number): number {
	let upper = Math.PI * 2;
	while (upper < angle) {
		upper += Math.PI * 2;
	}

	return upper;
}

export default function BeastieCarouselBeastie(props: BeastieCarouselBeastieProps) {
	const [_beastieScale, setBeastieScale] = useState(1.0);

	useEffect(() => {
		function onResize() {
			setBeastieScale(Math.min(window.innerWidth / 2304, window.innerHeight / 1173));
		}

		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	const widthRef = 2560;
	const widthRatio = Math.min(window.innerWidth / (widthRef * 0.35), 1.0);

	const angleOffset = props.angle + Math.PI * 0.5;
	const x = props.radiusX * Math.cos(angleOffset) * widthRatio;
	const y = props.radiusY * Math.sin(angleOffset) * widthRatio;
	const angleAdjusted = props.angle <= Math.PI ? props.angle : getClosest360(props.angle) - props.angle;
	const angleDiff = Math.abs(Math.PI - angleAdjusted);

	return <><img className="beastieCarouselBeastie" src={props.playCheerAnimation && props.isSelected ? `${props.beastie.name}_Cheer.png` : props.beastie.spriteIdle} style={{
		transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${clamp(angleDiff / Math.PI * 1, 0.3, 1)}) translateY(-100px) translateY(${props.beastie.yAdjust * widthRatio}px) scale(${widthRatio}) translate3d(0, 0, 0)`,
		zIndex: 500 + Math.round(y),
		filter: `brightness(0)`,
		animation: `${props.isSelected && props.fadeIn ? "beastie-fadein 2s forwards linear" : ""}`,
	}} /><img src={`${props.beastie.name}_Cheer.png`} style={{opacity: 0, pointerEvents: `none`, userSelect: `none`, position: `absolute`, zIndex: -1000}} /></>; // THIS IS HORRIBLE
}
