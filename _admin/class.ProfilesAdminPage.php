<?php
require_once('Autoload.php');
class ProfilesAdminPage extends \Http\FlipAdminPage
{
    public function __construct($title)
    {
        parent::__construct($title, 'LDAPAdmins');
        $this->addJS('js/admin.js');

        $users_menu = array(
            'Current' => 'users_current.php',
            'Pending' => 'users_pending.php'
        );
        $pos_menu = array(
            'Areas' => 'areas.php',
            'Leads' => 'leads.php'
        );

        $this->content['loginUrl'] = '../api/v1/login';
        $this->content['header']['sidebar'] = array();
        $this->content['header']['sidebar']['Dashboard'] = array('icon' => 'fa-tachometer-alt', 'url' => 'index.php');
        $this->content['header']['sidebar']['Users'] = array('icon' => 'fa-user', 'menu' => $users_menu);
        $this->content['header']['sidebar']['Groups'] = array('icon' => 'fa-users', 'url' => 'groups.php');
        $this->content['header']['sidebar']['Positions'] = array('icon' => 'fa-briefcase', 'menu' => $pos_menu);
        $this->content['header']['sidebar']['Sessions'] = array('icon' => 'fa-cloud', 'url' => 'sessions.php');
    }
}
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
