<?php 

class w2dc_submit_controller extends w2dc_frontend_controller {
	public $levels = array();
	public $template_args = array();

	public function init($args = array()) {
		global $w2dc_instance, $w2dc_fsubmit_instance;

		parent::init($args);
		
		$shortcode_atts = array_merge(array(
				'show_period' => 1,
				'show_sticky' => 1,
				'show_featured' => 1,
				'show_categories' => 1,
				'show_locations' => 1,
				'show_maps' => 1,
				'show_images' => 1,
				'show_videos' => 1,
				'columns_same_height' => 1,
				'columns' => 3,
				'levels' => null,
				'directory' => null,
		), $args);
		
		$this->args = $shortcode_atts;
		
		if ($this->args['directory']) {
			$directory = $w2dc_instance->directories->getDirectoryById($this->args['directory']);
			$w2dc_instance->setCurrentDirectory($directory);
		} else {
			$directory = $w2dc_instance->current_directory;
		}
		$this->template_args['directory'] = $directory;
		
		$this->levels = $w2dc_instance->levels->levels_array;
		if ($this->args['levels']) {
			$levels_ids = array_filter(array_map('trim', explode(',', $this->args['levels'])));
			$this->levels = array_intersect_key($w2dc_instance->levels->levels_array, array_flip($levels_ids));
		} elseif ($directory->levels) {
			$this->levels = array_intersect_key($w2dc_instance->levels->levels_array, array_flip($directory->levels));
		}

		$this->levels = apply_filters('w2dc_submission_levels', $this->levels);

		if (
			(!isset($_GET['level']) || !is_numeric($_GET['level']) || !array_key_exists($_GET['level'], $w2dc_instance->levels->levels_array))
			&&
			count($w2dc_instance->levels->levels_array) > 1
			&&
			(!get_option('w2dc_hide_choose_level_page') || !$w2dc_instance->listings_packages->is_any_listing_to_create())
		) {
			$this->template = array(W2DC_FSUBMIT_TEMPLATES_PATH, 'submitlisting_step_level.tpl.php');
		} elseif (count($w2dc_instance->levels->levels_array)) {
			if (count($w2dc_instance->levels->levels_array) == 1) {
				$_levels = array_keys($w2dc_instance->levels->levels_array);
				$level = array_shift($_levels);
			} elseif (get_option('w2dc_hide_choose_level_page') && ($level_id = $w2dc_instance->listings_packages->is_any_listing_to_create())) {
				$level = $level_id;
			} elseif (isset($_GET['level']) && is_numeric($_GET['level']) && array_key_exists($_GET['level'], $w2dc_instance->levels->levels_array)) {
				$level = $_GET['level'];
			} else {
				$level = $w2dc_instance->levels->getDefaultLevel();;
			}
			
			if (!array_key_exists($level, $this->levels)) {
				w2dc_addMessage(__('You are not allowed to submit in this level!', 'W2DC'), 'error');
				wp_redirect(w2dc_submitUrl());
			}

			if (get_option('w2dc_fsubmit_login_mode') == 1 && !is_user_logged_in()) {
				if (w2dc_get_wpml_dependent_option('w2dc_submit_login_page') && w2dc_get_wpml_dependent_option('w2dc_submit_login_page') != get_the_ID()) {
					$url = get_permalink(w2dc_get_wpml_dependent_option('w2dc_submit_login_page'));
					$url = add_query_arg('redirect_to', urlencode(w2dc_submitUrl(array('level' => $level))), $url);
					wp_redirect($url);
				} else {
					add_action('wp_enqueue_scripts', array($w2dc_fsubmit_instance, 'enqueue_login_scripts_styles'));
					$this->template = array(W2DC_FSUBMIT_TEMPLATES_PATH, 'login_form.tpl.php');
				}
			} else {
				$this->w2dc_user_contact_name = '';
				$this->w2dc_user_contact_email = '';
				if (!isset($_POST['listing_id']) || !isset($_POST['listing_id_hash']) || !is_numeric($_POST['listing_id']) || md5($_POST['listing_id'] . wp_salt()) != $_POST['listing_id_hash']) {
					// Create Auto-Draft
					$new_post_args = array(
							'post_title' => __('Auto Draft', 'W2DC'),
							'post_type' => W2DC_POST_TYPE,
							'post_status' => 'auto-draft'
					);
					if ($new_post_id = wp_insert_post($new_post_args)) {
						$w2dc_instance->listings_manager->current_listing = new w2dc_listing($level);
						$w2dc_instance->listings_manager->saveInitialDraft($new_post_id);

						$listing = w2dc_getCurrentListingInAdmin();
					}
				} elseif (isset($_POST['submit']) && (isset($_POST['_submit_nonce']) && wp_verify_nonce($_POST['_submit_nonce'], 'w2dc_submit'))) {
					// This is existed Auto-Draft
					$listing_id = $_POST['listing_id'];

					$listing = new w2dc_listing();
					$listing->loadListingFromPost($listing_id);
					$w2dc_instance->current_listing = $listing;
					$w2dc_instance->listings_manager->current_listing = $listing;

					$errors = array();

					if (!is_user_logged_in() && (get_option('w2dc_fsubmit_login_mode') == 2 || get_option('w2dc_fsubmit_login_mode') == 3)) {
						if (get_option('w2dc_fsubmit_login_mode') == 2)
							$required = '|required';
						else
							$required = '';
						$w2dc_form_validation = new w2dc_form_validation();
						$w2dc_form_validation->set_rules('w2dc_user_contact_name', __('Contact Name', 'W2DC'), $required);
						$w2dc_form_validation->set_rules('w2dc_user_contact_email', __('Contact Email', 'W2DC'), 'valid_email' . $required);
						if (!$w2dc_form_validation->run()) {
							$user_valid = false;
							$errors[] = $w2dc_form_validation->error_array();
						} else
							$user_valid = true;

						$this->w2dc_user_contact_name = $w2dc_form_validation->result_array('w2dc_user_contact_name');
						$this->w2dc_user_contact_email = $w2dc_form_validation->result_array('w2dc_user_contact_email');
					}

					if (!isset($_POST['post_title']) || !trim($_POST['post_title']) || $_POST['post_title'] == __('Auto Draft', 'W2DC')) {
						$errors[] = __('Listing title field required', 'W2DC');
						$post_title = __('Auto Draft', 'W2DC');
					} else 
						$post_title = trim($_POST['post_title']);

					$post_categories_ids = array();
					if ($listing->level->categories_number > 0 || $listing->level->unlimited_categories) {
						if ($post_categories_ids = $w2dc_instance->categories_manager->validateCategories($listing->level, $_POST, $errors)) {
							foreach ($post_categories_ids AS $key=>$id)
								$post_categories_ids[$key] = intval($id);
						}
						wp_set_object_terms($listing->post->ID, $post_categories_ids, W2DC_CATEGORIES_TAX);
					}
					
					if (get_option('w2dc_enable_tags')) {
						if ($post_tags_ids = $w2dc_instance->categories_manager->validateTags($_POST, $errors)) {
							foreach ($post_tags_ids AS $key=>$id)
								$post_tags_ids[$key] = intval($id);
						}
						wp_set_object_terms($listing->post->ID, $post_tags_ids, W2DC_TAGS_TAX);
					}

					$w2dc_instance->content_fields->saveValues($listing->post->ID, $post_categories_ids, $listing->level->id, $errors, $_POST);

					if ($listing->level->locations_number) {
						if ($validation_results = $w2dc_instance->locations_manager->validateLocations($listing->level, $errors)) {
							$w2dc_instance->locations_manager->saveLocations($listing->level, $listing->post->ID, $validation_results);
						}
					}
						
					if ($listing->level->images_number || $listing->level->videos_number) {
						if ($validation_results = $w2dc_instance->media_manager->validateAttachments($listing->level, $errors))
							$w2dc_instance->media_manager->saveAttachments($listing->level, $listing->post->ID, $validation_results);
					}
					
					if (get_option('w2dc_listing_contact_form') && get_option('w2dc_custom_contact_email')) {
						$w2dc_form_validation = new w2dc_form_validation();
						$w2dc_form_validation->set_rules('contact_email', __('Contact email', 'W2DC'), 'valid_email');
					
						if (!$w2dc_form_validation->run()) {
							$errors[] = $w2dc_form_validation->error_array();
						} else {
							update_post_meta($listing->post->ID, '_contact_email', $w2dc_form_validation->result_array('contact_email'));
						}
					}

					if (!w2dc_is_recaptcha_passed())
						$errors[] = esc_attr__("Anti-bot test wasn't passed!", 'W2DC');

					// adapted for WPML
					global $sitepress;
					if (
					(
						(function_exists('wpml_object_id_filter') && $sitepress && $sitepress->get_default_language() != ICL_LANGUAGE_CODE && ($tos_page = get_option('w2dc_tospage_'.ICL_LANGUAGE_CODE)))
						||
						($tos_page = get_option('w2dc_tospage'))
					)
					&&
					(!isset($_POST['w2dc_tospage']) || !$_POST['w2dc_tospage'])
					)
						$errors[] = __('Please check the box to agree the Terms of Services.', 'W2DC');

					if ($errors) {
						$postarr = array(
								'ID' => $listing_id,
								'post_title' => apply_filters('w2dc_title_save_pre', $post_title, $listing),
								'post_name' => apply_filters('w2dc_name_save_pre', '', $listing),
								'post_content' => (isset($_POST['post_content']) ? $_POST['post_content'] : ''),
								'post_excerpt' => (isset($_POST['post_excerpt']) ? $_POST['post_excerpt'] : ''),
								'post_type' => W2DC_POST_TYPE,
						);
						$result = wp_update_post($postarr, true);
						if (is_wp_error($result))
							$errors[] = $result->get_error_message();
							
						foreach ($errors AS $error)
							w2dc_addMessage($error, 'error');
					} else {
						if (!is_user_logged_in() && (get_option('w2dc_fsubmit_login_mode') == 2 || get_option('w2dc_fsubmit_login_mode') == 3 || get_option('w2dc_fsubmit_login_mode') == 4)) {
							if (email_exists($this->w2dc_user_contact_email)) {
								$user = get_user_by('email', $this->w2dc_user_contact_email);
								$post_author_id = $user->ID;
								$post_author_username = $user->user_login;
							} else {
								$user_contact_name = trim($this->w2dc_user_contact_name);
								if ($user_contact_name) {
									$display_author_name = $user_contact_name;
									if (get_user_by('login', $user_contact_name))
										$login_author_name = $user_contact_name . '_' . time();
									else
										$login_author_name = $user_contact_name;
								} else {
									$display_author_name = 'Author_' . time();
									$login_author_name = 'Author_' . time();
								}
								if ($this->w2dc_user_contact_email)
									$author_email = $this->w2dc_user_contact_email;
								else
									$author_email = '';
								
								$password = wp_generate_password(6, false);
								
								$post_author_id = wp_insert_user(array(
										'display_name' => $display_author_name,
										'user_login' => $login_author_name,
										'user_email' => $author_email,
										'user_pass' => $password
								));
								$post_author_username = $login_author_name;
								
								if (!is_wp_error($post_author_id) && $author_email) {
									// WP auto-login
									wp_set_current_user($post_author_id);
									wp_set_auth_cookie($post_author_id);
									do_action('wp_login', $post_author_username, get_userdata($post_author_id));
	
									if (get_option('w2dc_newuser_notification')) {
										$subject = __('Registration notification', 'W2DC');
										$body = str_replace('[author]', $display_author_name,
												str_replace('[listing]', $post_title,
												str_replace('[login]', $login_author_name,
												str_replace('[password]', $password,
										get_option('w2dc_newuser_notification')))));
	
										add_action('wp_mail_failed', 'w2dc_error_log');
										if (w2dc_mail($author_email, $subject, $body))
											w2dc_addMessage(__('New user was created and added to the site, login and password were sent to provided contact email.', 'W2DC'));
									}
								}
							}

						} elseif (is_user_logged_in())
							$post_author_id = get_current_user_id();
						else
							$post_author_id = 0;

						if (get_option('w2dc_fsubmit_moderation')) {
							$post_status = 'pending';
							$message = esc_attr__("Listing was saved successfully! Now it's awaiting moderators approval.", 'W2DC');
							update_post_meta($listing_id, '_requires_moderation', true);
						} else {
							$post_status = 'publish';
							$message = __('Listing was saved successfully! Now you can manage it in your dashboard.', 'W2DC');
						}

						$postarr = array(
								'ID' => $listing_id,
								'post_title' => apply_filters('w2dc_title_save_pre', $post_title, $listing),
								'post_name' => apply_filters('w2dc_name_save_pre', '', $listing),
								'post_content' => (isset($_POST['post_content']) ? $_POST['post_content'] : ''),
								'post_excerpt' => (isset($_POST['post_excerpt']) ? $_POST['post_excerpt'] : ''),
								'post_type' => W2DC_POST_TYPE,
								'post_author' => $post_author_id,
								'post_status' => $post_status
						);
						$result = wp_update_post($postarr, true);
						if (is_wp_error($result)) {
							w2dc_addMessage($result->get_error_message(), 'error');
						} else {
							if (!$listing->level->eternal_active_period) {
								if (get_option('w2dc_change_expiration_date') || current_user_can('manage_options'))
									$w2dc_instance->listings_manager->changeExpirationDate();
								else {
									$expiration_date = w2dc_calcExpirationDate(current_time('timestamp'), $listing->level);
									add_post_meta($listing->post->ID, '_expiration_date', $expiration_date);
								}
							}

							add_post_meta($listing->post->ID, '_listing_created', true);
							add_post_meta($listing->post->ID, '_order_date', time());
							add_post_meta($listing->post->ID, '_listing_status', 'active');
							
							if (get_option('w2dc_claim_functionality') && !get_option('w2dc_hide_claim_metabox'))
								if (isset($_POST['is_claimable']))
									update_post_meta($listing->post->ID, '_is_claimable', true);
								else
									update_post_meta($listing->post->ID, '_is_claimable', false);
	
							w2dc_addMessage($message);
							
							// renew data inside $listing object
							$listing = w2dc_getListing($listing_id);
							
							if (get_option('w2dc_newlisting_admin_notification')) {
								$author = get_userdata($listing->post->post_author);

								$subject = __('Notification about new listing creation (do not reply)', 'W2DC');
								$body = str_replace('[user]', $author->display_name,
										str_replace('[listing]', $post_title,
										str_replace('[link]', admin_url('post.php?post='.$listing->post->ID.'&action=edit'),
								get_option('w2dc_newlisting_admin_notification'))));
	
								w2dc_mail(w2dc_getAdminNotificationEmail(), $subject, $body);
							}
	
							apply_filters('w2dc_listing_creation_front', $listing);
	
							if ($w2dc_instance->dashboard_page_url)
								$redirect_to = w2dc_dashboardUrl();
							else
								$redirect_to = w2dc_directoryUrl();
							wp_redirect($redirect_to);
							die();
						}
					}
					// renew data inside $listing object
					$listing = w2dc_getListing($listing_id);
				}
				
				if (get_current_user_id()) {
					$current_user = wp_get_current_user();
					w2dc_addMessage(sprintf(__("You are logged in as %s. <a href='%s'>Log out</a> or continue submission in this account.", "W2DC"), $current_user->display_name, wp_logout_url()));
					if ($package_message = $w2dc_instance->listings_packages->submitlisting_level_message($w2dc_instance->current_listing->level)) {
						w2dc_addMessage($package_message);
					}
				} elseif (get_option('w2dc_fsubmit_login_mode') == 2 || get_option('w2dc_fsubmit_login_mode') == 3) {
					w2dc_addMessage(sprintf(__("Returning user? Please <a href='%s'>Log in</a> or register in this submission form.", "W2DC"), wp_login_url()));
				}
	
				$this->template = array(W2DC_FSUBMIT_TEMPLATES_PATH, 'submitlisting_step_create.tpl.php');
				if ($listing->level->categories_number > 0 || $listing->level->unlimited_categories) {
					add_action('wp_enqueue_scripts', array($w2dc_instance->categories_manager, 'admin_enqueue_scripts_styles'));
				}
				
				if ($listing->level->locations_number > 0) {
					add_action('wp_enqueue_scripts', array($w2dc_instance->locations_manager, 'admin_enqueue_scripts_styles'));
				}

				if ($listing->level->images_number > 0 || $listing->level->videos_number > 0)
					add_action('wp_enqueue_scripts', array($w2dc_instance->media_manager, 'admin_enqueue_scripts_styles'));
			}
		}
		
		apply_filters('w2dc_submit_controller_construct', $this);
	}

	public function display() {
		$output =  w2dc_renderTemplate($this->template, array_merge(array('frontend_controller' => $this), $this->template_args), true);
		wp_reset_postdata();

		return $output;
	}
}

?>