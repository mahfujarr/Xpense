<?php
session_start();
require_once '../DB_conn.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not authenticated']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Check if category name is provided
if (!isset($_POST['name']) || empty(trim($_POST['name']))) {
    echo json_encode(['success' => false, 'error' => 'Category name is required']);
    exit();
}

$category_name = trim($_POST['name']);

// Validate category name length
if (strlen($category_name) > 50) {
    echo json_encode(['success' => false, 'error' => 'Category name must be 50 characters or less']);
    exit();
}

try {
    // Check if category already exists for this user
    $check_stmt = $conn->prepare("SELECT id FROM categories WHERE user_id = ? AND name = ?");
    $check_stmt->bind_param("is", $user_id, $category_name);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 'Category already exists']);
        $check_stmt->close();
        exit();
    }
    $check_stmt->close();
    
    // Insert new category
    $stmt = $conn->prepare("INSERT INTO categories (user_id, name) VALUES (?, ?)");
    $stmt->bind_param("is", $user_id, $category_name);
    
    if ($stmt->execute()) {
        $category_id = $conn->insert_id;
        echo json_encode([
            'success' => true, 
            'message' => 'Category added successfully',
            'data' => [
                'id' => $category_id,
                'name' => $category_name
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to add category']);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}

$conn->close();
?> 