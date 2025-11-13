<?php
header("Content-Type: application/json");

$file = "leaderboard.json";

// Ensure the file exists and initialize if missing
if (!file_exists($file)) {
    file_put_contents($file, "{}");
}

// Load existing leaderboard
$data = json_decode(file_get_contents($file), true);
if (!$data) $data = [];

// Read incoming JSON POST data
$input = json_decode(file_get_contents("php://input"), true);
$name = trim($input["name"] ?? "");
$score = intval($input["score"] ?? 0);

// Update leaderboard if a valid name is provided
if ($name !== "") {
    // Only keep the highest score
    if (!isset($data[$name]) || $score > $data[$name]) {
        $data[$name] = $score;
    }

    // Save updated leaderboard
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

// Sort leaderboard descending by score
arsort($data);

// Return leaderboard as JSON
echo json_encode($data);
?>
