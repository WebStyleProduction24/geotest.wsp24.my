<?php

class w2dc_updater {
	
	public $slug;
	public $plugin_slug;
	public $update_path = 'http://www.salephpscripts.com/wordpress_directory/version/';
	
	public function __construct($plugin_slug) {
		$this->plugin_slug = $plugin_slug;

		add_filter('upgrader_package_options', array($this, 'update_does_not_clear_destination'));

		add_filter('pre_set_site_transient_update_plugins', array($this, 'check_update'));
		
		add_action('in_plugin_update_message-' . $this->plugin_slug, array($this, 'upgrade_message'));
	}
	
	/**
	 * Do not clear destination folder, there may be custom files and templates
	 *
	 * @param array $options
	 * @return array
	 */
	public function update_does_not_clear_destination($options) {
		if (strpos($options['package'], 'web-20-directory-plugin-for-wordpress') !== false) {
			$options['clear_destination'] = false;
		}
		return $options;
	}
	
	public function check_update($transient) {
		$t = explode('/', $this->plugin_slug);
		$this->slug = str_replace('.php', '', $t[1]);

		// Get the remote version
		$remote_version = $this->getRemote_version();
	
		// If a newer version is available, add the update
		if (version_compare(W2DC_VERSION, $remote_version, '<')) {
			$obj = new stdClass();
			$obj->slug = $this->slug;
			$obj->new_version = $remote_version;
			$obj->url = '';
			$obj->package = false;
			$obj->name = 'Web 2.0 Directory plugin';
			$transient->response[$this->plugin_slug] = $obj;
		}
	
		return $transient;
	}
	
	public function getRemote_version() {
		$request = wp_remote_get($this->update_path);
		if (!is_wp_error($request) || wp_remote_retrieve_response_code($request) === 200) {
			return $request['body'];
		}
		
		return false;
	}
	
	public function upgrade_message() {
		echo ' ' . __('Download the latest version from <a href="https://codecanyon.net/downloads" target="_blank">Codecanyon</a> and follow <a href="http://www.salephpscripts.com/wordpress_directory/demo/documentation/#update" target="_blank">update instructions</a>.', 'W2DC');
	}
}

?>