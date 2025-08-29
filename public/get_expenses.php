<?php
session_start();
header('Content-Type: application/json');
require_once '../DB_conn.php';

$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated.']);
    exit();
}

$sql = "SELECT e.id, e.amount, c.name as category, e.expense_date, e.description FROM expenses e JOIN categories c ON e.category_id = c.id WHERE e.user_id = ? ORDER BY e.expense_date DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();

$expenses = [];
while ($row = $result->fetch_assoc()) {
    $expenses[] = $row;
}
echo json_encode(['success' => true, 'data' => $expenses]);

$stmt->close();
$conn->close();
