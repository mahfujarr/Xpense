<?php
session_start();
session_unset();
session_destroy();
header("Location: /public/auth/login.php");
exit(); 