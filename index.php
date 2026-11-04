<?php

require __DIR__ . '/includes/partials/head.php';
?>
<div id="sidebarBackdrop" onclick="toggleMobileSidebar(false)" class="fixed inset-0 bg-slate-900/60 z-30 hidden lg:hidden backdrop-blur-xs"></div>
<div id="appShell" class="flex h-full w-full overflow-hidden">
  <?php require __DIR__ . '/includes/partials/sidebar.php'; ?>
  <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
    <?php require __DIR__ . '/includes/partials/header.php'; ?>
    <main id="mainViewport" class="flex-1 overflow-y-auto custom-scroll p-4 lg:p-6 space-y-6">
      <div id="viewContainer"></div>
    </main>
  </div>
</div>
<?php require __DIR__ . '/includes/partials/modal.php'; ?>
<?php require __DIR__ . '/includes/partials/toast.php'; ?>
<?php require __DIR__ . '/includes/partials/scripts.php'; ?>
</body>
</html>
