<?php
class GroupsAPI extends ProfilesAdminAPI
{
    public function setup($app)
    {
        $app->get('[/]', array($this, 'getGroups'));
        $app->get('/{name}[/]', array($this, 'getGroup'));
        $app->patch('/{name}[/]', array($this, 'updateGroup'));
        $app->get('/{name}/non-members', array($this, 'getNonMembers'));
    }

    public function getGroups($request, $response)
    {
        if($this->validateIsAdmin($request, true) === false)
        {
            return $response->withStatus(301)->withHeader('Location', '../users/me/groups');
        }
        $auth = \Flipside\AuthProvider::getInstance();
        $odata = $request->getAttribute('odata', new \Flipside\ODataParams(array()));
        $groups = $auth->getGroupsByFilter($odata->filter, $odata->select, $odata->top, $odata->skip, 
                                           $odata->orderby);
        return $response->withJson($groups);
    }

    private function expandGroupMembers($group, $odata, $directOnly)
    {
        if($odata->expand !== false && in_array('member', $odata->expand))
        {
            $ret = array();
            $ret['cn'] = $group->getGroupName();
            $ret['description'] = $group->getDescription();
            $ret['member'] = $group->members(true, ($directOnly !== true));
            return json_decode(json_encode($ret), true);
        }
        else if($directOnly)
        {
            $ret = array();
            $ret['cn'] = $group->getGroupName();
            $ret['description'] = $group->getDescription();
            $ret['member'] = $group->getMemberUids(false);
            return json_decode(json_encode($ret), true);
        }
        return json_decode(json_encode($group), true);
    }

    private function getGroupForUserByName($name)
    {
        $groups = $this->user->getGroups();
        $count = count($groups);
        for($i = 0; $i < $count; $i++)
        {
            if(strcasecmp($groups[$i]->getGroupName(), $name) === 0)
            {
                return $groups[$i];
            }
        }
        return false;
    }

    public function getGroup($request, $response, $args)
    {
        $odata = $request->getAttribute('odata', new \Flipside\ODataParams(array()));
        $expand = false;
        $user = $request->getAttribute('user');
        if($user === false)
        {
            $local = $request->getServerParam('SERVER_ADDR');
            $remote = $request->getServerParam('REMOTE_ADDR');
            if($local === $remote)
            {
                $auth = \Flipside\AuthProvider::getInstance();
                $group = $auth->getGroupByName($args['name']);
                $expand = true;
            }
            else
            {
                return $response->withStatus(401);
            }
        }
        else if($this->validateIsAdmin($request, true) === false)
        {
            $group = $this->getGroupForUserByName($args['name']);
        }
        else
        {
            $auth = \Flipside\AuthProvider::getInstance();
            $group = $auth->getGroupByName($args['name']);
            $expand = true;
        }
        if(empty($group))
        {
            return $response->withStatus(404);
        }
        $params = $request->getQueryParams();
        $directOnly = false;
        if(isset($params['directOnly']) && $params['directOnly'] === 'true')
        {
            $directOnly = true;
        }
        if($expand)
        {
            $group = $this->expandGroupMembers($group, $odata, $directOnly);
        }
        return $response->withJson($group);
    }

    protected function serializeArray(&$res, $array, $keys, $type=false)
    {
        $count = count($array);
        for($i = 0; $i < $count; $i++)
        {
            $tmp = json_decode(json_encode($array[$i]), true);
            if($type === false)
            {
                $tmp['type'] = $this->getTypeOfEntity($array[$i]);
            }
            else
            {
                $tmp['type'] = $type;
            }
            if($keys !== false)
            {
                $tmp = array_intersect_key($tmp, $keys);
            }
            $res[] = $tmp;
        }
    }

    public function getAllGroupsAndUsers($keys)
    {
        $auth = \Flipside\AuthProvider::getInstance();
        $groups = $auth->getGroupsByFilter(false);
        $res = array();
        $this->serializeArray($res, $groups, $keys, 'Group');
        $users  = $auth->getUsersByFilter(false);
        $this->serializeArray($res, $users, $keys, 'User');
        return $res;
    }

    public function getTypeOfEntity($entity)
    {
        if(is_subclass_of($entity, 'Auth\Group'))
        {
            return 'Group';
        }
        else
        {
            return 'User';
        }
    }

    public function getNonMemberEntities($nonMembers, $keys)
    {
        if($keys !== false)
        {
            $res = array();
            $this->serializeArray($res, $nonMembers, $keys);
            return $res;
        }
        return $nonMembers;
    }

    public function getNonMembers($request, $response, $args)
    {
        $this->validateIsAdmin($request);
        $odata = $request->getAttribute('odata', new \Flipside\ODataParams(array()));
        $keys = false;
        if($odata->select !== false)
        {
            $keys = array_flip($odata->select);
        }
        $auth = \Flipside\AuthProvider::getInstance();
        if($args['name'] === 'none')
        {
            $res = $this->getAllGroupsAndUsers($keys);
            return $response->withJson($res);
        }
        $group = $auth->getGroupByName($args['name']);
        if($group === false)
        {
            return $response->withStatus(404);
        }
        $res = $group->getNonMembers($odata->select);
        $res = $this->getNonMemberEntities($res, $keys);
        return $response->withJson($res);
    }

    public function updateGroup($request, $response, $args)
    {
        $this->validateIsAdmin($request);
        $auth = \Flipside\AuthProvider::getInstance();
        $group = $auth->getGroupByName($args['name']);
        if($group === false)
        {
            return $response->withStatus(404);
        }
        $obj = $request->getParsedBody();
        $ret = $group->editGroup($obj);
        return $response->withJson($ret);
    }
}
/* vim: set tabstop=4 shiftwidth=4 expandtab: */
