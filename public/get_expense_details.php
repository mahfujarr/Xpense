<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'error' => 'Invalid request.']);
    exit();
}

require_once '../DB_conn.php';

$user_id = $_SESSION['user_id'];
$expense_id = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$expense_id) {
    echo json_encode(['success' => false, 'error' => 'Expense ID is required.']);
    exit();
}

try {
    // Get expense details with category_id for editing
    $stmt = $conn->prepare("SELECT e.id, e.amount, e.category_id, c.name as category_name, e.expense_date, e.description 
                           FROM expenses e 
                           JOIN categories c ON e.category_id = c.id 
                           WHERE e.id = ? AND e.user_id = ?");
    $stmt->bind_param('ii', $expense_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Expense not found or access denied.']);
        exit();
    }
    
    $expense = $result->fetch_assoc();
    echo json_encode(['success' => true, 'data' => $expense]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
