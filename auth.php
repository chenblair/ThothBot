  <?php

  // Your credentials
  $myClientId = '4Hxdpv7gBE';
  $mySecret = 'zp6Hqq22RnMyKP7q89BQm4';
  $myUrl = 'https://mature-upside.000webhostapp.com/test.php';

$authorizeUrl = "https://quizlet.com/authorize?client_id={$myClientId}&response_type=code&scope=read%20write_set";

  session_start();

  // Helper function for errors
  function displayError($step) {
  	echo '<h2>An error occurred in step '.$step.'</h2>';
  }

  // Step 1: Authorize
  if (empty($_GET['code']) && empty($_GET['error'])) { // only if something somehow went wrong
  	$_SESSION['state'] = md5(mt_rand().microtime(true)); // CSRF protection
  	echo '<a href="'.$authorizeUrl.'&state='.urlencode($_SESSION['state']).'&redirect_uri='.urlencode($myUrl).'">Step 1: Start Authorization</a>';
  	exit();
  }

  if (!empty($_GET['error'])) { // An error occurred authorizing
  	displayError($_GET, 1);
  	exit();
  }

  /*if ($_GET['state'] !== $_SESSION['state']) {
  	exit("We did not receive the expected state. Possible CSRF attack.");
  }*/

  // Step 2: Auth Token
  if (!isset($_SESSION['access_token'])) {
  	echo "<p>Application authorized</p>";

    $vars = [
      'state' => $_GET['state'],
      'code' => $_GET['code'],
    ];
    /*$curl = curl_init("https://www.gupshup.io/developer/bot/ThothBotTest/public");
    curl_setopt($curl, CURLOPT_POSTFIELDS, $vars);
    $responseCode = curl_exec($curl);
    curl_close($curl);

    if ($responseCode !== 200) { // An error occurred getting the token
      displayError(2);
      exit();
    }*/

    $ch = curl_init();
    $url = "https://www.gupshup.io/developer/bot/ThothBotTest/public?state=" . $_GET['state'] . "&code=" . $_GET['code'];
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPGET, true);
    $data = curl_exec($ch);
    curl_close($ch);

  	echo "<p>Step 2 completed - access token was received.</p>";
    //echo "<p>STATE: ", $_GET['state'], " CODE: ", $_GET['code'], "</p>";
    echo "<script>window.close();</script>";

  }
?>
