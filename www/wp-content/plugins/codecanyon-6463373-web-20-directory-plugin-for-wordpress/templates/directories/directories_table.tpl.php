<?php w2dc_renderTemplate('admin_header.tpl.php'); ?>

<h2>
	<?php _e('Listings directories', 'W2DC'); ?>
	<?php echo sprintf('<a class="add-new-h2" href="?page=%s&action=%s">' . __('Create new directory', 'W2DC') . '</a>', $_GET['page'], 'add'); ?>
</h2>

<?php _e('Create pages with following shortcodes. Each directory must have own page with its unique shortcode.', 'W2DC'); ?>

<form method="POST" action="<?php echo admin_url('admin.php?page=w2dc_directories'); ?>">
	<?php 
		$directories_table->display();
	?>
</form>

<?php w2dc_renderTemplate('admin_footer.tpl.php'); ?>