<?php
class AreasAPI extends ProfilesAdminDataAPI
{
    public function __construct()
    {
        parent::__construct('profiles', 'area', 'short_name');
    }

    public function setup($app)
    {
        parent::setup($app);
        $app->get('/{name}/leads', array($this, 'getLeads'));
    }

    protected function canCreate($request)
    {
        $this->validateIsAdmin($request);
        return true;
    }

    protected function canUpdate($request, $entity)
    {
        $this->validateIsAdmin($request);
        return true;
    }

    public function getLeads($request, $response, $args)
    {
        $this->validateLoggedIn($request);
        $dataTable = \Flipside\DataSetFactory::getDataTableByNames('profiles', 'position');
        $odata = $request->getAttribute('odata', new \Flipside\ODataParams(array()));
        if($args['name'] === '*')
        {
            $leads = $dataTable->read($odata->filter, $odata->select, $odata->top,
                                  $odata->skip, $odata->orderby);
        }
        else
        {
            $leads = $dataTable->read(new \Flipside\Data\Filter("area eq '".$args['name']."'"), $odata->select, $odata->top,
                                  $odata->skip, $odata->orderby);
        }
        if(empty($leads))
        {
            return $response->withStatus(404);
        }
        return $response->withJson($leads);
    }
}
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
