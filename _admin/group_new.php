<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once('class.ProfilesAdminPage.php');
$page = new ProfilesAdminPage('Burning Flipside Profiles - Admin');

$page->addWellKnownJS(JS_DATATABLE);
$page->addWellKnownCSS(CSS_DATATABLE);
$page->addJS('//unpkg.com/tabulator-tables@6.2.1/dist/js/tabulator.min.js');
$page->addCSS('//unpkg.com/tabulator-tables@6.2.1/dist/css/tabulator.min.css');

$page->body .= '
<div id="content">
    <form method="post" id="form">
        <fieldset id="group_data">
            <div class="form-group">
                <label class="col-sm-2 control-label">Group Name:</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" name="gid" id="gid_edit" required/>
               </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Description:</label>
                <div class="col-sm-10">
                    <textarea class="form-control" name="description" id="description"></textarea>
               </div>
            </div>
        </fieldset>
        <div class="clearfix visible-sm visible-md visible-lg"></div>
        <fieldset>
            <legend>Members</legend>
            <table id="members" class="table">
                <thead>
                    <th></th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Name</th>
                </thead>
                <tbody>
                </tbody>
            </table>
        </fieldset>
        <div class="clearfix visible-sm visible-md visible-lg"></div>
        <fieldset>
            <legend>Non-Members</legend>
            <table id="non-members" class="table">
                <thead>
                    <th></th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Name</th>
                </thead>
                <tbody>
                </tbody>
            </table>
        </fieldset>
        <input type="submit" class="form-control" value="Submit Changes" id="submit"/>
    </fieldset>
    </form>
</div>';

$page->printPage();
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
