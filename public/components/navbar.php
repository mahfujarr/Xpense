<?php
if (session_status() === PHP_SESSION_NONE) session_start();
?>
<link rel="stylesheet" href="/assets/css/navbar.css">

<div class="navbar">
    <div class="container">
        <a href="/index.php" class="logo">
            <img src="/assets/icon.png" class="navbar-icon" title="Home" alt="Xpense"
                onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<span class=\'logo\'>Xpense</span>');">
        </a>

        <div class="hamburger" id="hamburger">
            <div></div>
            <div></div>
            <div></div>
        </div>

        <ul class="nav-links" id="nav-links">
            <?php if (isset($_SESSION['user_id'])): ?>
                <!-- <li><a href="/public/dashboard.php"><?php echo htmlspecialchars($username ?? 'Dashboard'); ?></a></li> -->
                <li><a href="/public/edit_profile.php">Edit Profile</a></li>
                <li class="logout"><a href="/public/auth/logout.php">Logout</a></li>
            <?php else: ?>
                <!-- <li><a href="/index.php">Home</a></li> -->
                <li><a href="/public/auth/login.php">Login</a></li>
                <li><a href="/public/auth/register.php">Register</a></li>
            <?php endif; ?>
        </ul>
    </div>
</div>

<script>
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('show');
    });
</script>