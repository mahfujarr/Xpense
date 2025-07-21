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
                    <a href="/public/expenses.php" class="dashboard-btn">Go to Expenses</a>
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
</body>

</html>