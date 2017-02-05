<?php

$myClientId = '4Hxdpv7gBE';
$mySecret = 'zp6Hqq22RnMyKP7q89BQm4';
$myUrl = 'http://thothbot.000webhostapp.com/auth.php';

session_start();

// Helper function for errors
function displayError($step) {
	echo '<h2>An error occurred in step '.$step.'</h2>';
}

// Get things using Quizlet API

// echo "<p>Step 3 completed - Authorized as {$_SESSION['username']}.</p>";

// request
//$curl = curl_init("https://api.quizlet.com/2.0/users/{$_SESSION['username']}/sets");
$curl = curl_init("https://api.quizlet.com/2.0/users/thothbot/sets");
curl_setopt($curl, CURLOPT_HTTPHEADER, ['Authorization: Bearer '.$_SESSION['access_token']]);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$listjson = curl_exec($curl);
echo $listjson;
$responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if (intval(floor($responseCode / 100)) !== 2) { // A non 200-level code is an error (our API typically responds with 200 and 204 on success)
	displayError((array) $data, 3);
	exit();
}

//echo "<p>STATE: ", $_GET['state'], " CODE: ", $_GET['code'], "</p>";
echo "<script>window.close();</script>";

?>
