import csv
import json
import sys

questions_notballin = []
questions_ballin = []

with open(sys.argv[1], newline="") as csvfile:
	reader = csv.reader(csvfile)
	next(reader)
	index = 0
	for row in reader:
		if len(row[-1]) > 0:
			if len(row[0]) > 0:
				question = {
					"question": row[0],
					"sortOrder": int(row[5]) if len(row[5]) > 0 else 0,
					"shuffleAnswers": len(row[6]) > 0,
					"index": index,
				}

				answers = []

				points = next(reader)[1:5]
				for ans in enumerate(row[1:5]):
					if len(ans[1]) > 0:
						answers.append({
							"answer": ans[1],
							"points": [point.strip().lower() for point in points[ans[0]].split(",")],
						})

				question["answers"] = answers

				if row[-1] == "ballin":
					questions_ballin.append(question)
				else:
					questions_notballin.append(question)

				index += 1

with open("src/data/questions_notballin.json", "w") as file_notballin:
	file_notballin.write(json.dumps(questions_notballin))

with open("src/data/questions_ballin.json", "w") as file_ballin:
	file_ballin.write(json.dumps(questions_ballin))
