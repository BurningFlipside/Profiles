<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require(__DIR__ . '/../../Autoload.php');
require('class.ProfilesAdminAPI.php');
require('class.ProfilesAdminDataAPI.php');
require('class.AreasAPI.php');
require('class.GroupsAPI.php');
require('class.LeadsAPI.php');
require('class.PendingUserAPI.php');
require('class.SessionsAPI.php');
require('class.UsersAPI.php');
require('class.ProfilesAPI.php');

$site = new \Flipside\Http\WebSite();

$site->registerAPI('/areas', new AreasAPI());
$site->registerAPI('/groups', new GroupsAPI());
$site->registerAPI('/leads', new LeadsAPI());
$site->registerAPI('/pending_users', new PendingUserAPI());
$site->registerAPI('/users', new UsersAPI());
$site->registerAPI('/sessions', new SessionsAPI());
$site->registerAPI('', new ProfilesAPI());
$site->run();
