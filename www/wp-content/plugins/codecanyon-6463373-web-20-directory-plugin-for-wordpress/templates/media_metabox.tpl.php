<?php if ($listing->level->images_number): ?>
<script>
	var images_number = <?php echo $listing->level->images_number; ?>;

	(function($) {
		"use strict";

		window.w2dc_image_attachment_tpl = function(attachment_id, uploaded_file, title) {
			var image_attachment_tpl = `
				<div class="w2dc-attached-item">
					<input type="hidden" name="attached_image_id[]" value="`+attachment_id+`" />
					<a href="`+uploaded_file+`" data-lightbox="listing_images" class="w2dc-attached-item-img" style="background-image: url(`+uploaded_file+`)"></a>
					<div class="w2dc-attached-item-input">
						<input type="text" name="attached_image_title[]" class="w2dc-form-control" value="`+title+`" placeholder="<?php esc_attr_e('optional image title', 'W2DC'); ?>" />
					</div>
					<?php if ($listing->level->logo_enabled): ?>
					<div class="w2dc-attached-item-logo w2dc-radio">
						<label>
							<input type="radio" name="attached_image_as_logo" value="`+attachment_id+`"> <?php _e('set this image as logo', 'W2DC'); ?>
						</label>
					</div>
					<?php endif; ?>
					<div class="w2dc-attached-item-delete w2dc-fa w2dc-fa-trash-o" title="<?php esc_attr_e("remove", "W2DC"); ?>"></div>
				</div>`;

			return image_attachment_tpl;
		};

		window.w2dc_check_images_attachments_number = function() {
			if (images_number > $("#w2dc-images-upload-wrapper .w2dc-attached-item").length) {
				<?php if (is_admin()): ?>
				$("#w2dc-admin-upload-functions").show();
				<?php else: ?>
				$(".w2dc-upload-item").show();
				<?php endif; ?>
			} else {
				<?php if (is_admin()): ?>
				$("#w2dc-admin-upload-functions").hide();
				<?php else: ?>
				$(".w2dc-upload-item").hide();
				<?php endif; ?>
			}
		}

		$(function() {
			w2dc_check_images_attachments_number();

			$("#w2dc-attached-images-wrapper").on("click", ".w2dc-attached-item-delete", function() {
				$(this).parents(".w2dc-attached-item").remove();
	
				w2dc_check_images_attachments_number();
			});

			<?php if (!is_admin()): ?>
			$(document).on("click", ".w2dc-upload-item-button", function(e){
				e.preventDefault();
			
				$(this).parent().find("input").click();
			});

			$('.w2dc-upload-item').fileupload({
				sequentialUploads: true,
				dataType: 'json',
				url: '<?php echo admin_url('admin-ajax.php?action=w2dc_upload_image&post_id='.$listing->post->ID.'&_wpnonce='.wp_create_nonce('upload_images')); ?>',
				dropZone: $('.w2dc-drop-attached-item'),
				add: function (e, data) {
					var jqXHR = data.submit();
				},
				send: function (e, data) {
					w2dc_add_iloader_on_element($(this).find(".w2dc-drop-attached-item"));
				},
				done: function(e, data) {
					var result = data.result;
					if (result.uploaded_file) {
						$(this).before(w2dc_image_attachment_tpl(result.attachment_id, result.uploaded_file, data.files[0].name));
						w2dc_custom_input_controls();
					} else {
						$(this).find(".w2dc-drop-attached-item").append("<p>"+result.error_msg+"</p>");
					}
					$(this).find(".w2dc-drop-zone").show();
					w2dc_delete_iloader_from_element($(this).find(".w2dc-drop-attached-item"));

					w2dc_check_images_attachments_number();
				}
			});
			<?php endif; ?>
		});
	})(jQuery);
</script>

