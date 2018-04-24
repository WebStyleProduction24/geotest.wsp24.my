<div class="w2dc-content">
	<?php w2dc_renderMessages(); ?>

	<?php if (isset($_GET['level']) && ($level = $w2dc_instance->levels->getLevelById($_GET['level']))): ?>
	<?php if (count($w2dc_instance->levels->levels_array) > 1): ?>
	<h2><?php echo sprintf(__('Create new %s in level "%s"', 'W2DC'), $w2dc_instance->current_directory->single, $level->name); ?></h2>
	<?php endif; ?>
	<?php endif; ?>

	<div class="w2dc-submit-section-adv">
		<?php w2dc_login_form(); ?>
	</div>
</div>