<?php
    // Database credentials
    require_once "../credentials.php";
    
    // Attempt to connect to MySQL database
    $mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD);
    
    if($mysqli->connect_errno ) {
        printf("Connect failed: %s<br />", $mysqli->connect_error);
        exit();
    }
    
    if ($mysqli->query("DROP DATABASE `magebit-test`")) {
        printf("Database deleted successfully.<br />");
    }
    if ($mysqli->errno) {
        printf("Could not create database: %s<br />", $mysqli->error);
    }

    $mysqli->close();

?>