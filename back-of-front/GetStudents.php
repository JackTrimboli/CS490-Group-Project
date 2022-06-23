<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$json = file_get_contents('php://input');
$data_json = json_decode($json, true);

if(isset($data_json['testID'])) $testID = $data_json['testID'];

$back_info = getTestSubmissions($testID);
echo $back_info;

function getTestSubmissions($testID) {
    $url = "https://afsaccess4.njit.edu/~am2729/beta/GetTestSubmissions.php";
    $ch = curl_init();
    $data = array('testID' => $testID, 'opCode' => 'getTestSubmissions');
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $server_out = curl_exec($ch);
    curl_close($ch);
    //print "$server_out \n";
    return $server_out;
}
?>