<?php
require_once('class.ProfilesPage.php');
require_once('class.FlipSession.php');
class ProfilesLeadPage extends \Http\FlipAdminPage
{
    private $is_lead;

    public function __construct($title)
    {
        parent::__construct($title);
        if($this->user == false)
        {
            $this->is_lead = false;
        }
        else
        {
            $this->is_lead = $this->user->isInGroupNamed('Leads');
            if(!$this->is_lead)
            {
                $this->is_lead = $this->user->isInGroupNamed('CC');
            }
        }
        if($this->is_lead)
        {
            $this->is_admin = $this->is_lead;
        }
        $this->add_leads_css();
        $this->addWellKnownJS(JS_DATATABLE, false);
        $this->addWellKnownJS(JQUERY_VALIDATE);
        $this->addWellKnownJS(JS_METISMENU);
        $this->addJS('../_admin/js/admin.js');
        $this->addWellKnownJS(JS_LOGIN);

        $dirMenu = array(
                'All' => 'directory.php',
                'AAR' => 'directory.php?filter=aar',
                'AFs' => 'directory.php?filter=af',
                'CC'  => 'directory.php?filter=cc',
                '360/24/7 Department' => 'directory.php?filter=360',
                'Art' => 'directory.php?filter=Art',
                'City Planning' => 'directory.php?filter=CityPlanning',
                'Communications' => 'directory.php?filter=Comm',
                'Genesis' => 'directory.php?filter=Genesis',
                'Safety' => 'directory.php?filter=Safety',
                'Site-Ops' => 'directory.php?filter=Ops',
                'Site Prep' => 'directory.php?filter=siteprep',
                'Site Sign-Off' => 'directory.php?filter=sign-off',
                'Volunteer Coordinator' => 'directory.php?filter=vc'
                );

        $this->content['header']['sidebar'] = array();
        $this->content['header']['sidebar']['Dashboard'] = array('icon' => 'fa-dashboard', 'url' => 'index.php');
        $this->content['header']['sidebar']['Directory'] = array('icon' => 'fa-th-list', 'menu' => $dirMenu);
    }

    protected function add_leads_css()
    {
        $this->addWellKnownCSS(CSS_DATATABLE);
        $this->addCSS('../css/profiles.css');
        $this->addCSS('css/lead.css');
    }

    public function isAdmin()
    {
        return $this->is_lead;
    }
}
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
