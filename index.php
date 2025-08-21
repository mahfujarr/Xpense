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

    <main class="main-content">

        <!-- Hero Section -->
        <section class="hero">
            <h1>Welcome to <span class="brand">Xpense</span></h1>
            <p>Your personal expense tracker — simple, secure, and always accessible.</p>
            <div class="hero-actions">
                <a href="./public/auth/login.php" class="btn primary">Login</a>
                <a href="./public/auth/register.php" class="btn secondary">Register</a>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features">
            <h2>Features</h2>
            <ul>
                <li>📊 Track your expenses easily</li>
                <li>📈 View reports and statistics</li>
                <li>🔒 Secure and private</li>
                <li>🌍 Accessible from anywhere</li>
            </ul>
        </section>

    </main>

    <?php include './public/components/footer.php'; ?>
</body>

</html>
