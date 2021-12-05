<?php

    // Initialize the session
    session_start();

    require_once "connection.php";

    $id = "";
    $count = 0;

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        // print_r($_POST);

        if(!isset($_POST['id']) || count(json_decode($_POST['id'])) < 1){
            die("{\"error\": \"id missing or invalid required\"}");
        }
        
        $id = json_decode($_POST['id']);
        $count = count($id);

        // Prepare an update statement
        $sql = sprintf(
            "DELETE FROM emails WHERE id IN (%s)",
            implode(',', array_fill(0, $count, '?'))
        );
        
        if($stmt = $mysqli->prepare($sql)){
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param(str_repeat('i', $count), ...$id);
            
            // Attempt to execute the prepared statement
            if($stmt->execute()){
                echo "{\"ok\": \"ok\"}";
            } else{
                echo "{\"error\": \"Oops! Something went wrong. Please try again later.\"}";
            }
        // Close statement
        $stmt->close();
        } else {
            // 
        }
        
        // Close connection
        $mysqli->close();

    } else{
        echo "{\"error\": \"not post method\"}";
    }

?>