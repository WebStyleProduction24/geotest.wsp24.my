<div class="w2dc-content">
	<?php w2dc_renderMessages(); ?>

	<?php if (count($w2dc_instance->levels->levels_array) > 1): ?>
	<h3><?php echo sprintf(apply_filters('w2dc_create_option', __('Submit new %s in level "%s"', 'W2DC'), $w2dc_instance->current_listing), $directory->single, $w2dc_instance->current_listing->level->name); ?></h3>
	<?php endif; ?>

	<form action="<?php echo w2dc_submitUrl(array('level' => $w2dc_instance->current_listing->level->id)); ?>" method="POST">
		<input type="hidden" name="listing_id" value="<?php echo $w2dc_instance->current_listing->post->ID; ?>" />
		<input type="hidden" name="listing_id_hash" value="<?php echo md5($w2dc_instance->current_listing->post->ID . wp_salt()); ?>" />
		<?php wp_nonce_field('w2dc_submit', '_submit_nonce'); ?>

		<?php if (!is_user_logged_in() && (get_option('w2dc_fsubmit_login_mode') == 2 || get_option('w2dc_fsubmit_login_mode') == 3)): ?>
		<div class="w2dc-submit-section w2dc-submit-section-contact-info">
			<h3 class="w2dc-submit-section-label"><?php _e('User info', 'W2DC'); ?></h3>
			<div class="w2dc-submit-section-inside">
				<label class="w2dc-fsubmit-contact"><?php _e('Your Name', 'W2DC'); ?><?php if (get_option('w2dc_fsubmit_login_mode') == 2): ?><span class="w2dc-red-asterisk">*</span><?php endif; ?></label>
				<input type="text" name="w2dc_user_contact_name" value="<?php echo esc_attr($frontend_controller->w2dc_user_contact_name); ?>" class="w2dc-form-control" style="width: 100%;" />

				<label class="w2dc-fsubmit-contact"><?php _e('Your Email', 'W2DC'); ?><?php if (get_option('w2dc_fsubmit_login_mode') == 2): ?><span class="w2dc-red-asterisk">*</span><?php endif; ?></label>
				<input type="text" name="w2dc_user_contact_email" value="<?php echo esc_attr($frontend_controller->w2dc_user_contact_email); ?>" class="w2dc-form-control" style="width: 100%;" />
			</div>
		</div>
		<?php endif; ?>

		<div class="w2dc-submit-section w2dc-submit-section-title">
			<h3 class="w2dc-submit-section-label"><?php _e('Listing title', 'W2DC'); ?><span class="w2dc-red-asterisk">*</span></h3>
			<div class="w2dc-submit-section-inside">
				<input type="text" name="post_title" style="width: 100%" class="w2dc-form-control" value="<?php if ($w2dc_instance->current_listing->post->post_title != __('Auto Draft', 'W2DC')) echo esc_attr($w2dc_instance->current_listing->post->post_title); ?>" />
			</div>
		</div>

		<?php if (post_type_supports(W2DC_POST_TYPE, 'editor')): ?>
		<div class="w2dc-submit-section w2dc-submit-section-description">
			<h3 class="w2dc-submit-section-label"><?php echo $w2dc_instance->content_fields->getContentFieldBySlug('content')->name; ?><?php if ($w2dc_instance->content_fields->getContentFieldBySlug('content')->is_required): ?><span class="w2dc-red-asterisk">*</span><?php endif; ?></h3>
			<div class="w2dc-submit-section-inside">
				<?php wp_editor($w2dc_instance->current_listing->post->post_content, 'post_content', array('media_buttons' => false, 'editor_class' => 'w2dc-editor-class')); ?>
			</div>
			<?php if ($w2dc_instance->content_fields->getContentFieldBySlug('content')->description): ?><p class="w2dc-description"><?php echo $w2dc_instance->content_fields->getContentFieldBySlug('content')->description; ?></p><?php endif; ?>
		</div>
		<?php endif; ?>

		<?php if (post_type_supports(W2DC_POST_TYPE, 'excerpt')): ?>
		<div class="w2dc-submit-section w2dc-submit-section-excerpt">
			<h3 class="w2dc-submit-section-label"><?php echo $w2dc_instance->content_fields->getContentFieldBySlug('summary')->name; ?><?php if ($w2dc_instance->content_fields->getContentFieldBySlug('summary')->is_required): ?><span class="w2dc-red-asterisk">*</span><?php endif; ?></h3>
			<div class="w2dc-submit-section-inside">
				<textarea name="post_excerpt" class="w2dc-editor-class w2dc-form-control" rows="4"><?php echo esc_textarea($w2dc_instance->current_listing->post->post_excerpt)?></textarea>
			</div>
			<?php if ($w2dc_instance->content_fields->getContentFieldBySlug('summary')->description): ?><p class="w2dc-description"><?php echo $w2dc_instance->content_fields->getContentFieldBySlug('summary')->description; ?></p><?php endif; ?>
		</div>
		<?php endif; ?>
		
		<?php do_action('w2dc_create_listing_metaboxes_pre', $w2dc_instance->current_listing); ?>

		<?php if (!$w2dc_instance->current_listing->level->eternal_active_period && (get_option('w2dc_change_expiration_date') || current_user_can('manage_options'))): ?>
		<div class="w2dc-submit-section w2dc-submit-section-expiration-date">
			<h3 class="w2dc-submit-section-label"><?php _e('Listing expiration date', 'W2DC'); ?></h3>
			<div class="w2dc-submit-section-inside">
				<?php $w2dc_instance->listings_manager->listingExpirationDateMetabox($w2dc_instance->current_listing->post); ?>
			</div>
		</div>
		<?php endif; ?>

		<?php if (get_option('w2dc_listing_contact_form') && get_option('w2dc_custom_contact_email')): ?>
		<div class="w2dc-submit-section w2dc-submit-section-contact-email">
			<h3 class="w2dc-submit-section-label"><?php _e('Contact email', 'W2DC'); ?></h3>
			<div class="w2dc-submit-section-inside">
				<?php $w2dc_instance->listings_manager->listingContactEmailMetabox($w2dc_instance->current_listing->post); ?>
			</div>
		</div>
		<?php endif; ?>
		
		<?php if (get_option('w2dc_claim_functionality') && !get_option('w2dc_hide_claim_metabox')): ?>
		<div class="w2dc-submit-section w2dc-submit-section-claim">
			<h3 class="w2dc-submit-section-label"><?php _e('Listing claim', 'W2DC'); ?></h3>
			<div class="w2dc-submit-section-inside">
				<?php $w2dc_instance->listings_manager->listingClaimMetabox($w2dc_instance->current_listing->post); ?>
			</div>
		</div>
		<?php endif; ?>
	
		<?php if ($w2dc_instance->current_listing->level->categories_number > 0 || $w2dc_instance->current_listing->level->unlimited_categories): ?>
		<div class="w2dc-submit-section w2dc-submit-section-categories">
			<h3 class="w2dc-submit-section-label"><?php echo $w2dc_instance->content_fields->getContentFieldBySlug('categories_list')->name; ?><?php if ($w2dc_instance->content_fields->getContentFieldBySlug('categories_list')->is_required): ?><span class="w2dc-red-asterisk">*</span><?php endif; ?></h3>
			<div class="w2dc-submit-section-inside">
				<a href="javascript:void(0);" class="w2dc-expand-terms"><?php _e('Expand All', 'W2DC'); ?></a> | <a href="javascript:void(0);" class="w2dc-collapse-terms"><?php _e('Collapse All', 'W2DC'); ?></a>
				<div class="w2dc-categories-tree-panel w2dc-editor-class" id="<?php echo W2DC_CATEGORIES_TAX; ?>-all">
					<?php w2dc_terms_checklist($w2dc_instance->current_listing->post->ID); ?>
				</div>
				<?php if ($w2dc_instance->content_fields->getContentFieldBySlug('categories_list')->description): ?><p class="w2dc-description"><?php echo $w2dc_instance->content_fields->getContentFieldBySlug('categories_list')->description; ?></p><?php endif; ?>
			</div>
		</div>
		<?php endif; ?>
		
		<?php if (get_option('w2dc_enable_tags')): ?>
		<div class="w2dc-submit-section w2dc-submit-section-tags">
			<h3 class="w2dc-submit-section-label"><?php echo $w2dc_instance->content_fields->getContentFieldBySlug('listing_tags')->name; ?> <i>(<?php _e('select existing or type new', 'W2DC'); ?>)</i></h3>
			<div class="w2dc-submit-section-inside">
				<?php w2dc_tags_selectbox($w2dc_instance->current_listing->post->ID); ?>
				<?php if ($w2dc_instance->content_fields->getContentFieldBySlug('listing_tags')->description): ?><p class="w2dc-description"><?php echo $w2dc_instance->content_fields->getContentFieldBySlug('listing_tags')->description; ?></p><?php endif; ?>
			</div>
		</div>
		<?php endif; ?>
	
		<?php if ($w2dc_instance->content_fields->isNotCoreContentFields()): ?>
		<div class="w2dc-submit-section w2dc-submit-section-conetnt-fields">
			<div class="w2dc-submit-section-inside">
				<?php $w2dc_instance->content_fields_manager->contentFieldsMetabox($w2dc_instance->current_listing->post); ?>
			</div>
		</div>
		<?php endif; ?>
	
		<?php if ($w2dc_instance->current_listing->level->images_number > 0 || $w2dc_instance->current_listing->level->videos_number > 0): ?>
		<div class="w2dc-submit-section w2dc-submit-section-media">
			<h3 class="w2dc-submit-section-label"><?php _e('Listing Media', 'W2DC'); ?></h3>
			<div class="w2dc-submit-section-inside">
				<?php $w2dc_instance->media_manager->mediaMetabox(); ?>
			</div>
		</div>
		<?php endif; ?>
	
		<?php if ($w2dc_instance->current_listing->level->locations_number > 0): ?>
		<div class="w2dc-submit-section w2dc-submit-section-locations">
			<h3 class="w2dc-submit-section-label"><?php _e('Listing locations', 'W2DC'); ?><?php if ($w2dc_instance->content_fields->getContentFieldBySlug('address')->is_required): ?><span class="w2dc-red-asterisk">*</span><?php endif; ?></h3>
			<div class="w2dc-submit-section-inside">
				<?php if ($w2dc_instance->content_fields->getContentFieldBySlug('address')->description): ?><p class="w2dc-description"><?php echo $w2dc_instance->content_fields->getContentFieldBySlug('address')->description; ?></p><?php endif; ?>
				<?php $w2dc_instance->locations_manager->listingLocationsMetabox($w2dc_instance->current_listing->post); ?>
			</div>
		</div>
		<?php endif; ?>
		
		<?php do_action('w2dc_create_listing_metaboxes_post', $w2dc_instance->current_listing); ?>

		<?php if (get_option('w2dc_enable_recaptcha')): ?>
		<div class="w2dc-submit-section-adv">
			<?php echo w2dc_recaptcha(); ?>
		</div>
		<?php endif; ?>

		<?php
		if ($tos_page = w2dc_get_wpml_dependent_option('w2dc_tospage')) : ?>
		<div class="w2dc-submit-section-adv">
			<label><input type="checkbox" name="w2dc_tospage" value="1" /> <?php printf(__('I agree to the ', 'W2DC') . '<a href="%s" target="_blank">%s</a>', get_permalink($tos_page), __('Terms of Services', 'W2DC')); ?></label>
		</div>
		<?php endif; ?>

		<?php require_once(ABSPATH . 'wp-admin/includes/template.php'); ?>
		<?php submit_button(sprintf(__('Submit new %s', 'W2DC'), $directory->single), 'w2dc-btn w2dc-btn-primary')?>
	</form>
</div>