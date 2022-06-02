List all opCodes along with what values need to be included, if a key is followed by a [] like key[] then that key is a list of values, if a ? precedes a key it is optional
If a > preceds an opcode it is a return of the another opCode
EX: opCode | key, key ... | Comments

login | name, pass<br>
>login | id, name, type
>badLogin |
createQuestion | teacherID, text, testCases[], difficulty, topic
getQuestions | ?teacherID, ?testID
>questions | questions[id, text, testCases[]]
createTest | name, teacher, questions[id] | questions is just the IDS
editTest | testID, ?addQuests[id], ?remQuests[id]
getTests | ?teacher, ?questions | questions is a boolean value to return the questions along with basic test information
>tests | tests[id, teacher, name, questionCount, ?question[id, text, testCases[]]]
getTest | testID | returns test along with questions
>test | testID, teacherID, testName, questions[id, text, testCase[case]] || Contains everything needed to take the test
sendTest | testID, userID, questions[ID, answer] | Used to send a test questions answers when a student finishes the test
getScoringMaterial | testID
>scoringMaterial | testID, users[id, answers[questionId, answer]], questions[id, text, testCases[]]
