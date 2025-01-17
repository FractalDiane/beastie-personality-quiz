import json
import random

VIBES = [
	"anxious",
	"brash",
	"calm",
	"carefree",
	"dramatic",
	"easygoing",
	"energetic",
	"gentle",
	"goofy",
	"jolly",
	"kind",
	"logical",
	"lonely",
	"mischievous",
	"passionate",
	"reckless",
	"serious",
	"shy",
	"spacey",
	"tough",
]

class Scores:
	def __init__(self):
		self.scores = [0] * len(VIBES)

	def __str__(self):
		return str([f"{VIBES[i]}: {value}" for i, value in enumerate(self.scores)])

	def add_score(self, vibe):
		self.scores[VIBES.index(vibe)] += 1
		

file_notballin = open("src/data/questions_notballin.json", "r")
questions = json.load(file_notballin)
file_notballin.close()

file_ballin = open("src/data/questions_ballin.json", "r")
questions += json.load(file_ballin)
file_ballin.close()



for vibe in VIBES:
	scores = Scores()
	for question in questions:
		for answer in question["answers"]:
			if vibe in answer["points"]:
				for vb in answer["points"]:
					scores.add_score(vb)

				break
		else:
			for vb in question["answers"][random.randint(0, len(question["answers"]) - 1)]["points"]:
				scores.add_score(vb)

	print(f"=== {vibe.upper()} ===")
	print(scores)
