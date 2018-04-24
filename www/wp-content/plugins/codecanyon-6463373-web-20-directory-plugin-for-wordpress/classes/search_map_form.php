<?php

class w2dc_search_map_form extends w2dc_search_form {
	public $directories = array();
	public $listings_content = '';

	public function __construct($uid = null, $controller = 'listings_controller', $args, $directories = null, $listings_content = '') {
		global $w2dc_instance;
		
		$this->args = array_merge(array(
				'exact_categories' => array(),
				'exact_locations' => array(),
				'search_on_map_open' => 0,
		), $args);
		$this->uid = $uid;
		$this->controller = $controller;
		$this->listings_content = $listings_content;
		
		if ($directories) {
			$this->directories = $directories;
			foreach ($directories AS $directory_id) {
				if ($directory = $w2dc_instance->directories->getDirectoryById($directory_id)) {
					if ($directory->categories)
						$this->args['exact_categories'] = array_merge($this->args['exact_categories'], $directory->categories);
					if ($directory->locations)
						$this->args['exact_locations'] = array_merge($this->args['exact_locations'], $directory->locations);
				}
			}
		}
	}

	public function printClasses() {
		if (!empty($this->args['search_on_map_open'])) {
			echo ' w2dc-sidebar-open';
		}
		if (!$this->isCategoriesOrKeywords() && !$this->isLocationsOrAddress()) {
			echo 'w2dc-no-map-search-form';
		} elseif (!$this->isCategoriesOrKeywords()) {
			echo 'w2dc-no-map-search-categories';
		} elseif (!$this->isLocationsOrAddress()) {
			echo 'w2dc-no-map-search-locations';
		}
	}

	public function display($columns = 2, $advanced_open = false) {
		global $w2dc_instance;

		// random ID needed because there may be more than 1 search form on one page
		$search_form_id = w2dc_generateRandomVal();
		
		if ($this->directories && ($directory_id = array_shift($this->directories)) && ($directory = $w2dc_instance->directories->getDirectoryById($directory_id))) {
			$search_url = $directory->url;
		} else {
			$search_url = ($w2dc_instance->index_page_url) ? w2dc_directoryUrl() : home_url('/');
		}
		
		$search_url = apply_filters('w2dc_search_url', $search_url, $this);

		w2dc_renderTemplate('search_map_form.tpl.php',
			array(
				'search_form_id' => $search_form_id,
				'search_url' => $search_url,
				'uid' => $this->uid,
				'args' => $this->args,
				'search_form' => $this,
				'controller' => $this->controller
			)
		);
	}
}
?>