<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$json = file_get_contents('php://input');
$data_json = json_decode($json, true);

if(isset($data_json['testID'])) $testID = $data_json['testID'];
if(isset($data_json['userID'])) $userID = $data_json['userID'];

//$testID = 4;
//$userID = 1;

$back_info = getScores($userID, $testID);


function getScores($userID, $testID) {
    $url = "https://afsaccess4.njit.edu/~am2729/beta/GetScores.php";
    $ch = curl_init();
    $data = array('userID' => $userID, 'testID' => $testID, 'opCode' => 'getScores');
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $server_out = curl_exec($ch);
    curl_close($ch);
    echo "$server_out \n";
    return $server_out;
}
?>