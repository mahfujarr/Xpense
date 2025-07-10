<?php
    $SERVER_NAME = "localhost";
    $USERNAME = "root";
    $PASSWORD = "";
    $DB_NAME = "xpense_db";

    $conn = new mysqli($SERVER_NAME, $USERNAME, $PASSWORD, $DB_NAME);
    if ($conn->connect_error) {
        die("Database Connection failed : ". $conn->connect_error);
    }
?>