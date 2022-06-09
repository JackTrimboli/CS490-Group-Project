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
	$teacherID = 0;

	if(isset($data_json['teacherID'])) $teacherID = $data_json['teacherID'];

        //Gets info from middle/backend

	$info = getTopics($teacherID);

	function getTopics($teacherID) {
           $url = "https://afsaccess4.njit.edu/~am2729/beta/GetTopics.php";
           $ch = curl_init();
           $data = array('teacherID' => $teacherID);
    	   curl_setopt($ch, CURLOPT_URL, $url);
   	   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   	   curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
           $server_out = curl_exec($ch);
   	   curl_close($ch);
  	   echo $server_out;
 	   return $server_out;
	}

?>