<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: /public/auth/login.php');
    exit();
}

$username = htmlspecialchars($_SESSION['username']);

// Check if user has categories, if not add default ones
require_once '../DB_conn.php';
$user_id = $_SESSION['user_id'];

$check_categories = $conn->prepare("SELECT COUNT(*) as count FROM categories WHERE user_id = ?");
$check_categories->bind_param("i", $user_id);
$check_categories->execute();
$result = $check_categories->get_result();
$category_count = $result->fetch_assoc()['count'];
$check_categories->close();

if ($category_count == 0) {
    // Add default categories for existing users who don't have any
    $default_categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare'];
    $category_stmt = $conn->prepare("INSERT INTO categories (user_id, name) VALUES (?, ?)");
    
    foreach ($default_categories as $category) {
        $category_stmt->bind_param("is", $user_id, $category);
        $category_stmt->execute();
    }
    $category_stmt->close();
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<?php $title = "Dashboard | Xpense"; ?>
<?php include './components/head.php'; ?>
<?php include './components/navbar.php'; ?>
<link rel="stylesheet" href="/assets/css/dashboard.css">

<body>
    <div class="wrapper">
        <div class="main-content">
            <div class="dashboard">
                <h2>Welcome, <?php echo $username; ?>!</h2>
                <div class="dashboard-cards">
                    <div class="dashboard-card">
                        <h3>Track Expenses</h3>
                        <p>Log and manage your daily expenses easily.</p>
                        <button id="openAddExpenseModal" class="dashboard-btn">Add Expenses</button>
                    </div>
                    <div class="dashboard-card">
                        <h3>Reports & Stats</h3>
                        <p>View insightful reports and statistics.</p>
                        <a href="#" class="dashboard-btn">View Reports</a>
                    </div>
                    <div class="dashboard-card">
                        <h3>Manage Categories</h3>
                        <p>Organize your spending by categories.</p>
                        <button id="openManageCategoriesModal" class="dashboard-btn">Manage Categories</button>
                    </div>
                </div>
                <div id="expenseHistorySection" class="expense-history">
                    <h2>Expense History</h2>

                    <!-- group by div (added later) -->
                    <div class="grouping-inline">
                        <label for="groupFormat">Group By:</label>
                        <select id="groupFormat">
                            <option value="day" selected>Day</option>
                            <option value="month">Month</option>
                        </select>
                    </div>
                    <!-- <div id="expenseTotal" style="margin-bottom: 12px; font-weight: bold;"></div> -->
                    <div id="expenseGroupedList"></div>
                </div>
            </div>
        </div>


        <!-- Add Expense Modal -->
        <div id="addExpenseModal" class="modal" style="display:none;">
            <div class="modal-content">
                <span class="close" id="closeAddExpenseModal">&times;</span>
                <h2>Add Expense</h2>
                <form id="addExpenseForm">
                    <label for="amount">Amount:</label>
                    <input type="number" id="amount" name="amount" required step="0.01" min="0">
                    <label for="category">Category:</label>
                    <select id="category" name="category" required>
                        <option value="">Select a category</option>
                        <!-- Categories will be loaded here dynamically -->
                    </select>
                    <label for="date">Date:</label>
                    <input type="date" id="date" name="date" required>
                    <label for="description">Description:</label>
                    <textarea id="description" name="description" rows="2"></textarea>
                    <button type="submit">Add Expense</button>
                    <div id="expenseMsg" style="margin-top:10px;"></div>
                </form>
            </div>
        </div>

        <!-- Edit Expense Modal -->
        <div id="editExpenseModal" class="modal" style="display:none;">
            <div class="modal-content">
                <span class="close" id="closeEditExpenseModal">&times;</span>
                <h2>Edit Expense</h2>
                <form id="editExpenseForm">
                    <input type="hidden" id="editExpenseId" name="id">
                    <label for="editAmount">Amount:</label>
                    <input type="number" id="editAmount" name="amount" required step="0.01" min="0">
                    <label for="editCategory">Category:</label>
                    <select id="editCategory" name="category" required>
                        <option value="">Select a category</option>
                        <!-- Categories will be loaded here dynamically -->
                    </select>
                    <label for="editDate">Date:</label>
                    <input type="date" id="editDate" name="date" required>
                    <label for="editDescription">Description:</label>
                    <textarea id="editDescription" name="description" rows="2"></textarea>
                    <button type="submit">Update Expense</button>
                    <div id="editExpenseMsg" style="margin-top:10px;"></div>
                </form>
            </div>
        </div>

        <!-- Manage Categories Modal -->
        <div id="manageCategoriesModal" class="modal" style="display:none;">
            <div class="modal-content">
                <span class="close" id="closeManageCategoriesModal">&times;</span>
                <h2>Manage Categories</h2>
                <!-- Add Category Form -->
                <form id="addCategoryForm">
                    <label for="newCategory">Add New Category:</label>
                    <input type="text" id="newCategory" name="newCategory" placeholder="Enter category name" required>
                    <button type="submit">Add Category</button>
                    <div id="categoryMsg"></div>
                </form>
                <!-- List of Existing Categories -->
                <h3>Existing Categories</h3>
                <ul id="categoryList">
                    <!-- Categories will be loaded here dynamically -->
                </ul>
            </div>
        </div>
    </div>
    <script src="/assets/js/dashboard.js"></script>
</body>

</html>