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
$category_id = isset($_POST['category']) ? intval($_POST['category']) : null;
$expense_date = isset($_POST['date']) ? $_POST['date'] : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';

if ($amount === null || $amount <= 0 || !$category_id || !$expense_date) {
    echo json_encode(['success' => false, 'error' => 'Please fill all required fields.']);
    exit();
}

// Verify that the category belongs to the user
$verify_stmt = $conn->prepare("SELECT id FROM categories WHERE id = ? AND user_id = ?");
if (!$verify_stmt) {
    echo json_encode(['success' => false, 'error' => 'Database error.']);
    exit();
}
$verify_stmt->bind_param('ii', $category_id, $user_id);
$verify_stmt->execute();
$verify_result = $verify_stmt->get_result();

if ($verify_result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid category selected.']);
    $verify_stmt->close();
    $conn->close();
    exit();
}
$verify_stmt->close();

// Insert into DB
$stmt = $conn->prepare("INSERT INTO expenses (user_id, amount, category_id, expense_date, description) VALUES (?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Database error.']);
    exit();
}
$stmt->bind_param('idiss', $user_id, $amount, $category_id, $expense_date, $description);
$success = $stmt->execute();
if ($success) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to add expense.']);
}
$stmt->close();
$conn->close();
