<?php
session_start();
require_once '../DB_conn.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not authenticated']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Check if category ID is provided
if (!isset($_POST['id']) || empty($_POST['id'])) {
    echo json_encode(['success' => false, 'error' => 'Category ID is required']);
    exit();
}

$category_id = intval($_POST['id']);

try {
    // Check if category exists and belongs to the current user
    $check_stmt = $conn->prepare("SELECT id, name FROM categories WHERE id = ? AND user_id = ?");
    $check_stmt->bind_param("ii", $category_id, $user_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Category not found or access denied']);
        $check_stmt->close();
        exit();
    }
    
    $category_data = $check_result->fetch_assoc();
    $check_stmt->close();
    
    // Check if category is being used in expenses
    $expense_check = $conn->prepare("SELECT COUNT(*) as count FROM expenses WHERE user_id = ? AND category = ?");
    $expense_check->bind_param("is", $user_id, $category_data['name']);
    $expense_check->execute();
    $expense_result = $expense_check->get_result();
    $expense_count = $expense_result->fetch_assoc()['count'];
    $expense_check->close();
    
    if ($expense_count > 0) {
        echo json_encode(['success' => false, 'error' => 'Cannot delete category. It is being used by ' . $expense_count . ' expense(s).']);
        exit();
    }
    
    // Delete category
    $stmt = $conn->prepare("DELETE FROM categories WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $category_id, $user_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Category deleted successfully',
            'data' => [
                'id' => $category_id,
                'name' => $category_data['name']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to delete category']);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}

$conn->close();
?> 