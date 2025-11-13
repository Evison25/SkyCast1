<?php
header("Content-Type: application/json");
$file = "leaderboard.json";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input || !isset($input["name"]) || !isset($input["score"])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid input"]);
        exit;
    }

    $name = htmlspecialchars($input["name"]);
    $score = intval($input["score"]);

    $data = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $data[] = ["name" => $name, "score" => $score];

    usort($data, fn($a, $b) => $b["score"] <=> $a["score"]);
    $data = array_slice($data, 0, 10);

    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
    echo json_encode(["success" => true]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (!file_exists($file)) echo json_encode([]);
    else echo file_get_contents($file);
}
?>
