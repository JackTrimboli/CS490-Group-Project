<?php
    
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");

    $json = file_get_contents('php://input');

    $url = "https://afsaccess4.njit.edu/~am2729/beta/ReleaseTest.php";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
    $server_out = curl_exec($ch);
    curl_close($ch);

    echo  $server_out;
    return $server_out;
?>