<div id="w2dc-images-upload-wrapper" class="w2dc-content">
	<h4><?php _e('Listing images', 'W2DC'); ?></h4>

	<div id="w2dc-attached-images-wrapper">
		<?php foreach ($listing->images AS $attachment_id=>$attachment): ?>
		<?php $src = wp_get_attachment_image_src($attachment_id, array(250, 250)); ?>
		<?php $src_full = wp_get_attachment_image_src($attachment_id, 'full'); ?>
		<div class="w2dc-attached-item">
			<input type="hidden" name="attached_image_id[]" value="<?php echo $attachment_id; ?>" />
			<a href="<?php echo $src_full[0]; ?>" data-lightbox="listing_images" class="w2dc-attached-item-img" style="background-image: url('<?php echo $src[0]; ?>')"></a>
			<div class="w2dc-attached-item-input">
				<input type="text" name="attached_image_title[]" class="w2dc-form-control" value="<?php esc_attr_e($attachment['post_title']); ?>" placeholder="<?php esc_attr_e('optional image title', 'W2DC'); ?>" />
			</div>
			<?php if ($listing->level->logo_enabled): ?>
			<div class="w2dc-attached-item-logo w2dc-radio">
				<label>
					<input type="radio" name="attached_image_as_logo" value="<?php echo $attachment_id; ?>" <?php checked($listing->logo_image, $attachment_id); ?>> <?php _e('set this image as logo', 'W2DC'); ?>
				</label>
			</div>
			<?php endif; ?>
			<div class="w2dc-attached-item-delete w2dc-fa w2dc-fa-trash-o" title="<?php _e("delete", "W2DC"); ?>"></div>
		</div>
		<?php endforeach; ?>
		<?php if (!is_admin()): ?>
		<div class="w2dc-upload-item">
			<div class="w2dc-drop-attached-item">
				<div class="w2dc-drop-zone">
					<?php _e("Drop here", "W2DC"); ?>
					<button class="w2dc-upload-item-button w2dc-btn w2dc-btn-primary"><?php _e("Browse", "W2DC"); ?></button>
					<input type="file" name="browse_file" multiple />
				</div>
			</div>
		</div>
		<?php endif; ?>
	</div>
	<div class="w2dc-clearfix"></div>

	<?php if (is_admin() && current_user_can('upload_files')): ?>
	<script>
		(function($) {
			"use strict";
		
			$(function() {
				$('#w2dc-admin-upload-image').click(function(event) {
					event.preventDefault();
			
					var frame = wp.media({
						title : '<?php echo esc_js(sprintf(__('Upload image (%d maximum)', 'W2DC'), $listing->level->images_number)); ?>',
						multiple : true,
						library : { type : 'image'},
						button : { text : '<?php echo esc_js(__('Insert', 'W2DC')); ?>'},
					});
					frame.on('select', function() {
						var selection = frame.state().get('selection');
						selection.each(function(attachment) {
							attachment = attachment.toJSON();
							if (attachment.type == 'image') {
								if (images_number > $("#w2dc-attached-images-wrapper .w2dc-attached-item").length) {
									w2dc_ajax_loader_show();

									$.ajax({
										type: "POST",
										url: w2dc_js_objects.ajaxurl,
										dataType: 'json',
										data: {
											'action': 'w2dc_upload_media_image',
											'attachment_id': attachment.id,
											'post_id': <?php echo $listing->post->ID; ?>,
											'_wpnonce': '<?php echo wp_create_nonce('upload_images'); ?>',
										},
										attachment_id: attachment.id,
										attachment_url: attachment.sizes.full.url,
										attachment_title: attachment.title,
										success: function (response_from_the_action_function){
										$("#w2dc-attached-images-wrapper").append(w2dc_image_attachment_tpl(this.attachment_id, this.attachment_url, this.attachment_title));
										w2dc_check_images_attachments_number();
										
										w2dc_ajax_loader_hide();
										}
									});
								}
							}
						});
					});
					frame.open();
				});
			});
		})(jQuery);
	</script>
	<div id="w2dc-admin-upload-functions">
		<div class="w2dc-upload-option">
			<input
				type="button"
				id="w2dc-admin-upload-image"
				class="w2dc-btn w2dc-btn-primary"
				value="<?php esc_attr_e('Upload image', 'W2DC'); ?>" />
		</div>
	</div>
	<?php endif; ?>
</div>
<?php endif; ?>


