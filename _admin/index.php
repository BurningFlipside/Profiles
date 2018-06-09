<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once('class.ProfilesAdminPage.php');
$page = new ProfilesAdminPage('Burning Flipside Profiles - Admin');
$page->setTemplateName('admin-dashboard.html');
$page->addJS('js/index.js');

$auth = AuthProvider::getInstance();
$user_count = $auth->getActiveUserCount(false);
$temp_user_count = $auth->getPendingUserCount();
$group_count = $auth->getGroupCount();

$sessions = FlipSession::getAllSessions();
$session_count = 0;
if($sessions !== false)
{
    $session_count = count($sessions);
}

$page->content['cards'] = array();
$card = array('icon' => 'fa-user', 'text' => $user_count.' Users', 'link' => 'users_current.php');
array_push($page->content['cards'], $card);
$card = array('icon' => 'fa-inbox', 'text' => $temp_user_count.' Pending Users', 'link' => 'users_pending.php', 'color' => 'green');
array_push($page->content['cards'], $card);
$card = array('icon' => 'fa-users', 'text' => $group_count.' Groups', 'link' => 'groups.php', 'color' => 'red');
array_push($page->content['cards'], $card);
$card = array('icon' => 'fa-cloud', 'text' => $session_count.' Sessions', 'link' => 'sessions.php', 'color' => 'yellow');
array_push($page->content['cards'], $card);

$page->printPage();
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
