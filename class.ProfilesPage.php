<?php
require_once('Autoload.php');
class ProfilesPage extends \Http\WebPage
{
    public $profiles_root;

    public function __construct($title)
    {
        parent::__construct($title, true);
        $root = $_SERVER['DOCUMENT_ROOT'];
        $script_dir = dirname(__FILE__);
        if(strstr($script_dir, $root) === false)
        {
            $this->profiles_root = dirname($_SERVER['SCRIPT_NAME']);
        }
        else
        {
            $this->profiles_root = substr($script_dir, strlen($root));
        }
        $this->content['root'] = $this->profiles_root;
        $this->addTemplateDir('./templates', 'Profiles');
        $this->setTemplateName('@Profiles/profile-main.html');
    }

    public function addLinks()
    {
        if($this->user !== false && $this->user !== null)
        {
            if($this->user->isInGroupNamed('LDAPAdmins') || $this->user->isInGroupNamed('AFs'))
            {
                $this->addLink('Admin', $this->profiles_root.'/_admin/index.php');
            }
            if(($this->user->isInGroupNamed('Leads') || $this->user->isInGroupNamed('CC')) || $this->user->isInGroupNamed('AFs'))
            {
                $this->addLink('Leads', $this->profiles_root.'/lead/index.php');
            }
            $this->addLink('My Profile', $this->profiles_root.'/profile.php');
        }
    }
}
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
