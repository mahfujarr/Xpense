<!DOCTYPE html>
<html lang="en">
<?php require_once 'register_logic.php' ?>
<?php $title = "Register | Xpense"; ?>
<?php include '../components/head.php'; ?>
<?php include '../components/navbar.php'; ?>

<link rel="stylesheet" href="/assets/css/login.css">

<body>
    <div class="main-content">
        <div class="login">
            <h2>Register</h2>
            <?php if (!empty($errors)): ?>
                <div class="form-group" style="color: red;">
                    <?php foreach ($errors as $error): ?>
                        <div><?php echo $error; ?></div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            <?php if ($success): ?>
                <div class="form-group" style="color: green;">
                    <?php echo $success; ?>
                </div>
            <?php endif; ?>
            <form action="register.php" method="post">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="confirm_password">Confirm Password:</label>
                    <input type="password" id="confirm_password" name="confirm_password" required>
                </div>
                <div class="form-group">
                    <button type="submit">Register</button>
                </div>
                <div class="form-group">
                    <p>Already have an account? <a href="login.php">Login here</a></p>
                </div>
            </form>
        </div>
    </div>
    <?php include '../components/footer.php'; ?>
</body>

</html>