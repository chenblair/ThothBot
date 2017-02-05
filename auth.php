<?php

// Your credentials
$myClientId = '4Hxdpv7gBE';
$mySecret = 'zp6Hqq22RnMyKP7q89BQm4';
$myUrl = 'http://thothbot.000webhostapp.com/auth.php';

$authorizeUrl = "https://quizlet.com/authorize?client_id={$myClientId}&response_type=code&scope=read%20write_set";
$tokenUrl = 'https://api.quizlet.com/oauth/token';

session_start();

// Helper function for errors
function displayError($step) {
	echo '<h2>An error occurred in step '.$step.'</h2>';
}

// Step 1: Auth Token
	echo "<p>Step 1 completed - the user authorized our application.</p>";
  $payload = [
    'code' => $_GET['code'],
    'redirect_uri' => $myUrl,
  	'grant_type' => 'authorization_code',
	];
	$curl = curl_init($tokenUrl);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_USERPWD, "{$myClientId}:{$mySecret}");
  curl_setopt($curl, CURLOPT_POST, true);
  curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
  $token = json_decode(curl_exec($curl), true);
  $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
  curl_close($curl);

  if ($responseCode !== 200) { // An error occurred getting the token
	  displayError($token, 2);
  	exit();
	}

  $accessToken = $token['access_token'];
  $username = $token['username'];

  // Store the token for later use (outside of this example, you might use a real database)
  // You must treat the "access token" like a password and store it securely
  $_SESSION['access_token'] = $accessToken;
  $_SESSION['username'] = $username;

  echo "<p>Step 2 completed - access token was received.</p>";


  // Step 3: Send to Gupshup
  $ch = curl_init();
  $url = "https://www.gupshup.io/developer/bot/ThothBotTest/public?state=" . $_GET['state'] . "&code=" . $accessToken;
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_HTTPGET, true);
  $data = curl_exec($ch);
  curl_close($ch);

  echo "<p>Step 3 completed - sent to Gupshup.</p>";
  //echo "<p>STATE: ", $_GET['state'], " CODE: ", $_GET['code'], "</p>";
  echo "<script>window.close();</script>";

?>
