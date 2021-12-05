<?php
    // Database credentials
    require_once "../credentials.php";
    
    // Attempt to connect to MySQL database
    $mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD);
    
    if($mysqli->connect_errno ) {
        printf("Connect failed: %s<br />", $mysqli->connect_error);
        exit();
    }
    
    $query = '';
    $sqlScript = file('db-create.sql');
    foreach ($sqlScript as $line)	{
        
        $startWith = substr(trim($line), 0 ,2);
        $endWith = substr(trim($line), -1 ,1);
        
        if (empty($line) || $startWith == '--' || $startWith == '/*' || $startWith == '//') {
            continue;
        }
            
        $query = $query . $line;
        if ($endWith == ';') {
            $mysqli->query($query) or die('<div class="error-response sql-import-response">Problem in executing the SQL query <b>' . $query. '</b></div>');
            $query= '';		
        }
    }

    $mysqli->close();

?>