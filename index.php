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
            <h2>Why Choose Xpense?</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <h3>Expense Tracking</h3>
                    <p>Easily add, edit, and categorize your daily expenses with our intuitive interface</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Visual Reports</h3>
                    <p>Generate detailed charts and graphs to visualize your spending patterns</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🏷️</div>
                    <h3>Custom Categories</h3>
                    <p>Create and manage personalized expense categories to organize your finances</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📈</div>
                    <h3>Budget Analysis</h3>
                    <p>Track your spending trends and identify areas for financial improvement</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>Secure & Private</h3>
                    <p>Your financial data is protected with secure authentication and encryption</p>
                </div>
                <!-- <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Responsive Design</h3>
                    <p>Access your expense tracker from any device - desktop, tablet, or mobile</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Quick Entry</h3>
                    <p>Add expenses in seconds with our streamlined input forms and validation</p>
                </div> -->
                <div class="feature-card">
                    <div class="feature-icon">🌐</div>
                    <h3>Web Based tracking</h3>
                    <p>No need to download any app. Just open your browser and start tracking your expenses.</p>
                </div>
            </div>
        </section>

    </main>

    <?php include './public/components/footer.php'; ?>
</body>

</html>