<?php w2dc_renderTemplate('admin_header.tpl.php'); ?>

<h2>
	<?php
	if ($level_id)
		_e('Edit level', 'W2DC');
	else
		_e('Create new level', 'W2DC');
	?>
</h2>

<script>
(function($) {
	"use strict";

	$(function() {
		$("body").on("click", "#eternal_active_period", function() {
			if ($('#eternal_active_period').is(':checked')) {
				$('#active_interval').attr('disabled', true);
				$('#active_period').attr('disabled', true);
				$('#change_level_id').attr('disabled', true);
		    } else {
		    	$('#active_interval').removeAttr('disabled');
		    	$('#active_period').removeAttr('disabled');
		    	$('#change_level_id').removeAttr('disabled');
		    }
		});
	
		$("body").on("click", "#unlimited_categories", function() {
			if ($("#unlimited_categories").is(':checked')) {
				$("#categories_number").attr('disabled', true);
			} else {
				$("#categories_number").removeAttr('disabled');
			}
		});
	});
})(jQuery);
</script>

<form method="POST" action="">
	<?php wp_nonce_field(W2DC_PATH, 'w2dc_levels_nonce');?>
	<table class="form-table">
		<tbody>
			<tr>
				<th scope="row">
					<label><?php _e('Level name', 'W2DC'); ?><span class="w2dc-red-asterisk">*</span></label>
				</th>
				<td>
					<input
						name="name"
						type="text"
						class="regular-text"
						value="<?php echo esc_attr($level->name); ?>" />
					<?php w2dc_wpmlTranslationCompleteNotice(); ?>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Level description', 'W2DC'); ?></label>
				</th>
				<td>
					<textarea
						name="description"
						cols="60"
						rows="4" ><?php echo esc_textarea($level->description); ?></textarea>
					<p class="description"><?php _e("Describe this level's advantages and options as much easier for users as you can", 'W2DC'); ?></p>
					<?php w2dc_wpmlTranslationCompleteNotice(); ?>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Eternal active period', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						name="eternal_active_period"
						type="checkbox"
						value="1"
						id="eternal_active_period"
						<?php checked($level->eternal_active_period); ?> />
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Active period', 'W2DC'); ?></label>
				</th>
				<td>
					<select name="active_interval" id="active_interval" <?php disabled($level->eternal_active_period); ?> >
						<option value="1" <?php if ($level->active_interval == 1) echo 'selected'; ?> >1</option>
						<option value="2" <?php if ($level->active_interval == 2) echo 'selected'; ?> >2</option>
						<option value="3" <?php if ($level->active_interval == 3) echo 'selected'; ?> >3</option>
						<option value="4" <?php if ($level->active_interval == 4) echo 'selected'; ?> >4</option>
						<option value="5" <?php if ($level->active_interval == 5) echo 'selected'; ?> >5</option>
						<option value="6" <?php if ($level->active_interval == 6) echo 'selected'; ?> >6</option>
					</select>
					&nbsp;
					<select name="active_period" id="active_period" <?php disabled($level->eternal_active_period); ?> >
						<option value="day" <?php if ($level->active_period == 'day') echo 'selected'; ?> ><?php _e("day(s)", "W2DC"); ?></option>
						<option value="week" <?php if ($level->active_period == 'week') echo 'selected'; ?> ><?php _e("week(s)", "W2DC"); ?></option>
						<option value="month" <?php if ($level->active_period == 'month') echo 'selected'; ?> ><?php _e("month(s)", "W2DC"); ?></option>
						<option value="year" <?php if ($level->active_period == 'year') echo 'selected'; ?> ><?php _e("year(s)", "W2DC"); ?></option>
					</select>
					<p class="description">
						<?php _e("During this period the listing will have active status.", 'W2DC'); ?>
					</p>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Change level after expiration', 'W2DC'); ?></label>
				</th>
				<td>
					<select name="change_level_id" id="change_level_id" <?php disabled($level->eternal_active_period); ?> >
						<option value="0" <?php if ($level->change_level_id == 0) echo 'selected'; ?> >- <?php _e("Select level", "W2DC"); ?> -</option>
						<?php foreach ($w2dc_instance->levels->levels_array AS $new_level): ?>
						<?php if ($level->id != $new_level->id): ?>
						<option value="<?php echo $new_level->id; ?>" <?php if ($level->change_level_id == $new_level->id) echo 'selected'; ?> ><?php echo $new_level->name; ?></option>
						<?php endif; ?>
						<?php endforeach; ?>
					</select>
					<p class="description">
						<?php _e("After expiration listing will change level automatically.", 'W2DC'); ?>
					</p>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Number of listings in package', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						id="listings_in_package"
						name="listings_in_package"
						type="text"
						size="1"
						value="<?php echo $level->listings_in_package; ?>" />
					<p class="description"><?php _e("Enter more than 1 to allow users get packages of listings. Users will be able to use listings from their package to renew, raise up and upgrade existing listings.", 'W2DC'); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Ability to raise up listings', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						name="raiseup_enabled"
						type="checkbox"
						value="1"
						<?php checked($level->raiseup_enabled); ?> />
					<p class="description"><?php _e("This option may be payment", 'W2DC'); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Sticky listings', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						name="sticky"
						type="checkbox"
						value="1"
						<?php checked($level->sticky); ?> />
					<p class="description"><?php _e("Listings of this level will be always on top", 'W2DC'); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Featured listings', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						name="featured"
						type="checkbox"
						value="1"
						<?php checked($level->featured); ?> />
					<p class="description"><?php _e("Listings of this level will be marked as featured", 'W2DC'); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Do listings have own single pages?', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						name="listings_own_page"
						type="checkbox"
						value="1"
						<?php checked($level->listings_own_page); ?> />
					<p class="description"><?php _e("When unchecked - listings info will be shown only on excerpt pages, without own detailed pages.", 'W2DC'); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Enable nofollow attribute for links to single listings pages', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						name="nofollow"
						type="checkbox"
						value="1"
						<?php checked($level->nofollow); ?> />
					<p class="description"><a href="https://support.google.com/webmasters/answer/96569"><?php _e("Description from Google Webmaster Tools", 'W2DC'); ?></a></p>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Enable google map', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						name="google_map"
						type="checkbox"
						value="1"
						<?php checked($level->google_map); ?> />
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Enable listing logo on excerpt pages', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						name="logo_enabled"
						type="checkbox"
						value="1"
						<?php checked($level->logo_enabled); ?> />
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Images number available', 'W2DC'); ?>
				</th>
				<td>
					<input
						name="images_number"
						type="text"
						size="1"
						value="<?php echo esc_attr($level->images_number); ?>" />
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Videos number available', 'W2DC'); ?>
				</th>
				<td>
					<input
						name="videos_number"
						type="text"
						size="1"
						value="<?php echo esc_attr($level->videos_number); ?>" />
				</td>
			</tr>
			
			<?php do_action('w2dc_level_html', $level); ?>
			
			<tr>
				<th scope="row">
					<label><?php _e('Locations number available', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						name="locations_number"
						type="text"
						size="1"
						value="<?php echo $level->locations_number; ?>" />
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Custom markers on google map', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						name="google_map_markers"
						type="checkbox"
						value="1"
						<?php checked($level->google_map_markers); ?> />
				</td>
			</tr>
			
			<tr>
				<th scope="row">
					<label><?php _e('Categories number available', 'W2DC'); ?></label>
				</th>
				<td>
					<input
						name="categories_number"
						id="categories_number"
						type="text"
						size="1"
						value="<?php echo esc_attr($level->categories_number); ?>"
						<?php disabled($level->unlimited_categories); ?> />

					<input
						name="unlimited_categories"
						id="unlimited_categories"
						type="checkbox"
						value="1"
						<?php checked($level->unlimited_categories); ?> />
					<?php _e('unlimited categories', 'W2DC'); ?>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Assigned categories', 'W2DC'); ?></label>
					<?php echo w2dc_get_wpml_dependent_option_description(); ?>
				</th>
				<td>
					<p class="description"><?php _e('You may define some special categories, those would be available for this level', 'W2DC'); ?></p>
					<?php w2dc_termsSelectList('categories', W2DC_CATEGORIES_TAX, $level->categories); ?>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Assigned locations', 'W2DC'); ?></label>
					<?php echo w2dc_get_wpml_dependent_option_description(); ?>
				</th>
				<td>
					<p class="description"><?php _e('You may define some special locations, those would be available for this level', 'W2DC'); ?></p>
					<?php w2dc_termsSelectList('locations', W2DC_LOCATIONS_TAX, $level->locations); ?>
				</td>
			</tr>
			<tr>
				<th scope="row">
					<label><?php _e('Assigned content fields', 'W2DC'); ?></label>
				</th>
				<td>
					<p class="description"><?php _e('You may define some special content fields, those would be available for this level', 'W2DC'); ?></p>
					<select multiple="multiple" name="content_fields[]" class="selected_terms_list w2dc-form-control w2dc-form-group" style="height: 300px">
					<option value="" <?php echo (!$level->content_fields) ? 'selected' : ''; ?>><?php _e('- Select All -', 'W2DC'); ?></option>
					<?php foreach ($content_fields AS $field): ?>
					<?php if (!$field->is_core_field): ?>
					<option value="<?php echo $field->id; ?>" <?php echo ($level->content_fields && in_array($field->id, $level->content_fields)) ? 'selected' : ''; ?>><?php echo $field->name; ?></option>
					<?php endif; ?>
					<?php endforeach; ?>
					</select>
				</td>
			</tr>
		</tbody>
	</table>
	
	<?php
	if ($level_id)
		submit_button(__('Save changes', 'W2DC'));
	else
		submit_button(__('Create level', 'W2DC'));
	?>
</form>

<?php w2dc_renderTemplate('admin_footer.tpl.php'); ?>