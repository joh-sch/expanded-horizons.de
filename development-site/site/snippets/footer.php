  <?php // Scripts // ?>
  <script src="<?= url('app/app.min.js') ?>?v=<?= EXPANDED_HORIZONS_VERSION ?>" defer></script>

  <?php if (option('debug')): ?>
    <script src="http://localhost:35729/livereload.js?snipver=1"></script>
  <?php endif ?>
</body>
</html>
