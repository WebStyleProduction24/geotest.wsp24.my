<div class="w2dc-content">
<?php if (!$static_image): ?>
	<script>
		w2dc_map_markers_attrs_array.push(new w2dc_map_markers_attrs('<?php echo $map_id; ?>', eval(<?php echo $locations_options; ?>), <?php echo ($enable_radius_circle) ? 1 : 0; ?>, <?php echo ($enable_clusters) ? 1 : 0; ?>, <?php echo ($show_summary_button) ? 1 : 0; ?>, <?php echo ($show_readmore_button) ? 1 : 0; ?>, <?php echo ($draw_panel) ? 1 : 0; ?>, '<?php echo esc_js($map_style_name); ?>', <?php echo ($enable_full_screen) ? 1 : 0; ?>, <?php echo ($enable_wheel_zoom) ? 1 : 0; ?>, <?php echo ($enable_dragging_touchscreens) ? 1 : 0; ?>, <?php echo ($center_map_onclick) ? 1 : 0; ?>, <?php echo $map_args; ?>));
	</script>

	<?php
	if ($search_form) {
		$search_form = new w2dc_search_map_form($map_id, $controller, $args, $directories, $listings_content);
	}
	?>
	<div id="w2dc-maps-canvas-wrapper-<?php echo $map_id; ?>" class="w2dc-maps-canvas-wrapper <?php if ($search_form && $search_form->isCategoriesOrKeywords()) echo 'w2dc-map-search-input-enabled'; ?> <?php if ($sticky_scroll):?>w2dc-sticky-scroll<?php endif; ?>" data-id="<?php echo $map_id; ?>" <?php if ($sticky_scroll_toppadding):?>data-toppadding="<?php echo $sticky_scroll_toppadding; ?>"<?php endif; ?> data-height="<?php echo $height; ?>">
		<?php
		if ($search_form) {
			echo $search_form->display();
		} ?>
		<div id="w2dc-maps-canvas-<?php echo $map_id; ?>" class="w2dc-maps-canvas <?php if (!empty($args['search_on_map_open'])) echo 'w2dc-sidebar-open'; ?>" <?php if ($custom_home): ?>data-custom-home="1"<?php endif; ?> data-shortcode-hash="<?php echo $map_id; ?>" style="<?php if ($width) echo 'max-width:' . $width . 'px'; ?>; height: <?php if ($height) { if ($height == '100%') echo '100%'; else echo $height.'px'; } else echo '300px'; ?>"></div>
	</div>

	<?php if ($show_directions): ?>
	<div class="w2dc-row w2dc-form-group">
		<?php if (get_option('w2dc_directions_functionality') == 'builtin'): ?>
		<div class="w2dc-col-md-12">
			<label class="w2dc-control-label"><?php _e('Get directions from:', 'W2DC'); ?></label>
			<div class="w2dc-has-feedback">
				<input type="text" id="from_direction_<?php echo $map_id; ?>" class="w2dc-form-control <?php if (get_option('w2dc_address_autocomplete')): ?>w2dc-field-autocomplete<?php endif; ?>" placeholder="<?php esc_attr_e('Enter address or zip code', 'W2DC'); ?>" />
				<?php if (get_option('w2dc_address_geocode')): ?>
				<span class="w2dc-get-location w2dc-form-control-feedback w2dc-glyphicon w2dc-glyphicon-screenshot"></span>
				<?php endif; ?>
			</div>
		</div>
		<div class="w2dc-col-md-12">
			<?php $i = 1; ?>
			<?php foreach ($locations_array AS $location): ?>
			<div class="w2dc-radio">
				<label>
					<input type="radio" name="select_direction" class="select_direction_<?php echo $map_id; ?>" <?php checked($i, 1); ?> value="<?php esc_attr_e($location->map_coords_1.' '.$location->map_coords_2); ?>" />
					<?php 
					if ($address = $location->getWholeAddress(false))
						echo $address;
					else 
						echo $location->map_coords_1.' '.$location->map_coords_2;
					?>
				</label>
			</div>
			<?php endforeach; ?>
		</div>
		<div class="w2dc-col-md-12">
			<input type="button" class="direction_button front-btn w2dc-btn w2dc-btn-primary" id="get_direction_button_<?php echo $map_id; ?>" value="<?php esc_attr_e('Get directions', 'W2DC'); ?>">
		</div>
		<div class="w2dc-col-md-12">
			<div id="route_<?php echo $map_id; ?>" class="w2dc-maps-direction-route"></div>
		</div>
		<?php elseif (get_option('w2dc_directions_functionality') == 'google'): ?>
		<label class="w2dc-col-md-12 w2dc-control-label"><?php _e('directions to:', 'W2DC'); ?></label>
		<form action="//maps.google.com" target="_blank">
			<input type="hidden" name="saddr" value="Current Location" />
			<div class="w2dc-col-md-12">
				<?php $i = 1; ?>
				<?php foreach ($locations_array AS $location): ?>
				<div class="w2dc-radio">
					<label>
						<input type="radio" name="daddr" class="select_direction_<?php echo $map_id; ?>" <?php checked($i, 1); ?> value="<?php esc_attr_e($location->map_coords_1.','.$location->map_coords_2); ?>" />
						<?php 
						if ($address = $location->getWholeAddress(false))
							echo $address;
						else 
							echo $location->map_coords_1.' '.$location->map_coords_2;
						?>
					</label>
				</div>
				<?php endforeach; ?>
			</div>
			<div class="w2dc-col-md-12">
				<input class="w2dc-btn w2dc-btn-primary" type="submit" value="<?php esc_attr_e('Get directions', 'W2DC'); ?>" />
			</div>
		</form>
		<?php endif; ?>
	</div>
	<?php endif; ?>
<?php else: ?>
	<img src="//maps.googleapis.com/maps/api/staticmap?size=795x350&<?php foreach ($locations_array  AS $location) { if ($location->map_coords_1 != 0 && $location->map_coords_2 != 0) { ?>markers=<?php if (W2DC_MAP_ICONS_URL && $location->map_icon_file) { ?>icon:<?php echo W2DC_MAP_ICONS_URL . 'icons/' . urlencode($location->map_icon_file) . '%7C'; }?><?php echo $location->map_coords_1 . ',' . $location->map_coords_2 . '&'; }} ?><?php if ($map_zoom) echo 'zoom=' . $map_zoom; ?><?php if (get_option('w2dc_google_api_key')) echo '&key='.get_option('w2dc_google_api_key'); ?>" />
<?php endif; ?>
</div>