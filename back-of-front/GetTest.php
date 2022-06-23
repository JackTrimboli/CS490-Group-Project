<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$json = file_get_contents('php://input');
$data_json = json_decode($json, true);

$questions = FALSE;

if(isset($data_json['teacherID'])) $teacherID = $data_json['teacherID'];
if(isset($data_json['questions'])) $questions = $data_json['questions'];
$info = getTests($questions, $teacherID);

function getTests($questions, $teacherID) {
    $url = "https://afsaccess4.njit.edu/~am2729/beta/GetExamList.php";
    $ch = curl_init();
    $data = array('teacherID' => $teacherID, 'questions' => $questions, 'opCode' => 'getTests');
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $server_out = curl_exec($ch);
    curl_close($ch);
    echo $server_out;
    return $server_out;
}
?>