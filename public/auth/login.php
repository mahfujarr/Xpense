<?php require_once 'login_logic.php'; ?>
<!DOCTYPE html>
<html lang="en">
<?php $title = "Login | Xpense"; ?>
<?php include '../components/head.php'; ?>
<?php include '../components/navbar.php'; ?>

<link rel="stylesheet" href="/assets/css/login.css">

<body>
    <div class="main-content">
        <div class="login">
            <h2>Login</h2>
            <?php if (!empty($errors)): ?>
                <div class="form-group" style="color: red;">
                    <?php foreach ($errors as $error): ?>
                        <div><?php echo $error; ?></div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            <form action="login.php" method="post">
                <div class="form-group">
                    <label for="username">Username/Email:</label>
                    <input type="text" id="username" name="username" placeholder="Enter your username or email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password" required>
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