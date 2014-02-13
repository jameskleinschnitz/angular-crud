<?php 
if(!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']) || $_SERVER['PHP_AUTH_USER'] !== 'demo' || $_SERVER['PHP_AUTH_PW'] !== 'demo') {
 
    header("WWW-Authenticate: Basic realm=\"Secure Page\"");
    header("HTTP\ 1.0 401 Unauthorized");
    echo 'No soup for you';
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <title>AngularJs SPA CRUD</title>
  <link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
<body ng-app="SPApp">

<div class="container">
  <div ng-view></div>
</div>

<script type="text/javascript" src="bower_components/jquery/jquery.min.js"></script>
<script type="text/javascript" src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
<script type="text/javascript" src="bower_components/angular-route/angular-route.min.js"></script>
<script type="text/javascript" src="bower_components/angular-bootstrap/ui-bootstrap.min.js"></script>
<script type="text/javascript" src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
<script type="text/javascript" src ="assets/js/spa.js"></script>
</body>
</html>