import { Fragment, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import './App.css';

import dialogueFile from './data/dialogue.json';
import questionsFileNotBallin from './data/questions_notballin.json';
import questionsFileBallin from './data/questions_ballin.json';
import beastiesFile from './data/beasties.json';

import TextBox from './TextBox';
import { ButtonType, Question, Scores, shuffleArray, TextBoxType } from './types';
import Choices from './Choices';
import BeastieCarousel from './BeastieCarousel';
import Credits from './Credits';

import logoImage from './assets/logo.png';
import creditsButtonImage from './assets/credits.svg';
import volumeOnImage from './assets/volume_on.svg';
import volumeOffImage from './assets/volume_off.svg';
import githubLogoImage from './assets/github-mark-white.svg';
import backgroundMusicFile from './assets/music.mp3';
import BmdButton from './BmdButton';
import { startsWithVowel } from './TextFunctions';
import ResultText from './ResultText';

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
	const [volume, setVolume] = useState(0.5);
	const [creditsOpen, setCreditsOpen] = useState(false);

	const [bgDarkenAnimation, setBgDarkenAnimation] = useState("");
	const [showQuestions, setShowQuestions] = useState(false);
	const [showDialogue, setShowDialogue] = useState(false);

	const [progressStage, setProgressStage] = useState(ProgressStage.ClickStart);
	const [currentDialogue, setCurrentDialogue] = useState(dialogueFile.intro);
	const [dialogueIndex, setDialogueIndex] = useState(0);
	const [canAdvanceDialogue, setCanAdvanceDialogue] = useState(false);
	const [clickTimeout, setClickTimeout] = useState(false);

	const [questions, setQuestions] = useState(getShuffledQuestionList(questionsFileNotBallin));
	const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[questions.length - 1]);
	const [scores, setScores] = useState(new Scores());
	const [yourVibe, setYourVibe] = useState("");
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

	const [fadeinResultsText, setFadeinResultsText] = useState(false);
	const [showFinishButton, setShowFinishButton] = useState(false);

	const showVolumeSlider = !isMobile;

	const cheerAudio = document.getElementById("cheerAudio") as HTMLAudioElement | null;
	if (cheerAudio !== null) {
		cheerAudio.volume = volume;
	}

	const backgroundMusic = document.getElementById("backgroundMusic") as HTMLAudioElement | null;
	if (backgroundMusic !== null) {
		backgroundMusic.volume = volume;
		const slider = document.getElementById("volumeSlider") as HTMLInputElement | null;
		if (slider !== null) {
			slider.value = String(volume * 100);
		}
	}

	useEffect(() => {
		if (!init) {
			const savedMuted = localStorage.getItem("muted") === "true";
			setMuted(savedMuted);
			const savedVolume = localStorage.getItem("volume");
			setVolume(savedVolume !== null ? parseFloat(savedVolume) : 0.5);

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
				cheerAudio!.muted = muted;
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
			} break;

			case ProgressStage.ShowBeastie: {
				setShowDialogue(false);
				setFadeinResultsText(true);
				setTimeout(() => setShowFinishButton(true), 2000);
				return;
			} break;
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

	function onChangeVolume(event: React.ChangeEvent<HTMLInputElement>) {
		const newVolume = parseFloat(event.target.value) / 100;
		localStorage.setItem("volume", String(newVolume));
		setVolume(newVolume);
	}

	function onClickStart(_skip: boolean) {
		advanceProgress();
	}

	function onDialogueTextFinished() {
		setCanAdvanceDialogue(true);
	}

	function onClickNext(skipAll: boolean) {
		if (showDialogue && canAdvanceDialogue && !showQuestions) {
			if (!skipAll && dialogueIndex < currentDialogue.length - 1) {
				setShowDialogue(false);
				setDialogueIndex(dialogueIndex + 1);
				setTimeout(() => setShowDialogue(true), 10);
			} else {
				advanceProgress();
			}

			setCanAdvanceDialogue(false);
		}
	}

	function onClickAnswer(points: string[], index: number) {
		const newScores = scores.clone();
		for (const vibe of points) {
			newScores.incrementScore(vibe, currentQuestion.index, index);
		}

		setScores(newScores);
		
		const newQuestionPool = [...questions];
		newQuestionPool.pop();
		if (newQuestionPool.length > 0) {
			setCurrentQuestion(newQuestionPool[newQuestionPool.length - 1]);
			setQuestions(newQuestionPool);
		} else {
			if (progressStage === ProgressStage.BallinQuestions) {
				const tieBrokenScores = newScores.clone();
				tieBrokenScores.tryBreakTies();
				setScores(tieBrokenScores);
			}

			setShowDialogue(false);
			advanceProgress();
		}

		setClickTimeout(true);
		setTimeout(() => setClickTimeout(false), 300);
	}

	function onClickRestart() {
		setProgressStage(ProgressStage.ClickStart);
		setScores(new Scores());
		setCurrentDialogue(dialogueFile.intro);
		setDialogueIndex(0);

		const newQuestions = getShuffledQuestionList(questionsFileNotBallin);
		setQuestions(newQuestions);
		setCurrentQuestion(newQuestions[newQuestions.length - 1]);
		
		setShowCheerAnimation(false);
		setFadedInBeastie(false);
		setPlayedCheerAudio(false);
		setFadeinResultsText(false);
		setShowFinishButton(false);

		setShowCarousel(false);
		setCarouselRotationAdd(0);
		setCarouselYAdd(501);
		setCarouselRadiusXAdd(0);
		setCarouselRadiusYAdd(0);
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

				const vibeStringFull = results.dialogue[1].split(" ")[1];
				setYourVibe(vibeStringFull.substring(1, vibeStringFull.length - 1));

				setYourBeastieName(beastiesFile[results.beastieIndex].name);
				setYourBeastieIndex(results.beastieIndex);
				setCheerAudioIndex(Math.floor(Math.random() * 4));
			} break;
		}
	}

	const elements: JSX.Element[] = [
		<Fragment key="bg">
			<style>
				{`
					body { overflow-y: ${creditsOpen ? "scroll" : "hidden"}}
				`}
			</style>
			<div id="background-darken" style={{animation: bgDarkenAnimation.length > 0 ? `${bgDarkenAnimation} 1s forwards` : ``}} onAnimationEnd={onFadeAnimationEnd} />
			{!creditsOpen ? <div id="dialogueAdvance" onClick={() => onClickNext(false)} onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => { if (event.key === " ") { onClickNext(false); }}} /> : <></>}
			<div id="bottomButtonsContainer">
				{progressStage === ProgressStage.ClickStart ? <a href="https://github.com/FractalDiane/beastie-personality-quiz" target="_blank" rel="noopener noreferrer"><button className="bmd-button bottom" title="View on GitHub"><img src={githubLogoImage} /></button></a> : <></>}
				{progressStage === ProgressStage.ClickStart ? <BmdButton buttonType={ButtonType.Bottom} onClick={() => { setCreditsOpen(!creditsOpen); if (creditsOpen) document.documentElement.scrollTop = document.body.scrollTop = 0; } } title="Credits"><img src={creditsButtonImage} /></BmdButton> : <></>}
				<BmdButton buttonType={ButtonType.Bottom} onClick={onClickMute} title="Mute sound"><img src={muted ? volumeOffImage : volumeOnImage} /></BmdButton>
				{showVolumeSlider ? <>
					<input type="range" id="volumeSlider" title="Audio volume" min={0} max={100} defaultValue={50} onChange={onChangeVolume} ></input>
				</> : <></>}
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
							<BmdButton buttonType={ButtonType.Generic} onClick={() => { 
								/*if (isIOS && !backgroundMusic!.paused) {
									backgroundMusic!.play();
								}*/

								onClickStart(false)
							}}>Start</BmdButton>
						</div>
					</Fragment>
				);
			} break;
	
			case ProgressStage.IntroDialogue:
			case ProgressStage.InterludeDialogue:
			case ProgressStage.ResultsDialogue: {
				if (showDialogue) {
					elements.push(<Fragment key="centerDialogue">
							<div className="textContainer center">
								<TextBox text={currentDialogue[dialogueIndex]} boxType={TextBoxType.None} showAdvanceIndicator={true} smallText={false} centerText={true} textFinishedCallback={onDialogueTextFinished} />
								
							</div>
						</Fragment>
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

				if (progressStage !== ProgressStage.ResultsDialogue) {
					elements.push(
						<div id="skipButtonContainer" key="skipButton">
							<BmdButton buttonType={ButtonType.Generic} onClick={() => onClickNext(true)}>Skip</BmdButton>
						</div>
					);
				}
			} break;
	
			case ProgressStage.NotBallinQuestions:
			case ProgressStage.BallinQuestions: {
				if (showQuestions) {
					elements.push(
						<Fragment key="questions">
							<Choices question={currentQuestion} onClickCallback={onClickAnswer} clickTimeout={clickTimeout} />
							<div className="textContainer bottom">
								<TextBox text={currentQuestion.question} boxType={TextBoxType.Box} showAdvanceIndicator={false} smallText={true} centerText={false} textFinishedCallback={onDialogueTextFinished} />
							</div>
						</Fragment>
					);
				}
			} break;
	
			case ProgressStage.ShowBeastie: {
				elements.push(
					<Fragment key="carousel">
						<div className="resultTextContainer" style={{animation: `${fadeinResultsText ? "fadeinFull 2s forwards" : ""}`}}>
							<div className="spacerFlex" />
							<ResultText subtext="Your vibe is" text={yourVibe.toUpperCase()} />
							<div className="spacerFlex" />
							<ResultText subtext="Your Beastie form is" text={yourBeastieName.toUpperCase()} />
							<div className="spacerFlex" />
						</div>

						<BeastieCarousel beasties={beastiesFile} selectedIndex={yourBeastieIndex} radiusX={700 + carouselRadiusXAdd} radiusY={150 + carouselRadiusYAdd} rotationAdd={carouselRotationAdd} yAdd={carouselYAdd} show={showCarousel} fadeIn={fadedInBeastie} playCheerAnimation={showCheerAnimation} />
						{showDialogue ? <div className="textContainer bottom">
							<TextBox text={`...a${startsWithVowel(yourBeastieName) ? "n" : ""} ^${yourBeastieName}\`!`} boxType={TextBoxType.Faded} showAdvanceIndicator={true} smallText={false} centerText={true} textFinishedCallback={onDialogueTextFinished} />
						</div> : <></>}

						{showFinishButton ? <div id="skipButtonContainer">
							<BmdButton buttonType={ButtonType.Generic} onClick={onClickRestart}>Restart</BmdButton>
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
