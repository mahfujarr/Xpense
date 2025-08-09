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
$expense_id = isset($_POST['id']) ? intval($_POST['id']) : null;
$amount = isset($_POST['amount']) ? floatval($_POST['amount']) : null;
$category = isset($_POST['category']) ? trim($_POST['category']) : '';
$expense_date = isset($_POST['date']) ? $_POST['date'] : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';

if ($expense_id === null || $amount === null || $amount <= 0 || !$category || !$expense_date) {
    echo json_encode(['success' => false, 'error' => 'Please fill all required fields.']);
    exit();
}

// First verify that the expense belongs to the current user
$verify_stmt = $conn->prepare("SELECT id FROM expenses WHERE id = ? AND user_id = ?");
if (!$verify_stmt) {
    echo json_encode(['success' => false, 'error' => 'Database error.']);
    exit();
}
$verify_stmt->bind_param('ii', $expense_id, $user_id);
$verify_stmt->execute();
$result = $verify_stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Expense not found or access denied.']);
    $verify_stmt->close();
    $conn->close();
    exit();
}
$verify_stmt->close();

// Update the expense
$stmt = $conn->prepare("UPDATE expenses SET amount = ?, category = ?, expense_date = ?, description = ? WHERE id = ? AND user_id = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Database error.']);
    exit();
}

$stmt->bind_param('dsssii', $amount, $category, $expense_date, $description, $expense_id, $user_id);
$success = $stmt->execute();

if ($success && $stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Expense updated successfully.']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update expense.']);
}

$stmt->close();
$conn->close();
?>