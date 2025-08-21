<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: /public/auth/login.php');
    exit();
}

$username = htmlspecialchars($_SESSION['username']);
?>
<!DOCTYPE html>
<html lang="en">
<?php $title = "Reports & Statistics | Xpense"; ?>
<?php include './components/head.php'; ?>
<?php include './components/navbar.php'; ?>
<link rel="stylesheet" href="/assets/css/dashboard.css">

<body>
    <div class="wrapper">
        <div class="main-content">
            <div class="dashboard">
                <h2>All expenses of <?php echo $username; ?></h2>
                <!-- <p class="reports-subtitle">Hey, <?php echo $username; ?>! You're viewing all your expense history.</p> -->
                
                <div id="expenseHistorySection" class="expense-history">
                    <!-- <h2>Expense History</h2> -->

                    <!-- group by div -->
                    <div class="grouping-inline">
                        <label for="groupFormat">Group By:</label>
                        <select id="groupFormat">
                            <option value="day" selected>Day</option>
                            <option value="month">Month</option>
                        </select>
                    </div>
                    
                    <div id="expenseGroupedList"></div>
                </div>
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
    </div>
    
    <script src="/assets/js/reports.js"></script>
</body>
</html> 