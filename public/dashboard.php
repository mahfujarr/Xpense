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

<body>
    <div class="main-content">
        <div class="dashboard">
            <h2>Welcome, <?php echo $username; ?>!</h2>
            <p>This is your dashboard. Here you will be able to:</p>
            <ul>
                <li>Track your expenses</li>
                <li>View reports and statistics</li>
                <li>Manage categories</li>
                <li><a href="/public/auth/logout.php">Logout</a></li>
            </ul>
            <!-- Add more dashboard features here -->
        </div>
    </div>
    <?php include './components/footer.php'; ?>
</body>
</html> 