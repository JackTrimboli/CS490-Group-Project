List all opCodes along with what values need to be included, if a key is followed by a [] like key[] then that key is a list of values, if a ? precedes a key it is optional
If a > preceds an opcode it is a return of the another opCode
EX: opCode | key, key ... | Comments

login | name, pass<br/>
\>login | id, name, type<br/>
\>badLogin |<br/>
createQuestion | teacherID, text, functionName, testCases[case, output], difficulty, topic<br/>
getQuestions | ?teacherID, ?testID<br/>
\>questions | questions[id, text, testCases[case, output], difficulty, topic]<br/>
getTopics | ?teacherID<br/>
\>topics | <br/>
createTest | name, teacher, questions[id, value] | questions is just the IDS<br/>
editTest | testID, ?addQuests[id, value], ?remQuests[id]<br/>
getTests | ?teacherID, ?questions | questions is a boolean value to return the questions along with basic test information<br/>
\>tests | tests[id, teacher, name, questionCount, ?question[id, text, testCases[]]]<br/>
getTest | testID | returns test along with questions<br/>
\>test | testID, teacherID, testName, questions[id, text, testCase[case]] || Contains everything needed to take the test<br/>
sendTest | testID, userID, questions[ID, answer] | Used to send a test questions answers when a student finishes the test<br/>
getScoringMaterial | testID<br/>
\>scoringMaterial | testID, users[id, answers[questionId, answer]], questions[id, text, testCases[]]<br/>
