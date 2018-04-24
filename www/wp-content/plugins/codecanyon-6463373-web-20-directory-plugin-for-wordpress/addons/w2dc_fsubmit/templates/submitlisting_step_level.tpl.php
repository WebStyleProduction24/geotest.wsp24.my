<div class="w2dc-content">
	<?php w2dc_renderMessages(); ?>

	<div class="w2dc-submit-section-adv">
		<?php $max_columns_in_row = $frontend_controller->args['columns']; ?>
		<?php $levels_counter = count($frontend_controller->levels); ?>
		<?php if ($levels_counter > $max_columns_in_row) $levels_counter = $max_columns_in_row; ?>
		<?php $cols_width = floor(12/$levels_counter); ?>
		<?php $cols_width_percents = (100-1)/$levels_counter; ?>

		<?php $counter = 0; ?>
		<?php $tcounter = 0; ?>
		<?php foreach ($frontend_controller->levels AS $level): ?>
		<?php $tcounter++; ?>
		<?php if ($counter == 0): ?>
		<div class="w2dc-row" style="text-align: center;">
		<?php endif; ?>

			<div class="w2dc-col-sm-<?php echo $cols_width; ?> w2dc-plan-column w2dc-plan-column-<?php echo $level->id; ?>" style="width: <?php echo $cols_width_percents; ?>%;">
				<div class="w2dc-panel w2dc-panel-default w2dc-choose-plan <?php if ($level->featured): ?>w2dc-featured-level<?php endif; ?>">
					<div class="w2dc-panel-heading w2dc-choose-plan-head <?php if ($level->featured): ?>w2dc-featured<?php endif; ?>">
						<div class="w2dc-choose-plan-level">
							<h3>
								<?php echo $level->name; ?>
							</h3>
							<?php echo $w2dc_instance->listings_packages->submitlisting_level_message($level, $directory); ?>
							<?php do_action('w2dc_submitlisting_level_name', $level); ?>
						</div>
						<?php echo w2dc_levelPriceString($level); ?>
						<?php if ($level->listings_in_package > 1): ?>
						<div class="w2dc-choose-plan-package-number">
							<?php printf(__("for <strong>%d</strong> %s in the package", "W2DC"), $level->listings_in_package, _n($directory->single, $directory->plural, $level->listings_in_package)); ?>
						</div>
						<?php endif; ?>
						<?php if ($level->description) w2dc_hintMessage(nl2br($level->description), 'bottom'); ?>
					</div>
					<ul class="w2dc-list-group">
						<?php do_action('w2dc_submitlisting_levels_rows_before', $level, '<li class="w2dc-list-group-item w2dc-choose-plan-option">', '</li>'); ?>
						<?php w2dc_renderTemplate(array(W2DC_FSUBMIT_TEMPLATES_PATH, 'level_details.tpl.php'), array('args' => $frontend_controller->args, 'level' => $level)); ?>
						<?php do_action('w2dc_submitlisting_levels_rows_after', $level, '<li class="w2dc-list-group-item w2dc-choose-plan-option">', '</li>'); ?>
						<?php if (!empty($w2dc_instance->submit_pages_all)): ?>
						<li class="w2dc-list-group-item">
							<a href="<?php echo w2dc_submitUrl(array('level' => $level->id, 'directory' => $directory->id)); ?>" class="w2dc-btn w2dc-btn-primary"><?php _e('Submit', 'W2DC'); ?></a>
						</li>
						<?php endif; ?>
					</ul>
				</div>          
			</div>

		<?php $counter++; ?>
		<?php if ($counter == $max_columns_in_row || $tcounter == $levels_counter || $tcounter == count($frontend_controller->levels)): ?>
		</div>
		<?php endif; ?>
		<?php if ($counter == $max_columns_in_row) $counter = 0; ?>
		<?php endforeach; ?>
	</div>
</div>