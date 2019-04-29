<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once('class.ProfilesAdminPage.php');
$page = new ProfilesAdminPage('Burning Flipside Profiles - Admin');
$page->addWellKnownJS(JS_DATATABLE, false);
$page->addWellKnownCSS(CSS_DATATABLE);

$page->body .= '
<div class="col-lg-12">
    <h1 class="page-header">Groups</h1>
</div>
<div>
  <div class="row">
    <select class="form-control col-sm-2" name="group_action" id="group_action">
      <option value="none">Action...</option>
      <option value="del">Delete Group</option>
      <option value="new">Add New Group...</option>
    </select>
    <button class="btn btn-primary col-sm-1" type="button" onclick="groupExecute()">Apply</button>
  </div>
  <table id="group_table">
    <thead>
      <th>Group Name</th>
      <th>Description</th>
    </thead>
    <tbody></tbody>
  </table>
</div>';

$page->printPage();
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
