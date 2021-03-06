<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once('class.ProfilesPage.php');
$page = new ProfilesPage('Burning Flipside Profiles');
$page->addWellKnownJS(JS_CHEET, false);
$page->addJS('js/index.js');

$page->body .= '
    <h1>Welcome to the Burning Flipside Profile System</h1>
    <p>This system allows you to login to the new and improved Burning Flipside website systems.</p>
    <p>This system will contain all your private data seperately so as to help prevent unwanted display of your data on '.$page->wwwUrl.'.
       Additionally, completing your profile on this site will enable you to complete ticket requests and sign up for volunteer shifts even faster than before.</p>';

if($page->user !== null)
{
    if(!$page->user->isProfileComplete())
    {
        $page->addNotification('Your profile is not yet complete. Click <a href="profile.php" class="alert-link">here</a> to complete your profile.', $page::NOTIFICATION_WARNING);
    }
    $page->body .= '<h1>Need to reset your password?</h1>
    <p>You can <a href="'.$page->resetUrl.'">reset your password</a>.</p>';
}
else
{
    $page->body .= '
    <h1>Need to register for the first time?</h1>
    <p>You can <a href="'.$page->registerUrl.'">sign up for an account</a>.
    <h1>Forgot your username or password?</h1>
    <p>You can <a href="'.$page->resetUrl.'">lookup a forgotten username or reset your password</a>.</p>';
}

$page->printPage();
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
