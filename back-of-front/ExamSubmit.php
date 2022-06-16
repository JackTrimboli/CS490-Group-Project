<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$json = file_get_contents('php://input');
$data_json = json_decode($json, true);

if(isset($data_json['testID'])) $testID = $data_json['testID'];
if(isset($data_json['questions'])) $questions = $data_json['questions'];
if(isset($data_json['userID'])) $userID = $data_json['userID'];

$info = sendTest($questions, $userID, $testID);

function sendTest($questions, $userID, $testID) {
    $url = "https://afsaccess4.njit.edu/~am2729/beta/ExamSubmit.php";
    $ch = curl_init();
    $data = array('userID' => $userID, 'testID' => $testID, 'questions' => $questions, 'opCode' => 'sendTest');
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $server_out = curl_exec($ch);
    curl_close($ch);
    echo $server_out;
    return $server_out;
}
?>