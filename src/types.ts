import resultAnxious from "./data/result_anxious.json";
import resultBrash from "./data/result_brash.json";
import resultCalm from "./data/result_calm.json";
import resultCarefree from "./data/result_carefree.json";
import resultDramatic from "./data/result_dramatic.json";
import resultEasygoing from "./data/result_easygoing.json";
import resultEnergetic from "./data/result_energetic.json";
import resultGentle from "./data/result_gentle.json";
import resultGoofy from "./data/result_goofy.json";
import resultJolly from "./data/result_jolly.json";
import resultKind from "./data/result_kind.json";
import resultLogical from "./data/result_logical.json";
import resultLonely from "./data/result_lonely.json";
import resultMischievous from "./data/result_mischievous.json";
import resultPassionate from "./data/result_passionate.json";
import resultReckless from "./data/result_reckless.json";
import resultSerious from "./data/result_serious.json";
import resultShy from "./data/result_shy.json";
import resultSpacey from "./data/result_spacey.json";
import resultTough from "./data/result_tough.json";

import questionsFileNotBallin from "./data/questions_notballin.json";
import questionsFileBallin from "./data/questions_ballin.json";

const VIBES: Map<string, number> = new Map([
	["anxious", 0],
	["brash", 1],
	["calm", 2],
	["carefree", 3],
	["dramatic", 4],
	["easygoing", 5],
	["energetic", 6],
	["gentle", 7],
	["goofy", 8],
	["jolly", 9],
	["kind", 10],
	["logical", 11],
	["lonely", 12],
	["mischievous", 13],
	["passionate", 14],
	["reckless", 15],
	["serious", 16],
	["shy", 17],
	["spacey", 18],
	["tough", 19],
]);

export interface VibeResult {
	dialogue: string[];
	beastieIndex: number;
}

const VIBE_RESULTS: VibeResult[] = [
	{dialogue: resultAnxious, beastieIndex: 0},
	{dialogue: resultBrash, beastieIndex: 1},
	{dialogue: resultCalm, beastieIndex: 2},
	{dialogue: resultCarefree, beastieIndex: 3},
	{dialogue: resultDramatic, beastieIndex: 4},
	{dialogue: resultEasygoing, beastieIndex: 5},
	{dialogue: resultEnergetic, beastieIndex: 6},
	{dialogue: resultGentle, beastieIndex: 7},
	{dialogue: resultGoofy, beastieIndex: 8},
	{dialogue: resultJolly, beastieIndex: 9},
	{dialogue: resultKind, beastieIndex: 10},
	{dialogue: resultLogical, beastieIndex: 11},
	{dialogue: resultLonely, beastieIndex: 12},
	{dialogue: resultMischievous, beastieIndex: 13},
	{dialogue: resultPassionate, beastieIndex: 14},
	{dialogue: resultReckless, beastieIndex: 15},
	{dialogue: resultSerious, beastieIndex: 16},
	{dialogue: resultShy, beastieIndex: 17},
	{dialogue: resultSpacey, beastieIndex: 18},
	{dialogue: resultTough, beastieIndex: 19},
];

export interface Answer {
	answer: string;
	points: string[];
}

export interface Question {
	question: string;
	answers: Answer[];
	shuffleAnswers: boolean;
	sortOrder: number;
	index: number;
}

export class Scores {
	scores: number[];
	answersPicked: number[];

	constructor() {
		this.scores = new Array<number>(20).fill(0);
		this.answersPicked = new Array<number>(questionsFileNotBallin.length + questionsFileBallin.length).fill(-1);
	}

	incrementScore(vibe: string, questionIndex: number, answerIndex: number) {
		++this.scores[VIBES.get(vibe)!];
		this.answersPicked[questionIndex] = answerIndex;
	}

	getTopScoreResult(): VibeResult {
		let maxIndex = 0;
		let maxValue = 0;
		this.scores.forEach((value: number, index: number) => {
			if (value > maxValue) {
				maxValue = value;
				maxIndex = index;
			}
		});

		return VIBE_RESULTS[maxIndex];
	}

	tryBreakTies() {
		const tied = new Set<number>();
		let maxScore = -1;
		this.scores.forEach((score, index) => {
			if (score > maxScore) {
				tied.clear();
				tied.add(index);
				maxScore = score;
			} else if (score === maxScore) {
				tied.add(index);
			}
		});

		if (tied.size > 1) {
			let allQuestions: Question[] = [...questionsFileNotBallin];
			allQuestions = allQuestions.concat([...questionsFileBallin]);
			console.log(allQuestions);

			allQuestions.forEach((question, index) => {
				const thisQuestionVibes = new Set<string>();
				for (const answer of question.answers) {
					for (const vibe of answer.points) {
						const vibeNumber = VIBES.get(vibe)!;
						if (tied.has(vibeNumber)) {
							thisQuestionVibes.add(vibe);
						}
					}
				}

				if (thisQuestionVibes.size > 1) {
					const pickedAnswer = this.answersPicked[index];
					const pickedAnswerVibes = question.answers[pickedAnswer].points;
					for (const vibe of pickedAnswerVibes) {
						if (thisQuestionVibes.has(vibe)) {
							++this.scores[VIBES.get(vibe)!];
						}
					}
				}
			});
		}
	}

	reset() {
		this.scores = new Array<number>(20).fill(0);
	}

	clone(): Scores {
		const newScores = new Scores();
		newScores.scores = [...this.scores];
		newScores.answersPicked = [...this.answersPicked];
		return newScores;
	}
}

export enum ButtonType {
	Generic = "start",
	Bottom = "bottom",
	Choice = "choice",
}

export enum TextBoxType {
	None,
	Box,
	Faded,
}

export function shuffleArray<T>(array: T[]) {
	for (let i = array.length - 1; i > 0; --i) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
