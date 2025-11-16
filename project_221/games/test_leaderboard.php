<?php
// test_leaderboard.php

// Simulate a POST request to update_leaderboard.php
$url = 'http://localhost/SkyCast1/project_221/games/update_leaderboard.php';
$data = ['name' => 'test_player', 'score' => 100];

$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
    ],
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === false) {
    echo "Error: Could not connect to the server or the script failed.\n";
    exit(1);
}

// Decode the response from the server
$response = json_decode($result, true);

if ($response === null) {
    echo "Error: Invalid JSON response from the server.\n";
    echo "Response: " . $result . "\n";
    exit(1);
}

// Check if the leaderboard was updated successfully
if (isset($response['status']) && $response['status'] === 'ok') {
    echo "Leaderboard updated successfully.\n";
} else {
    echo "Error: Failed to update the leaderboard.\n";
    echo "Response: " . json_encode($response, JSON_PRETTY_PRINT) . "\n";
    exit(1);
}

// Verify the contents of leadeboard.json
$leaderboard_content = file_get_contents('/opt/lampp/htdocs/SkyCast1/project_221/games/leaderboard.json');
$leaderboard_data = json_decode($leaderboard_content, true);

if ($leaderboard_data === null) {
    echo "Error: Could not read or decode leaderboard.json.\n";
    exit(1);
}

if (isset($leaderboard_data['test_player']) && $leaderboard_data['test_player'] === 100) {
    echo "Test passed: 'test_player' with score 100 is present in leaderboard.json.\n";
    // Clean up the test data
    unset($leaderboard_data['test_player']);
    file_put_contents('/opt/lampp/htdocs/SkyCast1/project_221/games/leaderboard.json', json_encode($leaderboard_data, JSON_PRETTY_PRINT));
    exit(0);
} else {
    echo "Test failed: 'test_player' not found or score is incorrect in leaderboard.json.\n";
    echo "Leaderboard content: " . json_encode($leaderboard_data, JSON_PRETTY_PRINT) . "\n";
    exit(1);
}
?>
