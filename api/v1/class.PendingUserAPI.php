<?php
class PendingUserAPI extends ProfilesAdminAPI
{
    public function setup($app)
    {
        $app->get('[/]', array($this, 'listPendingUsers'));
        $app->get('/{hash}[/]', array($this, 'showPendingUser'));
        $app->delete('/{hash}[/]', array($this, 'deletePendingUser'));
        $app->map(['GET', 'POST'], '/{hash}/Actions/activate[/]', array($this, 'activatePendingUser'));
    }

    public function listPendingUsers($request, $response)
    {
        $this->validateIsAdmin($request);
        $odata = $request->getAttribute('odata', new \Flipside\ODataParams(array()));
        $auth = \Flipside\AuthProvider::getInstance();
        $users = $auth->getPendingUsersByFilter($odata->filter, $odata->select, $odata->top, $odata->skip, 
                                                $odata->orderby);
        return $response->withJson($users);
    }

    public function showPendingUser($request, $response, $args)
    {
        $this->validateIsAdmin($request);
        $user = \Flipside\AuthProvider::getInstance()->getPendingUsersByFilter(new \Flipside\Data\Filter("hash eq '".$args['hash']."'"));
        if($user === false)
        {
            return $response->withStatus(404);
        }
        if(!is_object($user) && isset($user[0]))
        {
            $user = $user[0];
        }
        return $response->withJson($user);
    }

    public function deletePendingUser($request, $response, $args)
    {
        $this->validateIsAdmin($request);
        $auth = \Flipside\AuthProvider::getInstance();
        $res = $auth->deletePendingUsersByFilter(new \Flipside\Data\Filter("hash eq '".$args['hash']."'"));
        return $response->withJson($res);
    }

    public function activatePendingUser($request, $response, $args)
    {
        $hash = $args['hash'];
        $user = $request->getAttribute('user');
        if($user === false)
        {
            throw new Exception('Must be logged in', \Flipside\Http\Rest\ACCESS_DENIED);
        }
        $auth = \Flipside\AuthProvider::getInstance();
        $user = $auth->getPendingUsersByFilter(new \Flipside\Data\Filter("hash eq '$hash'"));
        if($user === false || !isset($user[0]))
        {
            return $response->withStatus(404);
        }
        $res = $auth->activatePendingUser($user[0]);
        if($request->isGet())
        {
            $uri = '../../activate_error.php';
            if($res)
            {
                $uri = '../../';
            }
            return $response->withStatus(302)->withHeader('Location', $uri);
        }
        else
        {
            return $response->withJson($res);
        }
    }
}
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
