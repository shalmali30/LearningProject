<?php
// Database connection
$serverName = "localhost";
$connectionOptions = array(
    "Database" => "your_database_name",
    "Uid" => "your_username",
    "PWD" => "your_password"
);
$conn = sqlsrv_connect($serverName, $connectionOptions);
if ($conn === false) {
    die(print_r(sqlsrv_errors(), true));
}

// Form data
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];

// SQL query to insert data
$sql = "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)";
$params = array($name, $email, $phone);
$stmt = sqlsrv_query($conn, $sql, $params);
if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
} else {
    echo "New record created successfully";
}

sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);
?>
