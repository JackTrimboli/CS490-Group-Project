<?php
define("debug", false);
define("logging", true);
$logIgnoreOpCodes = ['login', 'getQuestions', 'getTest', 'getTests'];
$json = file_get_contents('php://input');
$inputData = json_decode($json, true);
if(debug && !isset($inputData['opCode']))
{
	echo 'Debug Mode<br>';
	$inputData['opCode'] = 'getQuestions';
	$inputData['teacherID'] = 6;
	//$inputData['testID'] = 23;
	$inputData['userID'] = 3;
	$inputData['questions'] = [array("ID"=>67,'functionActualScore'=>0.000,'comment'=>'\"\"','constraintActualScore'=>0.0, 'scores'=>[])];

	//login
	$inputData['name'] = 'adam';
	$inputData['pass'] = 'thisStinks';

	//createQuestion
	$inputData['text'] = 'Make a function called double that doubles an int value.';
	$inputData['functionName'] = 'double';
	$inputData['testCases'] = [['2', '4'], ['4', '8']];
	//$inputData['difficulty'] = 'medium';
	$inputData['topic'] = 'Logical';
	$inputData['constraint'] = 'none';

	$inputData['keyword'] = 'Sum';
	$inputData['name'] = 'Test 1';
	//$inputData['questions'] = [array('id'=>27, 'value'=>25)];
	
	
	//echo json_encode($inputData);
}
if(logging)
{
	if(true || !in_array($inputData['opCode'], $logIgnoreOpCodes))
		$file = 'logs/log.txt';
	else
		$file = 'logs/unusedLog.txt';
	date_default_timezone_set('America/New_York');
	$logEntry = date('l jS \of F Y h:i:s A') . "\n" . $json . "\n\n";
	file_put_contents($file, $logEntry, FILE_APPEND | LOCK_EX);
}

