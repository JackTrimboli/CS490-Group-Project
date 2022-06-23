<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$json = file_get_contents('php://input');
$data_json = json_decode($json, true);

if(isset($data_json['testID'])) $testID = $data_json['testID'];

$info = takeTest($testID);

function takeTest($testID) {
    $url = "https://afsaccess4.njit.edu/~am2729/beta/Exam.php";
    $ch = curl_init();
    $data = array('testID' => $testID, 'opCode' => 'getTest');
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $server_out = curl_exec($ch);
    curl_close($ch);
    echo $server_out;
    return $server_out;
}
?>