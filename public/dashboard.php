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
<?php $title = "Dashboard | Xpense"; ?>
<?php include './components/head.php'; ?>
<?php include './components/navbar.php'; ?>
<link rel="stylesheet" href="/assets/css/dashboard.css">

<body>
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
                    <a href="/public/reports.php" class="dashboard-btn">View Reports</a>
                </div>
                <div class="dashboard-card">
                    <h3>Manage Categories</h3>
                    <p>Organize your spending by categories.</p>
                    <a href="/public/categories.php" class="dashboard-btn">Manage Categories</a>
                </div> 
            </div>
        </div>
    </div>
    <?php include './components/footer.php'; ?>

    <!-- Add Expense Modal -->
    <div id="addExpenseModal" class="modal" style="display:none;">
        <div class="modal-content">
            <span class="close" id="closeAddExpenseModal">&times;</span>
            <h2>Add Expense</h2>
            <form id="addExpenseForm">
                <label for="amount">Amount:</label>
                <input type="number" id="amount" name="amount" required step="0.01" min="0">
                <label for="category">Category:</label>
                <input type="text" id="category" name="category" required>
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" required>
                <label for="description">Description:</label>
                <textarea id="description" name="description" rows="2"></textarea>
                <button type="submit">Add Expense</button>
                <div id="expenseMsg" style="margin-top:10px;"></div>
            </form>
        </div>
    </div>
    <script>
        // Modal open/close logic
        const openBtn = document.getElementById('openAddExpenseModal');
        const modal = document.getElementById('addExpenseModal');
        const closeBtn = document.getElementById('closeAddExpenseModal');
        openBtn.onclick = () => { modal.style.display = 'block'; };
        closeBtn.onclick = () => { modal.style.display = 'none'; document.getElementById('expenseMsg').innerText = ''; };
        window.onclick = (event) => { if (event.target == modal) { modal.style.display = 'none'; document.getElementById('expenseMsg').innerText = ''; } };

        // AJAX form submission
        document.getElementById('addExpenseForm').onsubmit = function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            fetch('/public/add_expense.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                const msg = document.getElementById('expenseMsg');
                if (data.success) {
                    msg.style.color = 'green';
                    msg.innerText = 'Expense added successfully!';
                    this.reset();
                } else {
                    msg.style.color = 'red';
                    msg.innerText = data.error || 'Failed to add expense.';
                }
            })
            .catch(() => {
                const msg = document.getElementById('expenseMsg');
                msg.style.color = 'red';
                msg.innerText = 'An error occurred.';
            });
        };
    </script>
</body>

</html>