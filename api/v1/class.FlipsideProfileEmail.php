<?php
require_once(__DIR__ . '/../../Autoload.php');

class FlipsideProfileEmail extends \Flipside\Email\Email
{
    protected $user;

    public function __construct($user)
    {
        parent::__construct();
        $this->user = $user;
    }

    public function getFromAddress()
    {
        return 'Burning Flipside Profile System <webmaster@burningflipside.com>';
    }
}
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
