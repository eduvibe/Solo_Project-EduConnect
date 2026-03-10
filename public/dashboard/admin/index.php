<?php
require_once __DIR__ . '/../../../server/auth.php';
$user = educonnect_require_role(['admin', 'superadmin']);
$name = isset($user['name']) ? $user['name'] : 'Admin';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard | EduConnect</title>
  <link rel="icon" type="image/png" href="/images/logo.png">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="/bootstrap-5.3.2-dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="bg-light">
  <nav class="navbar navbar-expand-lg bg-white border-bottom">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2" href="/index.html">
        <img src="/images/logo.png" alt="logo" width="40" height="40">
        <span>EduConnect</span>
      </a>
      <div class="ms-auto d-flex align-items-center gap-3">
        <span class="text-secondary small">Signed in as <?php echo htmlspecialchars($name); ?></span>
        <a class="btn btn-outline-secondary btn-sm" href="/logout.php">Logout</a>
      </div>
    </div>
  </nav>

  <main class="container py-4">
    <div class="p-4 bg-white rounded shadow-sm">
      <h1 class="h4 mb-2">Admin Dashboard</h1>
      <p class="text-secondary mb-0">Review tutor applications and manage platform content.</p>
    </div>

    <div class="row g-3 mt-1">
      <div class="col-md-6">
        <div class="p-3 bg-white rounded shadow-sm h-100">
          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-people"></i>
            <div class="fw-semibold">Tutor Applications</div>
          </div>
          <div class="text-secondary small">Coming soon</div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="p-3 bg-white rounded shadow-sm h-100">
          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-shield-check"></i>
            <div class="fw-semibold">Moderation</div>
          </div>
          <div class="text-secondary small">Coming soon</div>
        </div>
      </div>
    </div>
  </main>

  <script src="/bootstrap-5.3.2-dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

