?>
afsconnect1-32 public_html >: cat GetQuestionBank.php
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
        $testID = -1;

        //checks if the json data contained user/pass, and stores them if it does
        if(isset($data_json['teacherID'])) $teacherID = $data_json['teacherID'];
        if(isset($data_json['testID'])) $testID = $data_json['testID'];

        //Gets info from middle/backend
        $back_info = getQuestions($teacherID, $testID);
        echo $back_info;


        function getQuestions($teacherID, $testID) {
                //endpoint we are accessing
                $url = "https://afsaccess4.njit.edu/~am2729/beta/GetQuestionBank.php";
                $ch = curl_init();
		if($testID == -1)
			$data = array('teacherID' => intval( $teacherID ), 'opCode' => 'getQuestions');
		else
                	$data = array('teacherID' => intval( $teacherID ), 'testID' => $testID, 'opCode' => 'getQuestions');
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                $server_out = curl_exec($ch);
                curl_close($ch);
                return $server_out;
        }
?>