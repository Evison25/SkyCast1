<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

    // Basic validation
    if (empty($name) || empty($email) || empty($password) || empty($confirmPassword)) {
        die("All fields are required. <a href='auth.html'>Go Back</a>");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email format. <a href='auth.html'>Go Back</a>");
    }

    if ($password !== $confirmPassword) {
        die("Passwords do not match. <a href='auth.html'>Go Back</a>");
    }

    if (strlen($password) < 6) {
        die("Password must be at least 6 characters. <a href='auth.html'>Go Back</a>");
    }

    $usersFile = 'users.json';
    if (!file_exists($usersFile)) {
        file_put_contents($usersFile, json_encode([]));
    }

    $users = json_decode(file_get_contents($usersFile), true);
    foreach ($users as $user) {
        if ($user['email'] === $email) {
            die("Email already registered. <a href='auth.html'>Go Back</a>");
        }
    }

    // Add new user
    $users[] = [
        'name' => $name,
        'email' => $email,
        'password' => password_hash($password, PASSWORD_DEFAULT)
    ];

    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT), LOCK_EX);

    $_SESSION['user'] = [
        'name' => $name,
        'email' => $email
    ];

    header("Location: index.html");
    exit;
}
?>
