<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: /public/auth/login.php');
    exit();
}
$username = htmlspecialchars($_SESSION['username']);
$email = htmlspecialchars($_SESSION['email'] ?? 'No Email is set currently');

// Handle form submission
$errors = [];
$success = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_username = trim($_POST['username']);
    $new_email = trim($_POST['email']);
    $new_password = $_POST['password'];

    if (empty($new_username) || empty($new_email)) {
        $errors[] = "Username and Email are required.";
    } else {
        require_once "../DB_conn.php";
        $user_id = $_SESSION['user_id'];

        // Check for duplicate username (excluding current user)
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
        $stmt->bind_param("si", $new_username, $user_id);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $errors[] = "Username already exists.";
        }
        $stmt->close();

        // Check for duplicate email (excluding current user)
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->bind_param("si", $new_email, $user_id);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $errors[] = "Email already exists.";
        }
        $stmt->close();

        // Only update if no errors
        if (empty($errors)) {
            // Update username and email
            $stmt = $conn->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
            $stmt->bind_param("ssi", $new_username, $new_email, $user_id);
            $stmt->execute();
            $stmt->close();

            // Update password if provided
            if (!empty($new_password)) {
                $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
                $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
                $stmt->bind_param("si", $hashed_password, $user_id);
                $stmt->execute();
                $stmt->close();
            }

            // Update session values
            $_SESSION['username'] = $new_username;
            $_SESSION['email'] = $new_email;
            $success = "Profile updated successfully!";
            $username = htmlspecialchars($new_username);
            $email = htmlspecialchars($new_email);
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
    <?php $title = "Edit Profile | Xpense"; ?>
    <?php include './components/head.php'; ?>
    <?php include './components/navbar.php'; ?>

    <link rel="stylesheet" href="/assets/css/login.css">

<body>
    <div class="main-content">
        <div class="login">
            <h2>Edit Profile</h2>
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
            <form action="edit_profile.php" method="post">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" value="<?php echo $username; ?>" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="<?php echo $email; ?>" required>
                </div>
                <div class="form-group">
                    <label for="password">New Password:</label>
                    <input type="password" id="password" name="password" placeholder="Leave blank to keep current">
                </div>
                <div class="hero-actions">
                    <button type="submit" class="btn primary">Save Changes</button>
                    <a href="/public/dashboard.php" class="btn secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
    <?php include './components/footer.php'; ?>
</body>
</html>