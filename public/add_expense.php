<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request.']);
    exit();
}

require_once '../DB_conn.php';

$user_id = $_SESSION['user_id'];
$amount = isset($_POST['amount']) ? floatval($_POST['amount']) : null;
$category = isset($_POST['category']) ? trim($_POST['category']) : '';
$expense_date = isset($_POST['date']) ? $_POST['date'] : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';

if ($amount === null || $amount <= 0 || !$category || !$date) {
    echo json_encode(['success' => false, 'error' => 'Please fill all required fields.']);
    exit();
}

// Insert into DB

$stmt = $conn->prepare("INSERT INTO expenses (user_id, amount, category, expense_date, description) VALUES (?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Database error.']);
    exit();
}
$stmt->bind_param('idsss', $user_id, $amount, $category, $expense_date, $description);
$success = $stmt->execute();
if ($success) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to add expense.']);
}
$stmt->close();
$conn->close(); 