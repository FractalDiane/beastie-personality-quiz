import { Fragment, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import './App.css';

import dialogueFile from './data/dialogue.json';
import questionsFileNotBallin from './data/questions_notballin.json';
import questionsFileBallin from './data/questions_ballin.json';
import beastiesFile from './data/beasties.json';

import TextBox from './TextBox';
import { Question, Scores, shuffleArray } from './types';
import Choices from './Choices';
//import NextButton from './NextButton';
import BeastieCarousel from './BeastieCarousel';
import Credits from './Credits';

import logoImage from './assets/logo.png';
import creditsButtonImage from './assets/credits.svg';
import volumeOnImage from './assets/volume_on.svg';
import volumeOffImage from './assets/volume_off.svg';
import githubLogoImage from './assets/github-mark-white.svg';
import backgroundMusicFile from './assets/music.ogg';

enum ProgressStage {
	ClickStart,
	IntroDialogue,
	NotBallinQuestions,
	InterludeDialogue,
	BallinQuestions,
	ResultsDialogue,
	ShowBeastie,
}

function getShuffledQuestionList(file: Question[]): Question[] {
	const result = [...file];
	shuffleArray(result);
	result.sort((a: Question, b: Question) => b.sortOrder - a.sortOrder);
	return result;
}

function lerp(from: number, to: number, alpha: number): number {
	return (1 - alpha) * from + alpha * to;
}

let init = false;

export default function App() {
	const [muted, setMuted] = useState(false);
	const [creditsOpen, setCreditsOpen] = useState(false);

	const [bgDarkenAnimation, setBgDarkenAnimation] = useState("");
	const [showQuestions, setShowQuestions] = useState(false);
	const [showDialogue, setShowDialogue] = useState(false);

	const [progressStage, setProgressStage] = useState(ProgressStage.ClickStart);
	const [currentDialogue, setCurrentDialogue] = useState(dialogueFile.intro);
	const [dialogueIndex, setDialogueIndex] = useState(0);
	const [canAdvanceDialogue, setCanAdvanceDialogue] = useState(false);

	const [questions, setQuestions] = useState(getShuffledQuestionList(questionsFileNotBallin));
	const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[questions.length - 1]);
	const [scores, setScores] = useState(new Scores());
	const [yourBeastieName, setYourBeastieName] = useState("");
	const [yourBeastieIndex, setYourBeastieIndex] = useState(-1);

	const [showCarousel, setShowCarousel] = useState(false);
	const [carouselRotationAdd, setCarouselRotationAdd] = useState(0);
	const [carouselYAdd, setCarouselYAdd] = useState(501);
	const [carouselRadiusXAdd, setCarouselRadiusXAdd] = useState(0);
	const [carouselRadiusYAdd, setCarouselRadiusYAdd] = useState(0);

	const [fadedInBeastie, setFadedInBeastie] = useState(false);
	const [showCheerAnimation, setShowCheerAnimation] = useState(false);
	const [cheerAudioIndex, setCheerAudioIndex] = useState(0);
	const [playedCheerAudio, setPlayedCheerAudio] = useState(false);

	const cheerAudio = document.getElementById("cheerAudio") as HTMLAudioElement | null;
	const backgroundMusic = document.getElementById("backgroundMusic") as HTMLAudioElement | null;

	useEffect(() => {
		if (!init) {
			const savedMuted = localStorage.getItem("muted") === "true";
			setMuted(savedMuted);
			
			init = true;
		}
	}, []);

	useEffect(() => {
		const interval = setTimeout(() => {
			const newValue = lerp(carouselRotationAdd, 0, 0.02);
			if (newValue <= 0.001) {
				clearTimeout(interval);
			} else if (newValue <= 0.1 && !fadedInBeastie) {
				setFadedInBeastie(true);
				setCarouselRotationAdd(newValue);
			} else {
				setCarouselRotationAdd(newValue);
			}
		}, 12);

		return () => clearTimeout(interval);
	}, [carouselRotationAdd]);

	useEffect(() => {
		const interval = setTimeout(() => {
			const newValue = lerp(carouselYAdd, 0, 0.02);
			if (newValue <= 0.001) {
				clearTimeout(interval);
			} else {
				setCarouselYAdd(newValue);
			}
		}, 12);

		return () => clearTimeout(interval);
	}, [carouselYAdd]);

	useEffect(() => {
		const interval = setTimeout(() => {
			const newValue = lerp(carouselRadiusXAdd, 0, 0.02);
			if (newValue <= 0.001) {
				clearTimeout(interval);
			} else {
				setCarouselRadiusXAdd(newValue);
			}
		}, 12);

		return () => clearTimeout(interval);
	}, [carouselRadiusXAdd]);

	useEffect(() => {
		const interval = setTimeout(() => {
			const newValue = lerp(carouselRadiusYAdd, 0, 0.02);
			if (newValue <= 0.001) {
				clearTimeout(interval);
			} else {
				setCarouselRadiusYAdd(newValue);
			}
		}, 12);

		return () => clearTimeout(interval);
	}, [carouselRadiusYAdd]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (fadedInBeastie && !playedCheerAudio) {
			interval = setTimeout(() => {
				setShowCheerAnimation(true);
				cheerAudio!.muted = false;
				cheerAudio!.play();
				setPlayedCheerAudio(true);
				setShowDialogue(true);
			}, 2800);
		}

		return () => { if (interval !== null) clearTimeout(interval); }
	}, [fadedInBeastie]);

	function advanceProgress() {
		switch (progressStage) {
			case ProgressStage.IntroDialogue:
			case ProgressStage.InterludeDialogue: {
				setBgDarkenAnimation("fadein");
			} break;

			case ProgressStage.ResultsDialogue: {
				setShowDialogue(false);
				setBgDarkenAnimation("fadein");
				setCarouselRotationAdd(Math.PI * 8);
				setCarouselYAdd(500);
				setCarouselRadiusXAdd(200);
				setCarouselRadiusYAdd(800);
				setShowCarousel(true);
			} break;

			case ProgressStage.ClickStart:
			case ProgressStage.NotBallinQuestions:
			case ProgressStage.BallinQuestions: {
				setBgDarkenAnimation("fadeout");
			}
		}

		setProgressStage(progressStage + 1);
	}

	function onClickMute() {
		const newMuted = !muted;
		localStorage.setItem("muted", String(newMuted));
		if (!newMuted) {
			backgroundMusic!.currentTime = 0;
		}

		setTimeout(() => setMuted(newMuted), 50);
	}

	function onClickStart(_skip: boolean) {
		advanceProgress();
	}

	function onDialogueTextFinished() {
		setCanAdvanceDialogue(true);
	}

	function onClickNext() {
		if (showDialogue && canAdvanceDialogue && !showQuestions) {
			if (dialogueIndex < currentDialogue.length - 1) {
				setShowDialogue(false);
				setDialogueIndex(dialogueIndex + 1);
				setTimeout(() => setShowDialogue(true), 10);
			} else {
				advanceProgress();
			}

			setCanAdvanceDialogue(false);
		}
	}

	function onClickAnswer(points: string[]) {
		const newScores = scores.clone();
		for (const vibe of points) {
			newScores.incrementScore(vibe.toLowerCase());
		}

		setScores(newScores);
		
		const newQuestionPool = [...questions];
		newQuestionPool.pop();
		if (newQuestionPool.length > 0) {
			setCurrentQuestion(newQuestionPool[newQuestionPool.length - 1]);
			setQuestions(newQuestionPool);
		} else {
			setShowDialogue(false);
			advanceProgress();
		}
	}

	function onFadeAnimationEnd(_animation: React.AnimationEvent<HTMLDivElement>) {
		switch (progressStage) {
			case ProgressStage.IntroDialogue: {
				setShowDialogue(true);
				backgroundMusic!.play();
			} break;

			case ProgressStage.NotBallinQuestions: {
				setShowQuestions(true);
			} break;

			case ProgressStage.BallinQuestions: {
				const ballinQuestions = getShuffledQuestionList(questionsFileBallin);
				setQuestions(ballinQuestions);
				setCurrentQuestion(ballinQuestions[ballinQuestions.length - 1]);
				setShowQuestions(true);
			} break;
			
			case ProgressStage.InterludeDialogue: {
				setShowQuestions(false);
				setShowDialogue(true);
				setDialogueIndex(0);
				setCurrentDialogue(dialogueFile.interlude);
			} break;

			case ProgressStage.ResultsDialogue: {
				setShowQuestions(false);
				setShowDialogue(true);
				setDialogueIndex(0);
				console.log(scores);

				const results = scores.getTopScoreResult();
				setCurrentDialogue(results.dialogue);
				setYourBeastieName(beastiesFile[results.beastieIndex].name);
				setYourBeastieIndex(results.beastieIndex);
				setCheerAudioIndex(Math.floor(Math.random() * 4));
			} break;
		}
	}

	const elements: JSX.Element[] = [
		<Fragment key="bg">
			<style>
				{`body { margin-top: 0px; margin-left: 0px; overflow-y: ${creditsOpen ? "scroll" : "hidden"}}`}
			</style>
			<div id="background">
				<div className='bmd-background' />
				<div className='bmd-background top' />
				<div className='bmd-background flipped' />
				<div className='bmd-background flipped top' />
			</div>
			<div id="background-darken" style={{animation: bgDarkenAnimation.length > 0 ? `${bgDarkenAnimation} 1s forwards` : ``}} onAnimationEnd={onFadeAnimationEnd} />
			<div id="dialogueAdvance" onClick={onClickNext} />
			<div id="bottomButtonsContainer">
				{progressStage === ProgressStage.ClickStart ? <a href="https://github.com/FractalDiane/beastie-personality-quiz" target="_blank" rel="noopener noreferrer"><button className="bmd-button bottom" title="View on GitHub"><img src={githubLogoImage} /></button></a> : <></>}
				{progressStage === ProgressStage.ClickStart ? <button className="bmd-button bottom" onClick={() => setCreditsOpen(!creditsOpen)} title="Credits"><img src={creditsButtonImage} /></button> : <></>}
				<button className="bmd-button bottom" onClick={onClickMute} title="Mute sound"><img src={muted ? volumeOffImage : volumeOnImage} /></button>
			</div>
			
			<audio id="backgroundMusic" preload="auto" src={backgroundMusicFile} muted={muted} loop />
		</Fragment>
	];

	if (!creditsOpen) {
		switch (progressStage) {
			case ProgressStage.ClickStart: {
				elements.push(
					<Fragment key="startup">
						<center><img id="logo" src={logoImage} alt="Beastie Personality Quiz" /></center>
						<div id="startButtonContainer">
							<div><button className="bmd-button start" onClick={() => onClickStart(false)}>Start</button></div>
						</div>
					</Fragment>
				);
			} break;
	
			case ProgressStage.IntroDialogue:
			case ProgressStage.InterludeDialogue:
			case ProgressStage.ResultsDialogue: {
				if (showDialogue) {
					elements.push(
						<div className="textContainer center" key="centerDialogue">
							<TextBox text={currentDialogue[dialogueIndex]} showBox={false} showAdvanceIndicator={true} smallText={false} centerText={true} textFinishedCallback={onDialogueTextFinished} />
						</div>
					);
	
					if (progressStage == ProgressStage.ResultsDialogue) {
						elements.push(
							<Fragment key="carousel">
								<BeastieCarousel beasties={beastiesFile} selectedIndex={yourBeastieIndex} radiusX={500 + carouselRadiusXAdd} radiusY={100 + carouselRadiusYAdd} rotationAdd={carouselRotationAdd} yAdd={carouselYAdd} show={showCarousel} fadeIn={fadedInBeastie} playCheerAnimation={showCheerAnimation} />
								<audio autoPlay muted id="cheerAudio" preload="auto" src={yourBeastieIndex !== -1 ? `${beastiesFile[yourBeastieIndex].name.toLowerCase()}_cheer${cheerAudioIndex + 1}.flac` : ""} />
							</Fragment>
						);
					}
				}
			} break;
	
			case ProgressStage.NotBallinQuestions:
			case ProgressStage.BallinQuestions: {
				if (showQuestions) {
					elements.push(
						<Fragment key="questions">
							<Choices question={currentQuestion} onClickCallback={onClickAnswer} />
							<div className="textContainer bottom">
								<TextBox text={currentQuestion.question} showBox={true} showAdvanceIndicator={false} smallText={true} centerText={false} textFinishedCallback={onDialogueTextFinished} />
							</div>
						</Fragment>
					);
				}
			} break;
	
			case ProgressStage.ShowBeastie: {
				elements.push(
					<Fragment key="carousel">
						<BeastieCarousel beasties={beastiesFile} selectedIndex={yourBeastieIndex} radiusX={700 + carouselRadiusXAdd} radiusY={150 + carouselRadiusYAdd} rotationAdd={carouselRotationAdd} yAdd={carouselYAdd} show={showCarousel} fadeIn={fadedInBeastie} playCheerAnimation={showCheerAnimation} />
						{showDialogue ? <div className="textContainer bottom">
							<TextBox text={`...a @${yourBeastieName}\`!`} showBox={true} showAdvanceIndicator={true} smallText={true} centerText={true} textFinishedCallback={onDialogueTextFinished} />
						</div> : <></>}

						<audio autoPlay muted id="cheerAudio" preload="auto" src={yourBeastieIndex !== -1 ? `${beastiesFile[yourBeastieIndex].name.toLowerCase()}_cheer${cheerAudioIndex + 1}.flac` : ""} />
					</Fragment>
				);
			} break;
		}
	} else {
		elements.push(
			<Fragment key="credits">
				<center><img id="logo" src={logoImage} /></center>
				<Credits />
			</Fragment>
		)
	}

	return <>{elements}</>;
}
