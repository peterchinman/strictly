<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the text and meter from the POST request
    $text = escapeshellarg($_POST["text"]);
    $meter = escapeshellarg($_POST["meter"]);

    // Run the C++ program
    $command = "./meter-checker $text $meter";
    $output = [];
    $return_var = 0;

    // Execute the command
    exec($command, $output, $return_var);

    // Return the result to the frontend
    if ($return_var === 0) {
        echo "Meter matches!";
    } else {
        echo "Meter does not match.";
    }
} else {
    echo "Invalid request.";
}
