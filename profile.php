<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once('class.ProfilesPage.php');
if(!\Flipside\FlipSession::isLoggedIn())
{
    header("Location: login.php");
    exit();
}
$page = new ProfilesPage('Burning Flipside Profiles');

$page->addWellKnownJS(JS_BOOTSTRAP_FH);
$page->addWellKnownCSS(CSS_BOOTSTRAP_FH);
$page->addWellKnownJS(JS_CRYPTO_MD5_JS);
$page->addWellKnownJS(JS_BOOTBOX);
$page->addWellKnownJS(JS_JCROP);
$page->addWellKnownCSS(CSS_JCROP);
$page->addJS('js/profile.js');

$page->addNotification('All the information on this page is optional. However, it will make the process of signing up for Ticket Requests, Theme Camp Registrations, Art Project Registrations, and Volunteer Signup faster and easier. If you have any concerns with providing this information we suggest your read our <a href="'.$page->wwwUrl.'/about/privacy" class="alert-link" target="_new">Privacy Policy</a> or contact the <a href="'.$page->wwwUrl.'/contact/" class="alert-link" target="_new">Technology Team</a> or the <a href="'.$page->wwwUrl.'/contact/" class="alert-link" target="_new">AAR Board of Directors</a> with your concerns.', $page::NOTIFICATION_INFO);

$page->body .= '
<div id="content">
    <fieldset>
    <legend>Main Profile:</legend>
    <form role="form" action="profile.php" method="post" name="profile" id="profile">
        <input type="hidden" name="uid" id="uid" />
        <div class="row">
            <label class="col-sm-2 control-label">Username:</label>
            <div class="col-sm-10">
                <label class="form-control" id="uid_label" disabled></label>
            </div>
            <div class="w-100"></div>';
if(isset($page->user->allMail))
{
    $mails = $page->user->allMail;
    $count = count($mails);
    $page->body.='
            <label for="allMail" class="col-sm-2 control-label">Registered Emails:</label>
            <div class="col-sm-10">';
    for($i = 0; $i < $count; $i++)
    {
        $page->body.='<div class="input-group">
                        <input type="text" class="form-control" value="'.$mails[$i].'" readonly>
                        <div class="input-group-append">
                          <button class="btn btn-outline-danger" type="button" onClick="removeEmail(\''.$mails[$i].'\')"><i class="fas fa-minus"></i></button>
                        </div>
                      </div>';
    }
    $page->body.='</div>';
}
$page->body.='
            <label for="mail" class="col-sm-2 control-label">Email:</label>
            <div class="col-sm-10">
                <input class="form-control" id="mail" name="mail" type="text" readonly/>
            </div>
            <div class="w-100"></div>
            <label for="givenName" class="col-sm-2 control-label">First Name:</label>
            <div class="col-sm-10">
                <input class="form-control" id="givenName" name="givenName" type="text"/>
            </div>
            <div class="w-100"></div>
            <label for="sn" class="col-sm-2 control-label">Last Name:</label>
            <div class="col-sm-10">
                <input class="form-control" id="sn" name="sn" type="text" required/>
            </div>
            <div class="w-100"></div>
            <label for="displayName" class="col-sm-2 control-label">Burner Name:</label>
            <div class="col-sm-10">
                <input class="form-control" id="displayName" name="displayName" type="text" />
            </div>
            <div class="w-100"></div>
            <label for="c" class="col-sm-2 control-label">Country:</label>
            <div class="col-sm-10">
                <select class="form-control bfh-countries" id="c" name="c" data-country="US"></select>
            </div>
            <div class="w-100"></div>
            <label for="mobile" class="col-sm-2 control-label">Cell Number:</label>
            <div class="col-sm-10">
                <input class="form-control bfh-phone" data-country="c" id="mobile" name="mobile" type="text"/>
            </div>
            <div class="w-100"></div>
            <label for="postalAddress" class="col-sm-2 control-label">Street Address:</label>
            <div class="col-sm-10">
                <textarea class="form-control" id="postalAddress" rows="2" name="postalAddress" type="text"></textarea>
            </div>
            <div class="w-100"></div>
            <label for="postalCode" class="col-sm-2 control-label">Postal/Zip Code:</label>
            <div class="col-sm-10">
                <input class="form-control" id="postalCode" name="postalCode" type="text"/>
            </div>
            <div class="w-100"></div>
            <label for="l" class="col-sm-2 control-label">City:</label>
            <div class="col-sm-10">
                <input class="form-control" id="l" name="l" type="text"/>
            </div>
            <div class="w-100"></div>
            <label for="st" class="col-sm-2 control-label">State:</label>
            <div class="col-sm-10">
                <select class="form-control bfh-states" data-country="c" id="st" name="st" type="text"></select>
            </div>
            <div class="w-100"></div>
            <label for="jpegPhotoBtn" class="col-sm-2 control-label">Profile Photo:</label>
            <div class="col-sm-4">
                <input class="form-control" id="jpegPhotoBtn" name="jpegPhotoBtn" type="file" accept="image/*"/>
            </div>
            <div class="col-sm-4">
                <div id="gravatar"></div>
            </div>
        </div>
        <div class="clearfix visible-md visible-lg"></div>
        <div class="col-sm-2">
            <button class="btn btn-primary" type="button" id="submit" onclick="update_profile()">Save Changes</button>
        </div>
    </form>
    </fieldset>
    <fieldset>
        <legend>Other Options:</legend>
        <button class="btn btn-danger" onclick="delete_user()">Delete My Account&hellip;</button>
        <button class="btn btn-secondary" onclick="reset_password()">Reset My Password&hellip;</button>
    </fieldset>
</div>';

$page->printPage();
/* vim: set tabstop=4 shiftwidth=4 expandtab:*/
