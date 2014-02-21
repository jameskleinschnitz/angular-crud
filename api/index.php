<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../vendor/autoload.php';

$app = new \Slim\Slim();

$app->get('/products', 'getProducts');
$app->get('/product/:id', 'getProduct');
$app->post('/add_product', 'addProduct');
$app->put('/products/:id', 'updateProduct');
$app->delete('/products/:id', 'deleteProduct');


$app->run();

function getProducts() {
	$sql = "select * FROM products ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$products = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($products);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getProduct($id) {
	$sql = "select * FROM products WHERE id=".$id." ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$products = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($products);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addProduct() {
	$request = \Slim\Slim::getInstance()->request();
	$product = json_decode($request->getBody());
	$sql = "INSERT INTO products (model, brand, type, description, features, image, video) VALUES (:model, :brand, :type, :description, :features, :image, :video)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("model", $product->model);
		$stmt->bindParam("brand", $product->brand);
		$stmt->bindParam("type", $product->type);
		$stmt->bindParam("description", $product->description);
		$stmt->bindParam("features", $product->features);
		$stmt->bindParam("image", $product->image);
		$stmt->bindParam("video", $product->video);
		$stmt->execute();
		$product->id = $db->lastInsertId();
		$db = null;
		echo json_encode($product); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateProduct($id) {
	$request = \Slim\Slim::getInstance()->request();
	$product = json_decode($request->getBody());
	$sql = "UPDATE products SET model=:model, brand=:brand, type=:type, description=:description, features=:features, image=:image, video=:video WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("model", $product->model);
		$stmt->bindParam("brand", $product->brand);
		$stmt->bindParam("type", $product->type);
		$stmt->bindParam("description", $product->description);
		$stmt->bindParam("features", $product->features);
		$stmt->bindParam("image", $product->image);
		$stmt->bindParam("video", $product->video);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($product); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteProduct($id) {
	$sql = "DELETE FROM products WHERE id=".$id;
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$products = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
// 		echo json_encode($products);
		echo '{"success":{"text":product deleted}}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
	$dbhost="localhost";
	$dbuser="root";
	$dbpass="ROOT";
	$dbname="angular_crud";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>