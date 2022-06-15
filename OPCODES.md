List all opCodes along with what values need to be included, if a key is followed by a [] like key[] then that key is a list of values, if a ? precedes a key it is optional
If a > preceds an opcode it is a return of the another opCode
EX: opCode | key, key ... | Comments

login | name, pass<br/>
\>login | id, name, type<br/>
\>badLogin |<br/>
createQuestion | teacherID, text, functionName, testCases[[case, output], ...], difficulty, topic, ?constraint<br/>
\>newQuestion | questionID<br/>
getQuestions | ?teacherID, ?testID<br/>
\>questions | questions[id, text, testCases[[case, output], ...], difficulty, topic]<br/>
getTopics | ?teacherID<br/>
\>topics | topics[]<br/>
createTest | name, teacherID, questions[[id, value], ...] | questions is just the IDS<br/>
\>newTest | testID<br/>
editTest | testID, ?addQuests[[id, value], ...], ?remQuests[[id], ...], ?questions[[id, value], ...]<br/>
getTests | ?teacherID, ?questions | questions is a boolean value to return the questions along with basic test information<br/>
\>tests | tests[[testID, teacherID, testName, ?questions[[questionID, teacherID, questionText, testCases[[input, output], ...], functionName, difficulty, topic, questionValue], ...]], ...]<br/>
getTest | testID | returns test along with questions<br/>
\>test | testID, teacherID, testName, questions[[questionID, teacherID, questionText, testCases[[input, output], ...], functionName, difficulty, topic, questionValue], ...] | Contains everything needed to take the test<br/>
sendTest | testID, userID, questions[[ID, answer], ...] | Used to send a test questions answers when a student finishes the test<br/>
getScoringMaterial | testID<br/>
\>scoringMaterial | testID, users[[userID, answers[[questionID, answer], ...]], ...]<br/>
sendScores | testID, users[[userID, questions[[questionID, functionName, testFunction, functionScore, scores[[input, expectedOutput, actualOutput, autoScore], ...]], ...]], ...]<br/>
getTestSubmissions | testID<br/>
\>submissions | users[[userID, userName], ...]<br/>
getScores | testID, userID<br/>
\>scores | testID, userID, questions[[questionID, functionName, testFunction, functionScore, functionActualScore, scores[[input, expectedOutput, actualOutput, autoScore, actualScore], ...], comment], ...]<br/>
updateScore | testID, userID, questions[[questionID, functionActualScore, scores[[input, actualScore], ...], ...], comment]<br/>
releaseTest | testID<br/>
releaseGrades | testID<br/>
