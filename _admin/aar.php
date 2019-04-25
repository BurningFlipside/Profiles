<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once('class.ProfilesAdminPage.php');
$page = new ProfilesAdminPage('Burning Flipside Profiles - Admin');

$page->addWellKnownJS(JS_BOOTSTRAP_FH);

$page->body .= '
<div class="container">
  <div class="row">
    <table>
    <tbody>
      <tr><td></td><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th><th>Saturday</th><th>Sunday</th><th>Monday</th><th>Tuesday</th></tr>
      <tr>
        <th>0200</th>
        <td/>
        <td/>
        <td/>
        <td/>
        <td/>
        <td/>
        <td><select id="actual_13" class="actual" data-length="5" data-weight="0.5"></select><br/><select id="backup_13" class="backup"></td>
        <td/>
      </tr>
      <tr>
        <th rowspan=3>0700</th>
        <td><select id="actual_1" class="actual"></select></td>
        <td><select id="actual_3" class="actual"></select></td>
        <td><select id="actual_5" class="actual"></select></td>
        <td><select id="actual_7" class="actual"></select></td>
        <td><select id="actual_9" class="actual"></select></td>
        <td><select id="actual_11" class="actual" data-weight="0.5" data-length="6"></select></td>
        <td><select id="actual_14" class="actual"></select></td>
        <td><select id="actual_16" class="actual"></select></td>
      </tr>
      <tr>
        <td/>
        <td/>
        <td><select id="backup_5" class="backup"></select></td>
        <td><select id="backup_7" class="backup"></select></td>
        <td><select id="backup_9" class="backup"></select></td>
        <td><select id="backup_11" class="backup"></select></td>
        <td><select id="backup_14" class="backup"></select></td>
        <td><select id="backup_16" class="backup"></select></td>
      </tr>
      <tr>
        <td/>
        <td/>
        <td><select id="fuck_5" class="fuck"></select></td>
        <td><select id="fuck_7" class="fuck"></select></td>
        <td><select id="fuck_9" class="fuck"></select></td>
      </tr>
      <tr>
        <th>1300</th>
        <td/>
        <td/>
        <td/>
        <td/>
        <td/>
        <td><select id="actual_12" class="actual" data-length="4" data-weight="0.5" data-gap="12"></select><br/><select id="backup_12" class="backup"></select></td>
        <td/>
      </tr>
      <tr>
        <th rowspan=3>1900</th>
        <td><select id="actual_2" class="actual"></select></td>
        <td><select id="actual_4" class="actual"></select></td>
        <td><select id="actual_6" class="actual"></select></td>
        <td><select id="actual_8" class="actual"></select></td>
        <td><select id="actual_10" class="actual"></select></td>
        <td rowspan=3><b>All Hands</b></td>
        <td><select id="actual_15" class="actual"></select></td>
      </tr>
      <tr>
        <td/>
        <td><select id="backup_4" class="backup"></select></td>
        <td><select id="backup_6" class="backup"></select></td>
        <td><select id="backup_8" class="backup"></select></td>
        <td><select id="backup_10" class="backup"></select></td>
        <td><select id="backup_15" class="backup"></select></td>
      </tr>
      <tr>
        <td/>
        <td/>
        <td><select id="fuck_6" class="fuck"></select><br/><select id="fuck_6a" class="fuck"></select></td>
        <td><select id="fuck_8" class="fuck"></select><br/><select id="fuck_8a" class="fuck"></select></td>
        <td><select id="fuck_10" class="fuck"></select><br/><select id="fuck_10a" class="fuck"></select></td>
      </tr>
    </tbody>
    </table>
  </div>
  <div class="row">
    <table id="summary">
      <tr><th>Name</th><th>Actual Shifts</th><th>Backup Shifts</th><th>Hours Between Actual Shifts</th><th>Hours Between Backup Shifts</th><th>Hours Between Shifts</th></tr>
    </table>
  </div>
</div>
';

$page->printPage();
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
