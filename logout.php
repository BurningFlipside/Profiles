<?php
require_once('class.ProfilesPage.php');
$cookieParams = session_get_cookie_params();
setcookie('Flipside_JWT', '', time() - 3600, '/', $cookieParams['domain'], true);
\Flipside\FlipSession::end();
$page = new ProfilesPage('Burning Flipside Profiles');

$page->body .= '
<div id="content">
    You have been logged out.
</div>
<script>
    function send_to_index()
    {
        window.location.href="index.php";
    }
    setTimeout(send_to_index, 5000);
</script>';

$page->printPage();
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
