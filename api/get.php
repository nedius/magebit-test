<?php

    // Initialize the session
    session_start();

    require_once "connection.php";
    
    if(null == $limit = filter_input(INPUT_GET, 'limit', FILTER_VALIDATE_INT)){
        $limit = 10;
    }
    if(null == $offset = filter_input(INPUT_GET, 'offset', FILTER_VALIDATE_INT)){
        $offset = 0;
    }

    if($limit < 0){
        if($limit == -1){
            $limit = PHP_INT_MAX;
        } else{
            $limit = 10;
        }
    } 
    if($offset < 0) $limit = 0;

    $sql = "SELECT *
            FROM `emails`
            LIMIT ?, ?";
        
    if(empty($from_err)){
        if($stmt = $mysqli->prepare($sql)){
            $stmt->bind_param("ii", $param_offset, $param_limit);
            
            $param_offset = $offset;
            $param_limit = $limit;
            
            if($stmt->execute()){
                $stmt->store_result();
                    
                if ($stmt->num_rows > 0) {
                    $arr = [];
                    $inc = 0;

                    $stmt->bind_result($id, $email, $timestamp);

                    while ($row = $stmt->fetch()) {
                        $jsonArrayObject = (array('id' => $id, 'email' => $email, 'timestamp' => $timestamp));
                        $arr[$inc] = $jsonArrayObject;
                        $inc++;
                    }
                    $json_array = json_encode($arr);
                    echo $json_array;
                }
                else{
                    echo "{}";
                }
            $stmt->free_result();
            } else{
                echo "{error: \"Oops! Something went wrong. Please try again later. | " . $stmt->error . "\"}";
            }
        }
        // Close statement
        $stmt->close();
    }

    // Close connection
    $mysqli->close();


?>