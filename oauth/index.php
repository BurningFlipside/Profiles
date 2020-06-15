<?php
require_once('vendor/autoload.php');
require_once('../Autoload.php');

if($_SERVER['REQUEST_URI'][0] == '/' && $_SERVER['REQUEST_URI'][1] == '/')
{
    $_SERVER['REQUEST_URI'] = substr($_SERVER['REQUEST_URI'], 1);
}

$app = new \Slim\App();
$app->get('/callbacks/{host}', 'oauthCallback');

function oauthCallback($request, $response, $args)
{
    $host = $args['host'];
    $auth = \Flipside\AuthProvider::getInstance();
    $provider = $auth->getSuplementalProviderByHost($host);
    if($provider === false)
    {
        return $response->withStatus(404);
    }
    $res = $provider->authenticate($request->getQueryParams(), $currentUser);
    switch($res)
    {
        case \Flipside\Auth\Authenticator::SUCCESS:
            $response = $response->withHeader('Location', '/');
            break;
        default:
        case \Flipside\Auth\Authenticator::LOGIN_FAILED:
            $response = $response->withHeader('Location', '/login.php?failed=1');
            break;
        case \Flipside\Auth\Authenticator::ALREADY_PRESENT:
            $response = $response->withHeader('Location', '/user_exists.php?src='.$host.'&uid='.$currentUser->getUID());
            break;
    }
    return $response->withStatus(302);
}

$app->run();
?>
