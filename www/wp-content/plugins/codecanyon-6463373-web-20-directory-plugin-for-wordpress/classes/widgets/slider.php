<?php

global $w2dc_slider_widget_params;
$w2dc_slider_widget_params = array(
		array(
				'type' => 'textfield',
				'param_name' => 'slides',
				'value' => 3,
				'heading' => __('Maximum number of slides', 'W2DC'),
		),
		array(
				'type' => 'textfield',
				'param_name' => 'max_width',
				'heading' => __('Maximum width of slider in pixels', 'W2DC'),
				'description' => __('Leave empty to make it auto width.', 'W2DC'),
		),
		array(
				'type' => 'textfield',
				'param_name' => 'height',
				'value' => 400,
				'heading' => __('Height of slider in pixels', 'W2DC'),
		),
		array(
				'type' => 'textfield',
				'param_name' => 'slide_width',
				'value' => 150,
				'heading' => __('Maximum width of one slide in pixels', 'W2DC'),
		),
		array(
				'type' => 'dropdown',
				'param_name' => 'max_slides',
				'value' => array('2' => '2', '3' => '3', '4' => '4', '5' => '5', '6' => '6'),
				'heading' => __('Maximum number of slides to be shown in carousel', 'W2DC'),
				'description' => __('Slides will be sized up if carousel becomes larger than the original size.', 'W2DC'),
		),
		array(
				'type' => 'dropdown',
				'param_name' => 'auto_slides',
				'value' => array(__('No', 'W2DC') => '0', __('Yes', 'W2DC') => '1'),
				'heading' => __('Enable automatic rotating slideshow', 'W2DC'),
		),
		array(
				'type' => 'textfield',
				'param_name' => 'auto_slides_delay',
				'value' => 3000,
				'heading' => __('The delay in rotation (in ms)', 'W2DC'),
				'dependency' => array('element' => 'auto_slides', 'value' => '1'),
		),
		array(
				'type' => 'dropdown',
				'param_name' => 'sticky_featured',
				'value' => array(__('No', 'W2DC') => '0', __('Yes', 'W2DC') => '1'),
				'heading' => __('Show only sticky or/and featured listings?', 'W2DC'),
				'description' => __('Whether to show only sticky or/and featured listings.', 'W2DC'),
		),
		array(
				'type' => 'dropdown',
				'param_name' => 'order_by_rand',
				'value' => array(__('No', 'W2DC') => '0', __('Yes', 'W2DC') => '1'),
				'heading' => __('Order listings randomly?', 'W2DC'),
		),
		array(
				'type' => 'ordering',
				'param_name' => 'order_by',
				'heading' => __('Order by', 'W2DC'),
				'description' => __('Order listings by any of these parameter.', 'W2DC'),
				'dependency' => array('element' => 'order_by_rand', 'value' => '0'),
		),
		array(
				'type' => 'dropdown',
				'param_name' => 'order',
				'value' => array(__('Ascending', 'W2DC') => 'ASC', __('Descending', 'W2DC') => 'DESC'),
				'description' => __('Direction of sorting.', 'W2DC'),
				'dependency' => array('element' => 'order_by_rand', 'value' => '0'),
		),
		array(
				'type' => 'textfield',
				'param_name' => 'address',
				'heading' => __('Address', 'W2DC'),
				'description' => __('Display listings near this address, recommended to set default radius', 'W2DC'),
		),
		array(
				'type' => 'textfield',
				'param_name' => 'radius',
				'heading' => __('Radius', 'W2DC'),
				'description' => __('Display listings near provided address within this radius in miles or kilometers.', 'W2DC'),
		),
		array(
				'type' => 'textfield',
				'param_name' => 'author',
				'heading' => __('Author', 'W2DC'),
				'description' => __('Enter exact ID of author or word "related" to get assigned listings of current author (works only on listing page or author page)', 'W2DC'),
		),
		array(
				'type' => 'dropdown',
				'param_name' => 'related_categories',
				'value' => array(__('No', 'W2DC') => '0', __('Yes', 'W2DC') => '1'),
				'heading' => __('Use related categories.', 'W2DC'),
				'description' => __('Parameter works only on listings and categories pages.', 'W2DC'),
		),
		array(
				'type' => 'categoriesfield',
				'param_name' => 'categories',
				'heading' => __('Select certain categories', 'W2DC'),
		),
		array(
				'type' => 'dropdown',
				'param_name' => 'related_locations',
				'value' => array(__('No', 'W2DC') => '0', __('Yes', 'W2DC') => '1'),
				'heading' => __('Use related locations.', 'W2DC'),
				'description' => __('Parameter works only on listings and locations pages.', 'W2DC'),
		),
		array(
				'type' => 'locationsfield',
				'param_name' => 'locations',
				'heading' => __('Select certain locations', 'W2DC'),
		),
		array(
				'type' => 'dropdown',
				'param_name' => 'related_tags',
				'value' => array(__('No', 'W2DC') => '0', __('Yes', 'W2DC') => '1'),
				'heading' => __('Use related tags.', 'W2DC'),
				'description' => __('Parameter works only on listings and tags pages.', 'W2DC'),
		),
		array(
				'type' => 'dropdown',
				'param_name' => 'include_categories_children',
				'value' => array(__('No', 'W2DC') => '0', __('Yes', 'W2DC') => '1'),
				'heading' => __('Include children of selected categories and locations', 'W2DC'),
				'description' => __('When enabled - any subcategories or sublocations will be included as well. Related categories and locations also affected.', 'W2DC'),
		),
		array(
				'type' => 'level',
				'param_name' => 'levels',
				'heading' => __('Listings levels', 'W2DC'),
				'description' => __('Categories may be dependent from listings levels.', 'W2DC'),
		),
		array(
				'type' => 'textfield',
				'param_name' => 'post__in',
				'heading' => __('Exact listings', 'W2DC'),
				'description' => __('Comma separated string of listings IDs. Possible to display exact listings.', 'W2DC'),
		),
);

class w2dc_slider_widget extends w2dc_widget {

	public function __construct() {
		global $w2dc_instance, $w2dc_slider_widget_params;

		parent::__construct(
				'w2dc_slider_widget',
				__('Directory - Slider', 'W2DC')
		);

		foreach ($w2dc_instance->search_fields->filter_fields_array AS $filter_field) {
			if (method_exists($filter_field, 'getVCParams') && ($field_params = $filter_field->getVCParams())) {
				$w2dc_slider_widget_params = array_merge($w2dc_slider_widget_params, $field_params);
			}
		}

		$this->convertParams($w2dc_slider_widget_params);
	}
	
	public function render_widget($instance, $args) {
		$title = apply_filters('widget_title', $instance['title']);

		echo $args['before_widget'];
		if (!empty($title)) {
			echo $args['before_title'] . $title . $args['after_title'];
		}
		echo '<div class="w2dc-content w2dc-widget w2dc-slider-widget">';
		$controller = new w2dc_slider_controller();
		$controller->init($instance);
		echo $controller->display();
		echo '</div>';
		echo $args['after_widget'];
	}
}
?>