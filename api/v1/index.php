<?php
require_once('class.FlipREST.php');
require_once('class.AuthProvider.php');

if($_SERVER['REQUEST_URI'][0] == '/' && $_SERVER['REQUEST_URI'][1] == '/')
{
    $_SERVER['REQUEST_URI'] = substr($_SERVER['REQUEST_URI'], 1);
}

require('login.php');
require('users.php');
require('pending_users.php');
require('sessions.php');
require('areas.php');

$app = new FlipREST();
$app->get('(/)', 'service_root');
$app->get('/\$metadata', 'metadata');
$app->post('/login', 'login');
$app->post('/logout', 'logout');
$app->group('/users', 'users');
$app->group('/groups', 'groups');
$app->group('/zip', 'postalcode');
$app->group('/pending_users', 'pending_users');
$app->group('/sessions', 'sessions');
$app->group('/areas', 'areas');
$app->get('/leads', 'leads');

function service_root()
{
    global $app;
    $res = array();
    $res['@odata.context'] = $app->request->getUrl().$app->request->getRootUri().'/$metadata';
    $res['value'] = array(
        array('name'=>'users', 'kind'=>'EntitySet', 'url'=>'users')
        //array('name'=>'groups', 'kind'=>'EntitySet', 'url'=>'groups'),
        //array('name'=>'pending_users', 'kind'=>'EntitySet', 'url'=>'pending_users'),
        //array('name'=>'sessions', 'kind'=>'EntitySet', 'url'=>'sessions'),
        //array('name'=>'areas', 'kind'=>'EntitySet', 'url'=>'areas'),
        //array('name'=>'leads', 'kind'=>'EntitySet', 'url'=>'leads')
    );
    echo json_encode($res);
}

function metadata()
{
    global $app;
    echo '
        <edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
            <edmx:DataServices>
                <Schema xmlns="http://docs.oasis-open.org/odata/ns/edm" Namespace="BurningFlipside.Profiles">
                    <EntityType Name="User">
                        <Key>
                            <PropertyRef Name="uid"/>
                        </Key>
                        <Property Name="uid" Type="Edm.String" Nullable="false">
                            <Annotation Term="Org.OData.Core.V1.Permissions">
                                <EnumMember>Org.OData.Core.V1.Permission/Read</EnumMember>
                            </Annotation>
                        </Property>
                        <Property Name="displayName" Type="Edm.String"/>
                        <Property Name="mail" Type="Edm.String" Nullable="false">
                        </Property>
                    </EntityType>
                    <EntitySet Name="Users" EntityType="BurningFlipside.Profiles.User">
                        <NavigationPropertyBinding Path="users" Target="Users"/>
                        <Annotation Term="Org.OData.Core.V1.ResourcePath" String="users"/>
                        <Annotation Term="Org.OData.Capabilities.V1.NavigationRestrictions">
                            <Record>
                                <PropertyValue Property="Navigability">
                                    <EnumMember>Org.OData.Capabilities.V1.NavigationType/None</EnumMember>
                                </PropertyValue>
                            </Record>
                        </Annotation>
                        <Annotation Term="Org.OData.Capabilities.V1.SearchRestrictions">
                            <Record>
                                <PropertyValue Property="Searchable" Bool="true"/>
                                <PropertyValue Property="UnsupportedExpressions">
                                    <EnumMember>Org.OData.Capabilities.V1.SearchExpressions/none</EnumMember>
                                </PropertyValue>
                            </Record>
                        </Annotation>
                    </EntitySet>
                    <Singleton Name="Me" Type="BurningFlipside.Profiles.User">
                        <Annotation Term="Org.OData.Core.V1.ResourcePath" String="me"/>
                    </Singleton>
                </Schema>
            </edmx:DataServices>
        </edmx:Edmx>
    ';
}

function list_groups()
{
    global $app;
    if(!$app->user)
    {
        $app->response->setStatus(401);
        return;
    }
    if($app->user->isInGroupNamed("LDAPAdmins"))
    {
        $auth = AuthProvider::getInstance();
        $users = $auth->getGroupsByFilter($app->odata->filter, $app->odata->select, $app->odata->top, $app->odata->skip, $app->odata->orderby);
        echo json_encode($users);
    }
    else
    {
        list_groups_for_user();
    }
}

function validate_post_code()
{
    global $app;
    $obj = $app->request->params();
    if($obj === null || count($obj) === 0)
    {
        $body = $app->request->getBody();
        $obj  = json_decode($body);
        $array = array('c' => $obj->c, 'postalCode'=>$obj->postalCode);
        $obj = $array;
    }
    if($obj['c'] == 'US')
    {
        if(preg_match("/^([0-9]{5})(-[0-9]{4})?$/i",$obj['postalCode']))
        {
            $contents = file_get_contents('http://ziptasticapi.com/'.$obj['postalCode']);
            $resp = json_decode($contents);
            if(isset($resp->error))
            {
                json_encode($resp->error);
            }
            else
            {
                json_encode(true);
            }
        }
        else
        {
            json_encode('Invalid Zip Code!');
        }
    }
    else
    {
        json_encode(true);
    }
}

function leads()
{
    global $app;
    if(!$app->user)
    {
        throw new Exception('Must be logged in', ACCESS_DENIED);
    }
    if(!$app->user->isInGroupNamed("Leads") && !$app->user->isInGroupNamed("CC"))
    {
        throw new Exception('Must be Lead', ACCESS_DENIED);
    }
    $params = $app->request->params();
    $auth = AuthProvider::getInstance();
    $leads     = array();
    if(!isset($params['type']))
    {
        $leadGroup = $auth->getGroupByName('Leads');
        $aarGroup  = $auth->getGroupByName('AAR');
        $afGroup   = $auth->getGroupByName('AFs');
        $ccGroup   = $auth->getGroupByName('CC');
        $leads     = array_merge($leads, $leadGroup->members(true));
        $leads     = array_merge($leads, $aarGroup->members(true));
        $leads     = array_merge($leads, $afGroup->members(true));
        $leads     = array_merge($leads, $ccGroup->members(true));
    }
    else
    {
        switch($params['type'])
        {
            case 'aar':
                $aarGroup  = $auth->getGroupByName('AAR');
                $leads     = array_merge($leads, $aarGroup->members(true));
                break;
            case 'af':
                $afGroup   = $auth->getGroupByName('AFs');
                $leads     = array_merge($leads, $afGroup->members(true));
                break;
            case 'cc':
                $ccGroup   = $auth->getGroupByName('CC');
                $leads     = array_merge($leads, $ccGroup->members(true));
                break;
            case 'lead':
                $leadGroup = $auth->getGroupByName('Leads');
                $leads     = array_merge($leads, $leadGroup->members(true));
                break;
            default:
                $filter    = new \Data\Filter('ou eq '.$params['type']);
                $leads     = $auth->getUsersByFilter($filter);
                break;
        }
    }
    echo json_encode($leads);
}

function groups()
{
    global $app;
    $app->get('', 'list_groups');
}

function postalcode()
{
    global $app;
    $app->post('', 'validate_post_code');
}

$app->run();
?>
