<?php
define("debug", false);
define("logging", true);
$json = file_get_contents('php://input');
$inputData = json_decode($json, true);
if(debug && !isset($inputData['opCode']))
{
	echo 'Debug Mode<br>';
	$inputData['opCode'] = 'getQuestions';
	$inputData['teacherID'] = 2;
	//$inputData['testID'] = 4;

	//login
	$inputData['name'] = 'adam';
	$inputData['pass'] = 'thisStinks';

	//createQuestion
	$inputData['text'] = 'Make a function called double that doubles an int value.';
	$inputData['functionName'] = 'double';
	$inputData['testCases'] = [['2', '4'], ['4', '8']];
	$inputData['difficulty'] = 'Medium';
	$inputData['topic'] = 'For Loops';

	$inputData['name'] = 'Test 1';
	//$inputData['questions'] = [array('id'=>27, 'value'=>25)];
	
	
	//echo json_encode($inputData);
}
else if(logging)
{
	date_default_timezone_set('America/New_York');
	$logEntry = date('l jS \of F Y h:i:s A') . "\n" . $json . "\n\n";
	file_put_contents('logs/log.txt', $logEntry, FILE_APPEND | LOCK_EX);
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
		}
		break;
	case 'createQuestion':
		//Check that all data is here
		if(checkParams(['teacherID', 'text', 'functionName', 'testCases', 'difficulty', 'topic']))
		{
			$sqlQuery = 'INSERT INTO Questions (teacherID, questionText, functionName, difficulty, topic) 
			VALUES (' . sqlList(['teacherID', 'text', 'functionName', 'difficulty', 'topic']) . ');
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
		if(checkParams('teacherID'))
			$sqlQuery .= " WHERE teacherID = {$inputData['teacherID']}";
			$added = True;
		if(checkParams('testID'))
		{
			if(!$added)
				$sqlQuery .= ' WHERE';
			else
				$sqlQuery .= ' AND';
			$sqlQuery .= " QuestionCases.questionID IN (SELECT TestQuestions.questionID FROM TestQuestions WHERE testID = {$inputData['testID']})";
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
				$modRow = array_diff_key($row, array_flip(['input', 'output']));
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
			$sqlQuests = 'INSERT INTO TestQuestions (testID, questionID, questionValue)
			VALUES';
			foreach($inputData['questions'] as $question)
			{
				$sqlQuests .= "({$result['testID']}, '{$question['id']}', '{$question['value']}'), ";
			}
			sql(rtrim($sqlQuests, ', '));

			$json = json_encode(array('opCode'=>'newTest', 'testID'=>$result['testID']));
			echo $json;
			return $json;
		}
		else
		{

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
		}
		else
		{

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

		if(checkParams('questions') && $inputData['questions'])
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
				$sqlQuests .= "SELECT Q.questionID, teacherID, questionText, functionName, difficulty, topic, questionValue, input, output 
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
						$modRow = array_diff_key($question, array_flip(['input', 'output']));
						$modRow['testCases'] = [[$question['input'], $question['output']]];
						array_push($results[$i]['questions'], $modRow);
						array_push($questIndex, $question['questionID']);
					}
				}

				
			}
		}

		if($inputData['opCode'] == 'getTest' && count($results) > 0)
		{//Return single test
			$test = $results[0];
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
