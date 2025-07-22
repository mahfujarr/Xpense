<?php
require __DIR__ . "/config.php";

// Database connection
$conn = new mysqli(SERVER_NAME, USERNAME, PASSWORD, DB_NAME);
if ($conn->connect_error) {
    die("Database Connection failed : " . $conn->connect_error);
}
