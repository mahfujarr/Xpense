<!DOCTYPE html>
<html lang="en">
<?php include '../components/head.php'; ?>
<?php include '../components/navbar.php'; ?>

<link rel="stylesheet" href="/assets/css/login.css">

<body>
    <div class="main-content">
        <div class="login">
            <h2>Login</h2>
            <form action="login.php" method="post">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <button type="submit">Login</button>
                </div>
                <div class="form-group">
                    <p>Don't have an account? <a href="register.php">Register here</a></p>
                </div>
            </form>
        </div>
    </div>
    <?php include '../components/footer.php'; ?>
</body>

</html>