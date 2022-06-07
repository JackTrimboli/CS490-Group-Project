<?php
/*
Adrian Majcher
am2729
CS490
Middle
*/
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$json = file_get_contents('php://input');
$data_json = json_decode($json, true);
$username = '';
$password = '';

if(isset($data_json['name'])) $username = $data_json['name'];
if(isset($data_json['pass'])) $password = $data_json['pass'];

$back_info = login_back($username, $password);
echo $back_info;

function login_back($username, $password) {
    //$url = "https://web.njit.edu/~acp47/server/server.php";
    $url = "https://afsaccess4.njit.edu/~acp47/server/server.php";
    $ch = curl_init();
    $data = array('name' => $username, 'pass' => $password, 'opCode' => 'login');
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $server_out = curl_exec($ch);
    curl_close($ch);
    //print "$server_out \n";
    return $server_out;
}
?>
