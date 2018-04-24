<?php 

class w2dc_term_title_controller extends w2dc_frontend_controller {

	public function init($args = array()) {
		parent::init($args);

		$shortcode_atts = array_merge(array(
				
		), $args);

		$this->args = $shortcode_atts;

		apply_filters('w2dc_term_title_controller_construct', $this);
	}

	public function display() {
		global $w2dc_instance;

		$term_description = null;
		if ($directory_controller = $w2dc_instance->getShortcodeProperty('webdirectory')) {
			if ($directory_controller->is_category || $directory_controller->is_location || $directory_controller->is_tag) {
				ob_start();

				echo '<div class="w2dc-content">';
					echo '<div class="w2dc-page-header">';
						echo '<h2>';
							echo $directory_controller->getPageTitle();
						echo '</h2>';
					echo '</div>';
				echo '</div>';
				
				$output = ob_get_clean();
				
				return $output;
			}
		}
	}
}

?>