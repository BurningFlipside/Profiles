<?php
class ProfilesAdminDataAPI extends Flipside\Http\Rest\DataTableAPI
{
    protected function validateIsAdmin($request)
    {
        $user = $request->getAttribute('user');
        if($user === false)
        {
            throw new Exception('Must be logged in', \Flipside\Http\Rest\ACCESS_DENIED);
        }
        if(!$user->isInGroupNamed('LDAPAdmins'))
        {
            throw new Exception('Must be Admin', \Flipside\Http\Rest\ACCESS_DENIED);
        }
    }
}
