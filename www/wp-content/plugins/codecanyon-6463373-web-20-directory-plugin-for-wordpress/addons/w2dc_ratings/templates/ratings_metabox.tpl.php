<?php if (get_option('w2dc_manage_ratings') || current_user_can('edit_others_posts')): ?>
<script>
	jQuery(document).ready(function($) {
		$("#w2dc-flush-all-ratings").on('click', function() {
			if (confirm('<?php echo esc_js(__('Are you sure you want to flush all ratings of this listing?', 'W2DC')); ?>')) {
				w2dc_ajax_loader_show();
				$.ajax({
					type: "POST",
					url: w2dc_js_objects.ajaxurl,
					data: {'action': 'w2dc_flush_ratings', 'post_id': <?php echo $listing->post->ID; ?>},
					success: function(){
						$(".w2dc-ratings-counts").html('0');
						$(".w2dc-admin-avgvalue").remove();
					},
					complete: function() {
						w2dc_ajax_loader_hide();
					}
				});
			    
			}
		});
	});
</script>
<?php endif; ?>
<div class="w2dc-content w2dc-ratings-metabox">
	<div class="w2dc-admin-avgvalue">
		<span class="w2dc-admin-stars">
			<?php echo _e('Average', 'W2DC'); ?>
		</span>
		<?php w2dc_renderTemplate(array(W2DC_RATINGS_TEMPLATES_PATH, 'avg_rating.tpl.php'), array('listing' => $listing, 'meta_tags' => false, 'active' => false, 'show_avg' => true)); ?>
	</div>
	<?php foreach ($total_counts AS $rating=>$counts): ?>
	<div class="w2dc-admin-rating">
		<span class="w2dc-admin-stars">
			<?php echo $rating; ?> <?php echo _n('Star ', 'Stars', $rating, 'W2DC'); ?>
		</span>
		<div class="w2dc-rating">
			<div class="w2dc-rating-stars">
				<label class="w2dc-rating-icon w2dc-fa <?php echo ($rating >= 5) ? 'w2dc-fa-star' : 'w2dc-fa-star-o' ?>"></label>
				<label class="w2dc-rating-icon w2dc-fa <?php echo ($rating >= 4) ? 'w2dc-fa-star' : 'w2dc-fa-star-o' ?>"></label>
				<label class="w2dc-rating-icon w2dc-fa <?php echo ($rating >= 3) ? 'w2dc-fa-star' : 'w2dc-fa-star-o' ?>"></label>
				<label class="w2dc-rating-icon w2dc-fa <?php echo ($rating >= 2) ? 'w2dc-fa-star' : 'w2dc-fa-star-o' ?>"></label>
				<label class="w2dc-rating-icon w2dc-fa <?php echo ($rating >= 1) ? 'w2dc-fa-star' : 'w2dc-fa-star-o' ?>"></label>
			</div>
		</div>
	 	&nbsp;&nbsp; - &nbsp;&nbsp;<span class="w2dc-ratings-counts"><?php echo $counts; ?></span>
	 </div>
	<?php endforeach; ?>
	
	<?php if (get_option('w2dc_manage_ratings') || current_user_can('edit_others_posts')): ?>
	<br />
	<input id="w2dc-flush-all-ratings" type="button" class="w2dc-btn w2dc-btn-primary" onClick="" value="<?php esc_attr_e('Flush all ratings', 'W2DC'); ?>" />
	<?php endif; ?>
</div>