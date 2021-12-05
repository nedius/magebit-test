<?php

    // Initialize the session
    session_start();

    require_once "connection.php";

    $email = $tos = "";
    $email_err = $tos_err = "";

    if( $_SERVER["REQUEST_METHOD"] == "POST"){
        // print_r($_POST);

        if(!isset($_POST['email'])){
            die("{\"error\": \"Email address is required\"}");
        }
        if(!isset($_POST['tos'])){
            die("{\"error\": \"You must accept the terms and conditions\"}");
        }

        if(empty(trim($_POST["email"]))){
            $email_err = "Email address is required";
        }else if(strlen(trim($_POST["email"])) > 320 ){
            $email_err = "Please provide a valid e-mail address";
        }else if(!preg_match("/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/",trim($_POST["email"]))){
            $email_err = "Please provide a valid e-mail address";
        }else if(str_ends_with(trim($_POST["email"]), ".co") ){
            $email_err = "We are not accepting subscriptions from Colombia emails";
        }else if(!filter_var($_POST["tos"], FILTER_VALIDATE_BOOLEAN)){
            $tos_err = "You must accept the terms and conditions";
        }else {
            $email = $_POST["email"];
        }

        if(empty($email_err) && empty($tos_err)){
            // Prepare an update statement
            $sql = "INSERT INTO emails (`email`) VALUES (?)";
            
            if($stmt = $mysqli->prepare($sql)){
                // Bind variables to the prepared statement as parameters
                $stmt->bind_param("s", $param_email);   
                
                // Set parameters
                $param_email = $email;
                
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
        }else{
            if(!empty($email_err)){
                echo "{\"error\": \"" . $email_err . "\"}";
            }
            if(!empty($tos_err)){
                echo "{\"error\": \"" . $tos_err . "\"}";
            }
        }
        
        // Close connection
        $mysqli->close();

    } else{
        echo "{\"error\": \"not post method\"}";
    }

?>