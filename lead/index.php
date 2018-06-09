<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once('class.ProfilesLeadPage.php');
$page = new ProfilesLeadPage('Burning Flipside Profiles - Lead');
$page->setTemplateName('admin-dashboard.html');
$auth = AuthProvider::getInstance();
$leadGroup = $auth->getGroupByName('Leads');
$aarGroup  = $auth->getGroupByName('AAR');
$afGroup   = $auth->getGroupByName('AFs');
$ccGroup   = $auth->getGroupByName('CC');

$lead_count = $leadGroup->member_count();
$aar_count  = $aarGroup->member_count();
$af_count   = $afGroup->member_count();
$cc_count   = $ccGroup->member_count();

$page->content['cards'] = array();
$card = array('icon' => 'fa-user', 'text' => $lead_count.' Leads', 'link' => 'directory.php?filter=lead');
array_push($page->content['cards'], $card);
$card = array('icon' => 'fa-bullhorn', 'text' => $af_count.' AFs', 'link' => 'directory.php?filter=af', 'color' => 'green');
array_push($page->content['cards'], $card);
$card = array('icon' => 'fa-cc', 'text' => $cc_count.' CC Members', 'link' => 'directory.php?filter=cc', 'color' => 'yellow');
array_push($page->content['cards'], $card);
$card = array('icon' => 'fa-fire', 'text' => $aar_count.' Board Members', 'link' => 'directory.php?filter=aar', 'color' => 'red');
array_push($page->content['cards'], $card);

$page->printPage();
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
