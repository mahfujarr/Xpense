<?php
session_start();
if (isset($_SESSION['user_id'])) {
    header("Location: /public/dashboard.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<?php include './public/components/head.php'; ?>

<body>
    <?php include './public/components/navbar.php'; ?>
    <div class="main-content">
        <div class="hero">
            <h1>Welcome to Xpense</h1>
            <p>Your personal expense tracker</p>
            <a href="./public/auth/login.php">Login</a> | <a href="./public/auth/register.php">Register</a>
        </div>

        <div class="features">
            <h2>Features</h2>
            <ul>
                <li>Track your expenses easily</li>
                <li>View reports and statistics</li>
                <li>Secure and private</li>
                <li>Accessible from anywhere</li>
            </ul>
        </div>
    </div>
    <?php include './public/components/footer.php'; ?>

</body>

</html>