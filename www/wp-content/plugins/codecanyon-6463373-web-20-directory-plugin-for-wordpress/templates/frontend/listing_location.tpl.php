<article class="w2dc-listing-location" id="post-<?php echo $location->id; ?>" data-location-id="<?php echo $location->id; ?>" style="height: auto;">
	<div class="w2dc-listing-location-content">
		<?php
		if ($listing->logo_image) {
			$img_src = $listing->get_logo_url(array(150, 150));
		} else {
			$img_src = get_option('w2dc_nologo_url');
		}
	
		?>
		<div class="w2gm-map-listing-logo-wrap">
			<figure class="w2dc-map-listing-logo">
				<div class="w2dc-map-listing-logo-img-wrap">
					<div style="background-image: url('<?php echo $img_src; ?>');" class="w2dc-map-listing-logo-img">
						<img src="<?php echo $img_src; ?>" />
					</div>
				</div>
			</figure>
		</div>
		<div class="w2dc-map-listing-content-wrap">
			<header class="w2dc-map-listing-header">
				<h2><?php echo $listing->title(); ?> <?php do_action('w2dc_listing_title_html', $listing, false); ?></h2>
			</header>
			<?php $listing->renderMapSidebarContentFields($location); ?>
		</div>
	</div>
	<?php 
		if ($show_directions_button || $show_readmore_button):
			if (!$show_directions_button || !$show_readmore_button) {
				$buttons_class = 'w2dc-map-info-window-buttons-single';
			} else {
				$buttons_class = 'w2dc-map-info-window-buttons';
			}
	?>
	<div class="<?php echo $buttons_class; ?> w2dc-clearfix">
		<?php if ($show_directions_button): ?>
		<a href="https://www.google.com/maps/dir/Current+Location/<?php echo $location->map_coords_1; ?>,<?php echo $location->map_coords_2; ?>" target="_blank" class="w2dc-btn w2dc-btn-primary"><?php _e('« Directions', 'W2DC'); ?></a>
		<?php endif; ?>
		<?php if ($show_readmore_button): ?>
		<a href="javascript:void(0);" data-location-id="<?php echo $location->id; ?>" class="w2dc-btn w2dc-btn-primary w2dc-show-on-map"><?php _e('On map »', 'W2DC')?></a>
		<?php endif; ?>
	</div>
	<?php endif; ?>
</article>