$opCode = -1;
if(isset($inputData['opCode'])) $opCode = $inputData['opCode'];
//Choose operation
switch($opCode)
{
	case 'login':
		if(checkParams(['name', 'pass']))
		{
			//Do a sql call
			$sqlQuery = "SELECT userID, userName, userType FROM Accounts WHERE userName = '" . $inputData['name'] . "' AND userPass = '" . $inputData['pass'] . "'";
			$outData = sql($sqlQuery)[0][0];
			
			//Check if it matches an account
			if($outData==null)
			{
				$json_data = json_encode(array('opCode'=>'badLogin', 'name'=>$inputData['name']));
				echo $json_data;
				return $json_data;
			}
			//Rename variables
			$data = array('opCode'=>'login', 'id'=>$outData['userID'], 'name'=>$outData['userName'], 'type'=>$outData['userType']);

			//Return the data
			$json_data = json_encode($data);
			
			echo $json_data;
			return $json_data;
		}
		else
		{
			//Missing information throw an error
			echo 'Missing Parameters!';
		}
		break;
	case 'createQuestion':
		//Check that all data is here
		if(checkParams(['teacherID', 'text', 'functionName', 'testCases', 'difficulty', 'topic', 'constraint']))
		{
			$inputData['functionName'] = str_replace(' ', '', $inputData['functionName']);
			$sqlQuery = 'INSERT INTO Questions (teacherID, questionText, functionName, difficulty, topic, funcConstraint) 
			VALUES (' . sqlList(['teacherID', 'text', 'functionName', 'difficulty', 'topic', 'constraint']) . ');
			SELECT LAST_INSERT_ID() AS questionID;';
			$result = sql($sqlQuery)[1][0];
			$sqlCases = 'INSERT INTO QuestionCases (questionID, input, output)
			VALUES ';
			foreach($inputData['testCases'] as $case)
			{
				$sqlCases .= "({$result['questionID']}, '$case[0]', '$case[1]'), ";
			}
			sql(rtrim($sqlCases, ", "));
			
			$json_data = json_encode(array('opCode'=>'newQuestion', 'questionID'=>$result['questionID']));
			echo $json_data;
			return $json_data;
		}
		else
		{
			//Error
			echo 'createQuestion Missing Params';
		}
		break;
	case 'getQuestions':
		$sqlQuery = "SELECT * FROM QuestionCases INNER JOIN Questions ON Questions.questionID = QuestionCases.questionID";
		$added = False;
		
		$added = false;
		foreach(['teacherID', 'testID', 'difficulty', 'topic', 'keyword'] as $param)
		{
			if(checkParams($param))
			{
				//Check for WHERE or AND
				if(!$added)
				{
					$sqlQuery .= ' WHERE';
					$added = true;
				}
				else
					$sqlQuery .= ' AND';

				switch($param)
				{
					case 'teacherID':
						$sqlQuery .= " teacherID = {$inputData['teacherID']}";
						break;
					case 'testID':
						$sqlQuery .= " QuestionCases.questionID IN (SELECT TestQuestions.questionID FROM TestQuestions WHERE testID = {$inputData['testID']})";
						break;
					case 'difficulty':
						$sqlQuery .= " difficulty = '{$inputData['difficulty']}'";
						break;
					case 'topic':
						$sqlQuery .= " topic = '{$inputData['topic']}'";
						break;
					case 'keyword':
						$sqlQuery .= " (questionText LIKE '%{$inputData['keyword']}%' OR functionName LIKE '%{$inputData['keyword']}%')";
						break;
				}
			}
		}
		$sqlQuery .= ';';

		$result = sql($sqlQuery)[0];
		
		$output=array('opCode' => 'questions', 'questions' => []);
		$questionIndex = [];
		foreach($result as $row)
		{
			$index = array_search($row['questionID'], $questionIndex);
			if($index !== False)
			{
				//Just add the found test cases
				array_push($output['questions'][$index]['testCases'], [$row['input'], $row['output']]);
			}
			else
			{
				$modRow = array_diff_key($row, array_flip(['input', 'output', 'funcConstraint']));
				$modRow['constraint'] = $row['funcConstraint'];
				$modRow['testCases'] = [[$row['input'], $row['output']]];
				array_push($output['questions'], $modRow);
				array_push($questionIndex, $row['questionID']);
			}
		}
		
		$json = json_encode($output);
		echo $json;
		return $json;
		
		break;
	case 'getTopics':
		$sqlQuery = 'SELECT DISTINCT topic FROM Questions';
		if(checkParams('teacherID'))
			$sqlQuery .= " WHERE teacherID = {$inputData['teacherID']}";
		$sqlQuery .= ';';
		$results = sql($sqlQuery)[0];

		$out = [];
		if($results != null)
		{
			//Stored in multiple rows
			foreach($results as $row)
			{
				array_push($out, $row['topic']);
			}
		}
		
		$json = json_encode(array('opCode' => 'topics', 'topics' => $out));
		echo $json;
		return $json;
		break;
	case 'createTest':
		if(checkParams(['name', 'teacherID', 'questions']))
		{
			$sqlQuery = 'INSERT INTO Tests (teacherID, testName) 
			VALUES (' . sqlList(['teacherID', 'name']) . ');
			SELECT LAST_INSERT_ID() AS testID;';
			$result = sql($sqlQuery)[1][0];
			if(count($inputData['questions']) > 0)
			{
				$sqlQuests = 'INSERT INTO TestQuestions (testID, questionID, questionValue) VALUES';
				foreach($inputData['questions'] as $question)
				{
					$sqlQuests .= "({$result['testID']}, '{$question['id']}', '{$question['value']}'), ";
				}
				sql(rtrim($sqlQuests, ', '));
			}

			$json = json_encode(array('opCode'=>'newTest', 'testID'=>$result['testID']));
			echo $json;
			return $json;
		}
		else
		{
			echo 'Missing Parameters!';

		}
		break;
	case 'editTest':
		if(checkParams('testID'))
		{
			if(checkParams('addQuests'))
			{
				$sqlQuests = 'INSERT INTO TestQuestions (testID, questionID, questionValue)
				VALUES';
				foreach($inputData['addQuests'] as $question)
				{
					$sqlQuests .= "({$inputData['testID']}, '{$question['id']}', '{$question['value']}'), ";
				}
				sql(rtrim($sqlQuests, ', '));
			}

			if(checkParams('remQuests'))
			{
				$sqlQuests = "DELETE FROM TestQuestions WHERE testID = {$inputData['testID']} AND questionID IN (";
				foreach($inputData['remQuests'] as $question)
				{
					$sqlQuests .= "{$question['id']}, ";
				}
				$sqlQuests = rtrim($sqlQuests, ', ');
				$sqlQuests .= ');';
				sql($sqlQuests);
			}

			if(checkParams('questions'))
			{
				$sqlRem = "DELETE FROM TestQuestions WHERE testID = {$inputData['testID']};";
				$sqlQuests = 'INSERT INTO TestQuestions (testID, questionID, questionValue)
				VALUES';
				foreach($inputData['questions'] as $question)
				{
					$sqlQuests .= "({$inputData['testID']}, '{$question['id']}', '{$question['value']}'), ";
				}
				sql($sqlRem . rtrim($sqlQuests, ', '));
			}
		}
		else
		{
			echo 'Missing Parameters!';
		}
		break;
	case 'getTest':
		if(!checkParams('testID'))
			break;
		$inputData['questions']=true;
	case 'getTests':
		$sqlQuery = "SELECT * FROM Tests";
		if(checkParams('testID'))
			$sqlQuery .= " WHERE testID = {$inputData['testID']}";
		else if(checkParams('teacherID'))
			$sqlQuery .= " WHERE teacherID = {$inputData['teacherID']}";
		$results = sql($sqlQuery)[0];

		if(checkParams('questions') && $inputData['questions'] && count($results) != 0)
		{
			//List all testIDs
			$testIDs = [];
			foreach($results as $row)
			{
				array_push($testIDs, $row['testID']);
			}
			
			
			//Get the questions for each test
			$sqlQuests = "";
			foreach($testIDs as $id)
			{
				$sqlQuests .= "SELECT Q.questionID, teacherID, questionText, functionName, difficulty, topic, funcConstraint, questionValue, input, output 
				FROM Questions AS Q INNER JOIN TestQuestions AS TQ ON Q.questionID = TQ.questionID INNER JOIN QuestionCases as QC ON Q.questionID = QC.questionID WHERE TQ.testID = $id;";
			}
			$AllQuestions = sql($sqlQuests);
			
			for($i = 0; $i < count($AllQuestions); $i++)
			{
				//Looping over each set of questions which also relates to each individual test
				$results[$i]['questions'] = [];
				$quests = $AllQuestions[$i];
				$questIndex = [];
				foreach($quests as $question)
				{
					$index = array_search($question['questionID'], $questIndex);
					if($index !== False)
					{
						//Just add the found test cases
						array_push($results[$i]['questions'][$index]['testCases'], [$question['input'], $question['output']]);
					}
					else
					{
						$modRow = array_diff_key($question, array_flip(['input', 'output', 'funcConstraint']));
						$modRow['constraint'] = $question['funcConstraint'];
						$modRow['testCases'] = [[$question['input'], $question['output']]];
						array_push($results[$i]['questions'], $modRow);
						array_push($questIndex, $question['questionID']);
					}
				}
			}
		}

		if($inputData['opCode'] == 'getTest')
		{//Return single test
			if(count($results) > 0)
				$test = $results[0];
			else
				$test = [];
			$test['opCode'] = 'test';
			$json = json_encode($test);
		}
		else
		{
			$json = json_encode(array('opCode'=>'tests', 'tests'=>$results));
		}

		echo $json;
		return $json;

		break;
	case 'sendTest':
		if(checkParams(['testID', 'userID', 'questions']))
		{
			$sqlQuery = "INSERT INTO TestScores (testID, userID, questionID, answer) VALUES ";
			foreach($inputData['questions'] as $question)
			{
				$sqlQuery .= "({$inputData['testID']}, {$inputData['userID']}, {$question['ID']}, '{$question['answer']}'), ";
			}
			sql(rtrim($sqlQuery, ', '));
			echo $sqlQuery . '\n';
		}
		else
		{
			echo 'Missing Parameters!';
		}
		break;
	case 'getScoringMaterial':
		if(checkParams('testID'))
		{
			$sqlQuery = "UPDATE Tests SET autoGrading = 1 WHERE testID = {$inputData['testID']}; SELECT userID, questionID, answer FROM TestScores WHERE testID = {$inputData['testID']}";
			$results = sql($sqlQuery)[1];
			
			$users = [];
			$userIndexs = [];
			foreach($results as $row)
			{
				$index = array_search($row['userID'], $userIndexs);
				if($index !== False)
				{
					//Just add the found test cases
					array_push($users[$index]['questions'], array('questionID'=>$row['questionID'], 'answer'=>$row['answer']));
				}
				else
				{
					array_push($users, array('userID' => $row['userID'], 'questions' => [array('questionID'=>$row['questionID'], 'answer'=>$row['answer'])]));
					array_push($userIndexs, $row['userID']);
				}
			}

			$output = array('opCode' => 'scoringMaterial', 'testID' => $inputData['testID'], 'users' => $users);
			$json = json_encode($output);
			echo $json;
			return $json;
		}
		else
		{
			echo 'Missing Parameters!';
		}

		break;
	case 'sendScores':
		if(checkParams(['testID', 'users']))
		{
			$sqlQuery = 'INSERT INTO TestScores (testID, userID, questionID, functionName, testFunctionName, functionScore, functionActualScore, constraintScore, constraintActualScore) VALUES ';
			$sqlCases = 'INSERT INTO TestScoreCases (testID, userID, questionID, input, expectedOutput, actualOutput, autoScore, actualScore) VALUES ';

			//Insert Value Generation
			foreach($inputData['users'] as $user)
			{
				foreach($user['questions'] as $question)
				{
					$sqlQuery .= "({$inputData['testID']}, {$user['userID']}, {$question['questionID']}, '{$question['functionName']}', '{$question['testFunction']}', {$question['functionScore']},
					{$question['functionScore']}, {$question['constraintScore']}, {$question['constraintScore']}), ";
					//$sqlQuery .= "({$inputData['testID']}, {$user['userID']}, {$question['questionID']}), ";
					foreach($question['scores'] as $case)
					{
						$sqlCases .= "({$inputData['testID']}, {$user['userID']}, {$question['questionID']}, '{$case['input']}', '{$case['expectedOutput']}',  '{$case['actualOutput']}',  {$case['autoScore']},
						{$case['autoScore']}), ";
					}
				}
			}

			//Trim both querys
			$sqlQuery = rtrim($sqlQuery, ', ');
			$sqlCases = rtrim($sqlCases, ', ');

			$sqlQuery .= ' ON DUPLICATE KEY UPDATE testID=VALUES(testID), userID=VALUES(userID), questionID=VALUES(questionID), functionName=VALUES(functionName), testFunctionName=VALUES(testFunctionName),
			functionScore=VALUES(functionScore), functionActualScore=VALUES(functionActualScore); ';
			$sqlQuery .= $sqlCases . ';';
			//echo $sqlQuery;
			//return $sqlQuery;
			sql($sqlQuery);
			
			
		}
		else
		{
			echo 'Missing Parameters';
		}
		break;
	case 'getTestSubmissions':
		if(checkParams(['testID']))
		{
			$sqlQuery = "SELECT Accounts.userID, userName FROM Accounts INNER JOIN (SELECT DISTINCT testID, userID FROM TestScores) AS TS ON Accounts.userID = TS.userID WHERE TS.testID = {$inputData['testID']}";
			$result = sql($sqlQuery)[0];
			$json = json_encode(array('opCode'=>'submissions', 'users'=>$result));
			echo $json;
			return $json;
		}
		else
		{
			echo 'Missing Paramaters';
		}
		break;
	case 'getScores':
		if(checkParams(['testID', 'userID']))
		{
			$output = array('opCode'=>'scores', 'testID'=>$inputData['testID'], 'userID'=>$inputData['userID'], 'questions'=>[]);
			
			$sqlQuery = "SELECT TS.testID, TS.questionID, userID, answer, TS.functionName, testFunctionName, functionScore, functionActualScore, comment, questionValue, questionText, difficulty, topic, funcConstraint,
			constraintScore, constraintActualScore FROM TestScores AS TS INNER JOIN TestQuestions AS TQ ON
			TS.questionID = TQ.questionID AND TQ.testID = TS.testID INNER JOIN Questions AS Q ON Q.questionID = TS.questionID WHERE TS.testID = {$inputData['testID']} AND TS.userID = {$inputData['userID']};";
			$results = sql($sqlQuery)[0];
			foreach($results as $question)
			{
				$sqlCases = "SELECT * FROM TestScoreCases WHERE testID = {$inputData['testID']} AND userID = {$inputData['userID']} AND questionID = {$question['questionID']}";
				$cases = sql($sqlCases)[0];
				$newQuest = array_diff_key($question, array_flip(['testID', 'userID']));
				$newQuest['scores'] = [];
				foreach($cases as $case)
				{
					$newCase = array_diff_key($case, array_flip(['testID', 'userID', 'questionID']));
					array_push($newQuest['scores'], $newCase);
				}
				array_push($output['questions'], $newQuest);
			}

			$json = json_encode($output);
			echo $json;
			return $json;
			
		}
		else
		{
			echo 'Missing Parameters';
		}
		break;
	case 'updateScore':
		if(checkParams(['testID', 'userID', 'questions']))
		{
			$sqlQuery = '';
			//Insert Value Generation
			foreach($inputData['questions'] as $question)
			{
				foreach(['constraintActualScore', 'functionActualScore'] as $param)
				{
					$question[$param] = (float)$question[$param];
				}
				$sqlQuery .= " UPDATE TestScores SET functionActualScore = {$question['functionActualScore']}, comment = '{$question['comment']}', constraintActualScore =
				{$question['constraintActualScore']} WHERE testID =
				{$inputData['testID']} AND userID = {$inputData['userID']} AND questionID = {$question['questionID']};";
				foreach($question['scores'] as $case)
				{
					foreach(['actualScore'] as $param)
					{
						$case[$param] = (float)$case[$param];
					}
					$sqlQuery .= " Update TestScoreCases SET actualScore = {$case['actualScore']} WHERE testID = {$inputData['testID']} AND userID = {$inputData['userID']} AND questionID = {$question['questionID']}
					AND input = '{$case['input']}';";
				}
			}

			//echo $sqlQuery;
			sql($sqlQuery);

		}
		else
		{
			echo 'Missing Parameters';
		}
		break;
	case 'releaseTest':
		if(checkParams(['testID']))
		{
			$sqlQuery = "UPDATE Tests SET testReleased = 1 WHERE testID = {$inputData['testID']}";
			sql($sqlQuery);
		}
		else
		{
			echo 'Missing Parameters';
		}
		break;
	case 'releaseGrades':
		if(checkParams(['testID']))
		{
			$sqlQuery = "UPDATE Tests SET gradesReleased = 1 WHERE testID = {$inputData['testID']}";
			sql($sqlQuery);
		}
		else
		{
			echo 'Missing Parameters';
		}
	default:
		//Incorrect opCode given, throw curl error
		break;
}

