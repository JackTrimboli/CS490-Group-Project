<?php
/*
Jack Trimboli
jdt34
CS490
"back of frontend"
*/
  	header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: *");

        //Gets input as json
        $json = file_get_contents('php://input');
        //decodes json
        $data_json = json_decode($json, true);
	$question = '';
	$difficulty = '';
	$topic = '';
	$functionName = '';


	if(isset($data_json['question'])) $question = $data_json['question'];
	if(isset($data_json['testCases'])) $testCases = $data_json['testCases'];
	if(isset($data_json['teacherID'])) $teacherID = $data_json['teacherID'];
	if(isset($data_json['difficulty'])) $difficulty = $data_json['difficulty'];
	if(isset($data_json['topic'])) $topic = $data_json['topic'];
	if(isset($data_json['functionName'])) $functionName = $data_json['functionName'];

        //Gets info from middle/backend

	$info = sendQuestion($question, $testCases, $teacherID, $difficulty, $topic, $functionName);

	function sendQuestion($question, $testCases, $teacherID, $difficulty, $topic, $functionName) {
           $url = "https://afsaccess4.njit.edu/~am2729/beta/QuestionEnter.php";
           $ch = curl_init();
           $data = array('teacherID' => $teacherID, 'text' => $question, 'testCases' => $testCases, 'opCode' => 'createQuestion', 'difficulty' => $difficulty, 'topic' => $topic, 'functionName' => $functionName);
    	   curl_setopt($ch, CURLOPT_URL, $url);
   	   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   	   curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
           $server_out = curl_exec($ch);
   	   curl_close($ch);
  	   echo $server_out;
 	   return $server_out;
	}

?>