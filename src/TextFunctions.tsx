enum TextColor {
	Default = "",
	Red = "red",
	Blue = "blue",
	BodyYellow = "bodyYellow",
	SpiritPink = "spiritPink",
	MindBlue = "mindBlue",
}

const colorCodes = new Map([
	["`", TextColor.Default],
	["@", TextColor.Red],
	["$", TextColor.Blue],
	["^", TextColor.BodyYellow],
	["&", TextColor.SpiritPink],
	["*", TextColor.MindBlue],
]);

export function jsonStringToJSX(str: string, currentCharIndex: number): JSX.Element[] {
	const result: JSX.Element[] = [];
	let currentColor = TextColor.Default;
	for (let i = 0; i < str.length; ++i) {
		const colorCode = colorCodes.get(str[i]);
		if (colorCode === undefined) {
			result.push(<span className={currentColor} key={i} style={{opacity: i < currentCharIndex ? 1 : 0}}>{str[i]}</span>);
		} else {
			currentColor = colorCode;
		}
	}

	return result;
}

export function startsWithVowel(text: string): boolean {
	if (text.length == 0) {
		return false;
	}

	switch (text[0].toLowerCase()) {
		case 'a':
		case 'e':
		case 'i':
		case 'o':
		case 'u':
			return true;
		default:
			return false;
	}
}
