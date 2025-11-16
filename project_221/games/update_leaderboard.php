<?php
// Allow CORS (optional, useful for local testing)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$filename = __DIR__ . '/leaderboard.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read input JSON
    $input = json_decode(file_get_contents('php://input'), true);
    $name = trim($input['name'] ?? '');
    $score = intval($input['score'] ?? 0);

    // Basic validation
    if ($name === '' || $score < 0) {
        echo json_encode(["status" => "error", "message" => "Invalid input"]);
        exit;
    }

    // Ensure leaderboard file exists
    if (!file_exists($filename)) {
        file_put_contents($filename, json_encode([], JSON_PRETTY_PRINT));
    }

    // Load existing data
    $data = json_decode(file_get_contents($filename), true);
    if (!is_array($data)) {
        $data = [];
    }

    // Update score if higher or add new player
    if (!isset($data[$name]) || $score > $data[$name]) {
        $data[$name] = $score;
    }

    // Sort leaderboard (highest score first)
    arsort($data);

    // Save updated leaderboard
    file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT));

    // Return success and current leaderboard
    echo json_encode([
        "status" => "ok",
        "message" => "Leaderboard updated",
        "leaderboard" => $data
    ]);
} else { // GET request
    if (!file_exists($filename)) {
        echo json_encode([]);
        exit;
    }

    $data = json_decode(file_get_contents($filename), true);
    if (!is_array($data)) {
        $data = [];
    }
    
    arsort($data);

    echo json_encode($data);
}
?>