<?php if ($listing->level->videos_number): ?>
<script>
	var videos_number = <?php echo $listing->level->videos_number; ?>;

	(function($) {
		"use strict";

		window.w2dc_video_attachment_tpl = function(video_id, image_url) {
			var video_attachment_tpl = `
				<div class="w2dc-attached-item">
				<input type="hidden" name="attached_video_id[]" value="`+video_id+`" />
				<div class="w2dc-attached-item-img" style="background-image: url(`+image_url+`)"></div>
				<div class="w2dc-attached-item-delete w2dc-fa w2dc-fa-trash-o" title="<?php _e("delete", "W2DC"); ?>"></div>
			</div>`;

			return video_attachment_tpl;
		};

		window.w2dc_check_videos_attachments_number = function() {
			if (videos_number > $("#w2dc-attached-videos-wrapper .w2dc-attached-item").length) {
				$(".w2dc-attach-videos-functions").show();
			} else {
				$(".w2dc-attach-videos-functions").hide();
			}
		}

		$(function() {
			w2dc_check_videos_attachments_number();

			$("#w2dc-attached-videos-wrapper").on("click", ".w2dc-attached-item-delete", function() {
				$(this).parents(".w2dc-attached-item").remove();
	
				w2dc_check_videos_attachments_number();
			});
		});
	})(jQuery);
</script>

<div id="w2dc-video-attach-wrapper" class="w2dc-content">
	<h4><?php _e("Listing videos", "W2DC"); ?></h4>
	
	<div id="w2dc-attached-videos-wrapper">
		<?php foreach ($listing->videos AS $video): ?>
		<div class="w2dc-attached-item">
			<input type="hidden" name="attached_video_id[]" value="<?php echo $video['id']; ?>" />
			<?php
			if (strlen($video['id']) == 11) {
				$image_url = "http://i.ytimg.com/vi/" . $video['id'] . "/0.jpg";
			} elseif (strlen($video['id']) == 8 || strlen($video['id']) == 9) {
				$data = file_get_contents("http://vimeo.com/api/v2/video/" . $video['id'] . ".json");
				$data = json_decode($data);
				$image_url = $data[0]->thumbnail_medium;
			} ?>
			<div class="w2dc-attached-item-img" style="background-image: url('<?php echo $image_url; ?>')"></div>
			<div class="w2dc-attached-item-delete w2dc-fa w2dc-fa-trash-o" title="<?php _e("delete", "W2DC"); ?>"></div>
		</div>
		<?php endforeach; ?>
	</div>
	<div class="w2dc-clearfix"></div>

	<script>
		(function($) {
			"use strict";
		
			window.attachVideo = function() {
				if ($("#w2dc-attach-video-input").val()) {
					var regExp_youtube = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
					var regExp_vimeo = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
					var matches_youtube = $("#w2dc-attach-video-input").val().match(regExp_youtube);
					var matches_vimeo = $("#w2dc-attach-video-input").val().match(regExp_vimeo);
					if (matches_youtube && matches_youtube[2].length == 11) {
						var video_id = matches_youtube[2];
						var image_url = 'http://i.ytimg.com/vi/'+video_id+'/0.jpg';
						$("#w2dc-attached-videos-wrapper").append(w2dc_video_attachment_tpl(video_id, image_url));

						w2dc_check_videos_attachments_number();
					} else if (matches_vimeo && (matches_vimeo[3].length == 8 || matches_vimeo[3].length == 9)) {
						var video_id = matches_vimeo[3];
						var url = "//vimeo.com/api/v2/video/" + video_id + ".json?callback=showVimeoThumb";
					    var script = document.createElement('script');
					    script.src = url;
					    $("#w2dc-attach-videos-functions").before(script);
					} else {
						alert("<?php esc_attr_e('Wrong URL or this video is unavailable', 'W2DC'); ?>");
					}
				}
			};

			window.showVimeoThumb = function(data){
				var video_id = data[0].id;
			    var image_url = data[0].thumbnail_medium;
			    $("#w2dc-attached-videos-wrapper").append(w2dc_video_attachment_tpl(video_id, image_url));

			    w2dc_check_videos_attachments_number();
			};
		})(jQuery);
	</script>
	<div id="w2dc-attach-videos-functions">
		<div class="w2dc-upload-option">
			<label><?php _e('Enter full YouTube or Vimeo video link', 'W2DC'); ?></label>
		</div>
		<div class="w2dc-upload-option">
			<input type="text" id="w2dc-attach-video-input" class="w2dc-form-control" placeholder="https://youtu.be/XXXXXXXXXXXX" />
		</div>
		<div class="w2dc-upload-option">
			<input
				type="button"
				class="w2dc-btn w2dc-btn-primary"
				onclick="return attachVideo(); "
				value="<?php esc_attr_e('Attach video', 'W2DC'); ?>" />
		</div>
	</div>
</div>
<?php endif; ?>