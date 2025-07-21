<?php
if (session_status() === PHP_SESSION_NONE) session_start();
?>
<link rel="stylesheet" href="/assets/css/navbar.css">
<div class="navbar">
    <div class="container">
        <a href="/index.php" class="logo">
            <img src="/assets/icon.png" class="navbar-icon" alt="Xpense" onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<span class=\'logo\'>Xpense</span>');">
        </a>
        <ul class="nav-links">
            
            <?php if (isset($_SESSION['user_id'])): ?>
                <li><a href="/public/dashboard.php"><?php echo $username ?></a></li>
                <li class="logout"><a href="/public/auth/logout.php">Logout</a></li>
            <?php else: ?>
                <li><a href="/index.php">Home</a></li>
                <li><a href="/public/auth/login.php">Login</a></li>
                <li><a href="/public/auth/register.php">Register</a></li>
            <?php endif; ?>
        </ul>
    </div>
</div>