function checkParams($params)
{
	global $inputData;
	//Assumed list of params
	$allParams = true;
	if(!is_array($params))
		$params = [$params];
	foreach ($params as $par)
	{
		if(!(isset($inputData[$par])))
		{
			$allParams = false;
			//if(debug) echo 'Param Failed: ' . $par . '<br>';
		}
	}
	return $allParams;
}

function sqlList($vals)
{
	global $inputData;
	$result = "";
	foreach($vals as $param)
	{
		$val = $inputData[$param];
		switch(gettype($val))
		{
			case 'string':
				$result .= "'$val', ";
				break;
			case 'integer':
			case 'double':
				$result .= "$val, ";
				break;
		}
	}
	$result = rtrim($result, ", ");
	return $result;
}

function sql($query)
{
	$sqlServer = 'sql1.njit.edu';
	$connInfo = fopen('sqlCredentials.txt', 'r') or die('File did not open.');
	$sqlUser = rtrim(fgets($connInfo), "\r\n");
	$sqlPass = rtrim(fgets($connInfo), "\r\n");
	$sqlDB = 'acp47';

	//Do sqlQuery string modification to prevent certain problems
	//$sqlQuery = str_replace("'", "''", $sqlQuery);
	//$sqlQuery = str_replace("\"", "\\\"", $sqlQuery);

	$conn = new mysqli($sqlServer, $sqlUser, $sqlPass, $sqlDB);
	if ($conn->connect_error)
	{
		die('Connection Failed');
	}
	
	if(!$conn->multi_query($query))
	{
		//Error
		if(debug) echo $conn->error . '<br>';
		$conn->close();
		return;
	}
	
	$data = [];
	do
	{
		$result = $conn->store_result();

		if($result === false)
		{
			if($conn->error != '')
			{
				if(debug) echo $conn->error;
			}
			else //Assumed to have no rows
				array_push($data, []);
		}
		else
		{
			$rows = $result->fetch_all(MYSQLI_ASSOC);
			array_push($data, $rows);
		}
	}
	while($conn->more_results() && $conn->next_result());
	
	$conn->close();
	
	return $data;
}
?>
