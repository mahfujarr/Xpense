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
    $default_categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Education'];
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
<?php $title = "$username | Xpense"; ?>
<?php include './components/head.php'; ?>
<?php include './components/navbar.php'; ?>
<link rel="stylesheet" href="/assets/css/dashboard.css">

<body>
    <div class="wrapper">
        <div class="main-content">
            <div class="dashboard">
                <h2>Welcome, <?php echo $username; ?>!</h2>
                <div class="dashboard-cards">
                    <div class="dashboard-card clickable-card" id="addExpenseCard">
                        <div class="card-icon">💸</div>
                        <h3>Add Expense</h3>
                        <p>Log your daily expenses.</p>
                    </div>
                    <div class="dashboard-card clickable-card" id="historyCard">
                        <div class="card-icon">📋</div>
                        <h3>History</h3>
                        <p>View all your expenses.</p>
                    </div>
                    <div class="dashboard-card clickable-card" id="manageCategoriesCard">
                        <div class="card-icon">🏷️</div>
                        <h3>Manage Categories</h3>
                        <p>Organize your categories.</p>
                    </div>
                </div>

                <!-- Financial Statistics & Charts Section -->
                <div class="statistics-section">
                    <div class="section-header">
                        <h2>Financial Overview</h2>
                        <button id="refreshStats" class="dashboard-btn" title="Refresh Statistics">
                            <span>🔄</span> Refresh
                        </button>
                    </div>

                    <!-- Statistics Cards -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">💰</div>
                            <div class="stat-content">
                                <h3>Total Expenses</h3>
                                <p class="stat-value" id="totalExpenses">৳0.00</p>
                                <p class="stat-period">This Month</p>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon">📊</div>
                            <div class="stat-content">
                                <h3>Average Daily</h3>
                                <p class="stat-value" id="avgDaily">৳0.00</p>
                                <p class="stat-period">This Month</p>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon">🎯</div>
                            <div class="stat-content">
                                <h3>Top Category</h3>
                                <p class="stat-value" id="topCategory">-</p>
                                <p class="stat-period">Highest Spending</p>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-icon">📅</div>
                            <div class="stat-content">
                                <h3>Total Entries</h3>
                                <p class="stat-value" id="totalEntries">0</p>
                                <p class="stat-period">This Month</p>
                            </div>
                        </div>
                    </div>

                    <!-- Category Chart and Table Side by Side -->
                    <div class="category-overview">
                        <div class="chart-wrapper">
                            <h3>Spending by Category</h3>
                            <div class="chart-container">
                                <canvas id="categoryPieChart"></canvas>
                            </div>
                        </div>

                        <div class="category-breakdown">
                            <h3>Category Breakdown</h3>
                            <div class="table-container">
                                <table id="categoryTable">
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Amount</th>
                                            <th>Percentage</th>
                                            <th>Entry Count</th>
                                        </tr>
                                    </thead>
                                    <tbody id="categoryTableBody">
                                        <!-- Data will be populated dynamically -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Charts Section -->
                    <div class="charts-container">
                        <div class="chart-wrapper">
                            <h3>Monthly Spending Trend</h3>
                            <div class="chart-container">
                                <canvas id="monthlyTrendChart"></canvas>
                            </div>
                        </div>
                    </div>


                </div>

            </div>
        </div>


        <!-- Add Expense Modal -->
        <div id="addExpenseModal" class="modal" style="display:none;">
            <div class="modal-content">
                <span class="close" id="closeAddExpenseModal">❌</span>
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
                    <button type="submit" id="addExpenseButton">Add Expense</button>
                    <div id="expenseMsg" style="margin-top:10px;"></div>
                </form>
            </div>
        </div>



        <!-- Manage Categories Modal -->
        <div id="manageCategoriesModal" class="modal" style="display:none;">
            <div class="modal-content">
                <span class="close" id="closeManageCategoriesModal">❌</span>
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
    <script src="/assets/js/chart.js"></script>
    <script src="/assets/js/dashboard.js"></script>
</body>

</html>