<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['loginEmail']);
    $password = $_POST['loginPassword'];

    if (empty($email) || empty($password)) {
        die("All fields are required. <a href='auth.html'>Go Back</a>");
    }

    $usersFile = 'users.json';
    if (!file_exists($usersFile)) {
        die("No users registered yet. <a href='auth.html'>Go Back</a>");
    }

    $users = json_decode(file_get_contents($usersFile), true);

    $found = false;
    foreach ($users as $user) {
        if ($user['email'] === $email) {
            $found = $user;
            break;
        }
    }

    if (!$found) {
        die("Email not found. <a href='auth.html'>Go Back</a>");
    }

    if (!password_verify($password, $found['password'])) {
        die("Incorrect password. <a href='auth.html'>Go Back</a>");
    }

    $_SESSION['user'] = [
        'name' => $found['name'],
        'email' => $found['email']
    ];

    header("Location: index.html");
    exit;
}
?>
