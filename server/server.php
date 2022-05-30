<?php
define("debug", False);
$json = file_get_contents('php://input');
$inputData = json_decode($json, true);
if(debug)
{
	echo 'Debug Mode<br>';
	$inputData['opCode'] = 'login';
	$inputData['name'] = 'adam';
	$inputData['pass'] = 'thisStinks';
}


$opCode = -1;
if(isset($inputData['opCode'])) $opCode = $inputData['opCode'];
//Choose operation
switch($opCode)
{
	case 'login':
		if(isset($inputData['name']) && isset($inputData['pass']))
		{
			//Do a sql call
			$sqlQuery = "select userID, userName, userType from Accounts where userName = '" . $inputData['name'] . "' and userPass = '" . $inputData['pass'] . "'";
			$outData = sql($sqlQuery);
			
			//Check if it matches an account
			if($outData==null)
			{
				$json_data = json_encode(array('opCode'=>'badLogin'));
				echo $json_data;
				return $json_data;
			}
			
			//Rename variables
			$data = array('opCode'=>'login', 'id'=>$outData['userID'], 'name'=>$outData['userName'], 'type'=>$outData['userType']);

			//Return the data
			$json_data = json_encode($data);
			
			echo $json_data;
			return $json_data;
		}
		else
		{
			//Missing information throw an error
		}
		break;
	default:
		//Incorrect opCode given, throw curl error
		
		break;
}

function sql($query)
{
	$sqlServer = 'sql1.njit.edu';
	$connInfo = fopen('sqlCredentials.txt', 'r') or die('File did not open.');
	$sqlUser = rtrim(fgets($connInfo), "\r\n");
	$sqlPass = rtrim(fgets($connInfo), "\r\n");
	$sqlDB = 'acp47';
	
	$conn = new mysqli($sqlServer, $sqlUser, $sqlPass, $sqlDB);
	if ($conn->connect_error)
	{
		die('Connection Failed');
	}

	$result = $conn->query($query);
	if($result->num_rows == 1)
	{
		$data = $result->fetch_assoc();
		$conn->close();
		return $data;
	}
	else if($result->num_rows > 1)
	{
		$data = [];
		while($row = $result->fetch_assoc())
		{
			array_push($data, $row);
		}
		$conn->close();
		return $data;
	}
	else if(debug) echo $conn->error . '<br>';
	
	$conn->close();

}
?>
