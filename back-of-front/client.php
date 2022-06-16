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
	$username = '';
	$password = '';

	//checks if the json data contained user/pass, and stores them if it does
	if(isset($data_json['name'])) $username = $data_json['name'];
	if(isset($data_json['pass'])) $password = $data_json['pass'];

	//Gets info from middle/backend
	$back_info = login_back($username, $password);
	echo $back_info;


	function login_back($username, $password) {
		//endpoint we are accessing
    		$url = "https://afsaccess4.njit.edu/~am2729/Login.php";
    		$ch = curl_init();
    		$data = array('name' => $username, 'pass' => $password, 'opCode' => 'login');
    		curl_setopt($ch, CURLOPT_URL, $url);
    		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
   	 	$server_out = curl_exec($ch);
    		curl_close($ch);
    		return $server_out;
	}
?>