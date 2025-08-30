<?php
session_start();
require_once '../DB_conn.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not authenticated']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Check if required data is provided
if (!isset($_POST['id']) || !isset($_POST['name']) || empty(trim($_POST['name']))) {
    echo json_encode(['success' => false, 'error' => 'Category ID and name are required']);
    exit();
}

$category_id = intval($_POST['id']);
$category_name = trim($_POST['name']);

// Validate category name length
if (strlen($category_name) > 50) {
    echo json_encode(['success' => false, 'error' => 'Category name must be 50 characters or less']);
    exit();
}

try {
    // Check if category exists and belongs to the current user
    $check_stmt = $conn->prepare("SELECT id FROM categories WHERE id = ? AND user_id = ?");
    $check_stmt->bind_param("ii", $category_id, $user_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Category not found or access denied']);
        $check_stmt->close();
        exit();
    }
    $check_stmt->close();

    // Check if new name already exists for this user (excluding current category)
    $duplicate_stmt = $conn->prepare("SELECT id FROM categories WHERE user_id = ? AND name = ? AND id != ?");
    $duplicate_stmt->bind_param("isi", $user_id, $category_name, $category_id);
    $duplicate_stmt->execute();
    $duplicate_result = $duplicate_stmt->get_result();

    if ($duplicate_result->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 'Category name already exists']);
        $duplicate_stmt->close();
        exit();
    }
    $duplicate_stmt->close();

    // Update category
    $stmt = $conn->prepare("UPDATE categories SET name = ? WHERE id = ? AND user_id = ?");
    $stmt->bind_param("sii", $category_name, $category_id, $user_id);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => [
                'id' => $category_id,
                'name' => $category_name
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update category']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}

$conn->close();
