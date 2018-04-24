if (w2dc_js_objects.is_maps_used && !w2dc_google_maps_objects.notinclude_maps_api) {
	var w2dc_3rd_party_maps_plugin = false;
	var _warn = console.warn,
	    _error = console.error;
	console.error = function() {
	    var err = arguments[0];
	    if (typeof err == "string") {
		    if (err.indexOf('InvalidKeyMapError') != -1 || err.indexOf('MissingKeyMapError') != -1) {
		    	if (w2dc_3rd_party_maps_plugin)
					alert('Web 2.0 Directory plugin: another plugin or your theme calls Google Maps library without keys. This may cause problems with Google Maps, Geocoding, addition/edition listings locations, autocomplete on addresses fields.\n\nTry to find which plugin calls Google Maps library without keys. Insert keys in its settings or disable this plugin.');
				else
					alert('Web 2.0 Directory plugin: your Google browser API key is invalid or missing. Log in to console https://code.google.com/apis/console and generate new key. Follow instructions http://www.salephpscripts.com/wordpress_directory/demo/documentation/#google_maps_keys');
		    }
		    if (err.indexOf('RefererNotAllowedMapError') != -1) {
		    	var hostname = window.location.hostname;
		    	var protocol = window.location.protocol;
		    	alert('Web 2.0 Directory plugin: the current URL loading the Google Maps has not been added to the list of allowed referrers. Please check the "Accept requests from these HTTP referrers (web sites)" field in Google API console. Follow instructions http://www.salephpscripts.com/wordpress_directory/demo/documentation/#google_maps_keys \n\nTry one of the following URLs: '+hostname+'/*, '+protocol+'//'+hostname+'/*, '+protocol+'//www.'+hostname+'/*');
		    }
		    if (err.indexOf('ApiNotActivatedMapError') != -1)
		    	alert('Web 2.0 Directory plugin: you have to enable following APIs in Google API console https://code.google.com/apis/console : Google Maps JavaScript API, Google Static Maps API, Google Places API Web Service, Google Maps Geocoding API and Google Maps Directions API. Follow instructions http://www.salephpscripts.com/wordpress_directory/demo/documentation/#google_maps_keys\n\nNote, that it requires some time for changes to take effect.');
	    }
	    return _error.apply(console, arguments);
	};
	console.warn = function() {
		var err = arguments[0];
		if (typeof err == "string") {
			if (err.indexOf('InvalidKey') != -1 || err.indexOf('NoApiKeys') != -1) {
				if (w2dc_3rd_party_maps_plugin)
					alert('Web 2.0 Directory plugin: another plugin or your theme calls Google Maps library without keys. This may cause problems with Google Maps, Geocoding, addition/edition listings locations, autocomplete on addresses fields.\n\nTry to find which plugin calls Google Maps library without keys. Insert keys in its settings or disable this plugin.');
				else
					alert('Web 2.0 Directory plugin: your Google browser API key is invalid or missing. Log in to console https://code.google.com/apis/console and generate new key. Follow instructions http://www.salephpscripts.com/wordpress_directory/demo/documentation/#google_maps_keys');
			}
		}
		return _warn.apply(console, arguments);
	};
}

var w2dc_maps = [];
var w2dc_maps_attrs = [];
var w2dc_infoWindows = [];
var w2dc_drawCircles = [];
var w2dc_searchAddresses = [];
var w2dc_polygons = [];
var w2dc_fullScreens = [];
var w2dc_global_markers_array = [];
var w2dc_global_locations_array = [];
var w2dc_markerClusters = [];
var w2dc_glocation = (function(id, point, map_icon_file, map_icon_color, listing_title, listing_logo, listing_url, content_fields, anchor, nofollow, show_summary_button, show_readmore_button, map_id, is_ajax_markers) {
	this.id = id;
	this.point = point;
	this.map_icon_file = map_icon_file;
	this.map_icon_color = map_icon_color;
	this.listing_title = listing_title;
	this.listing_logo = listing_logo;
	this.listing_url = listing_url;
	this.content_fields = content_fields;
	this.anchor = anchor;
	this.nofollow = nofollow;
	this.show_summary_button = show_summary_button;
	this.show_readmore_button = show_readmore_button;
	this.w2dc_placeMarker = function(map_id) {
		this.marker = w2dc_placeMarker(this, map_id);
		return this.marker;
	};
	this.is_ajax_markers = is_ajax_markers;
});
var _w2dc_map_markers_attrs_array;
var w2dc_dragended;
var ZOOM_FOR_SINGLE_MARKER = 17;

(function($) {
	"use strict";
	
	$(function() {
		w2dc_get_rid_of_select2_choosen();
		w2dc_process_main_search_fields();
		w2dc_nice_scroll();
		w2dc_custom_input_controls();
		w2dc_my_location_buttons();
		w2dc_tokenizer();
		w2dc_add_body_classes();
		w2dc_equalColumnsHeight();
		w2dc_equalColumnsHeightEvent();
		w2dc_listings_carousel();
		w2dc_radius_slider();
		w2dc_hint();
		w2dc_favourites();
		w2dc_check_is_week_day_closed();
		w2dc_listing_tabs();
		w2dc_dashboard_tabs();
		w2dc_lightbox();
		w2dc_sticky_scroll();
		w2dc_tooltips();
		w2dc_ratings();
		w2dc_hours_content_field();
		w2dc_full_height_maps();
	});

	window.w2dc_nice_scroll = function() {
		var nice_scroll_params = {
				cursorcolor: "#bdbdbd",
				cursorborderradius: "2px",
				cursorwidth: "7px",
				autohidemode: false
		}
		$(".w2dc-map-listings-panel").niceScroll(nice_scroll_params);
		$(".w2dc-dropdowns-menu").niceScroll(nice_scroll_params);
	}

	window.w2dc_my_location_buttons = function() {
		if (w2dc_google_maps_objects.enable_my_location_button) {
			$(".w2dc-get-location").attr("title", w2dc_google_maps_objects.my_location_button);
			$("body").on("click", ".w2dc-get-location", function() {
				var input = $(this).parent().find("input");
				w2dc_geocodeField(input, w2dc_google_maps_objects.my_location_button_error);
			});
		}
	}
	
	window.w2dc_tokenizer = function() {
		$(".w2dc-tokenizer").tokenize({ });
	}

	window.w2dc_add_body_classes = function() {
		if ("ontouchstart" in document.documentElement)
			$("body").addClass("w2dc-touch");
		else
			$("body").addClass("w2dc-no-touch");
	}

	window.w2dc_listing_tabs = function() {
		$(document).on('click', '.w2dc-listing-tabs a', function(e) {	  
			  e.preventDefault();
			  w2dc_show_tab($(this));
		});
		var hash = window.location.hash.substring(1);
		if (hash == 'respond' || hash.indexOf('comment-', 0) >= 0) {
			w2dc_show_tab($('.w2dc-listing-tabs a[data-tab="#comments-tab"]'));
		} else if (hash && $('.w2dc-listing-tabs a[data-tab="#'+hash+'"]').length) {
			w2dc_show_tab($('.w2dc-listing-tabs a[data-tab="#'+hash+'"]'));
		}
	}
	window.w2dc_show_tab = function(tab) {
		$('.w2dc-listing-tabs li').removeClass('w2dc-active');
		tab.parent().addClass('w2dc-active');
		$('.w2dc-tab-content .w2dc-tab-pane').removeClass('w2dc-in w2dc-active');
		$('.w2dc-tab-content '+tab.data('tab')).addClass('w2dc-in w2dc-active');
		if (tab.data('tab') == '#addresses-tab')
			 for (var key in w2dc_maps) {
				if (typeof w2dc_maps[key] == 'object') {
					w2dc_setZoomCenter(w2dc_maps[key]);
				}
			 }
	};
	
	window.w2dc_radius_slider = function () {
		$('.w2dc-radius-slider').each(function() {
			var id = $(this).data("id");
			$('#radius_slider_'+id).slider({
				isRTL: w2dc_js_objects.is_rtl,
				min: parseInt(slider_params.min),
				max: parseInt(slider_params.max),
				range: "min",
				value: $("#radius_"+id).val(),
				slide: function(event, ui) {
					$("#radius_label_"+id).html(ui.value);
				},
				stop: function(event, ui) {
					$("#radius_"+id).val(ui.value);
					if (
						$("#radius_"+id).val() > 0 &&
						$(this).parents("form").find("input[name='address']").length &&
						$(this).parents("form").find("input[name='address']").val()
					) {
						$("#radius_"+id).trigger("change");
					}
				}
			});
		});
	}

	window.w2dc_hint = function () {
		$("a.w2dc-hint-icon").each(function() {
			$(this).w2dc_popover({
				trigger: "hover",
				//trigger: "manual",
				container: $(this).parents(".w2dc-content")
			});
		});
	}
	
	window.w2dc_favourites = function () {
		// Place listings to/from favourites list
		if ($(".add_to_favourites").length) {
			$(".add_to_favourites").click(function() {
				var listing_id = $(this).attr("listingid");

				if ($.cookie("favourites") != null) {
					var favourites_array = $.cookie("favourites").split('*');
				} else {
					var favourites_array = new Array();
				}
				if (w2dc_in_array(listing_id, favourites_array) === false) {
					favourites_array.push(listing_id);
					$(this).find('span.w2dc-glyphicon').removeClass(w2dc_js_objects.not_in_favourites_icon).addClass(w2dc_js_objects.in_favourites_icon);
					$(this).find('span.w2dc-bookmark-button').text(w2dc_js_objects.not_in_favourites_msg);
				} else {
					for (var count=0; count<favourites_array.length; count++) {
						if (favourites_array[count] == listing_id) {
							delete favourites_array[count];
						}
					}
					$(this).find('span.w2dc-glyphicon').removeClass(w2dc_js_objects.in_favourites_icon).addClass(w2dc_js_objects.not_in_favourites_icon);
					$(this).find('span.w2dc-bookmark-button').text(w2dc_js_objects.in_favourites_msg);
				}
				$.cookie("favourites", favourites_array.join('*'), {expires: 365, path: "/"});
				return false;
			});
		}
	}
	window.w2dc_check_is_week_day_closed = function () {
		$('.closed_cb').each(function() {
			_w2dc_check_is_week_day_closed($(this));
	    });
		$('.closed_cb').click(function() {
			_w2dc_check_is_week_day_closed($(this));
	    });
	}

	window._w2dc_check_is_week_day_closed = function (cb) {
		if (cb.is(":checked"))
			cb.parent().find(".w2dc-week-day-input").attr('disabled', 'disabled');
    	else
    		cb.parent().find(".w2dc-week-day-input").removeAttr('disabled');
	}
	
	$(window).on('popstate', function() {
		location.reload(true);
	});
	
	window.w2dc_dashboard_tabs = function() {
		$(".w2dc-dashboard-tabs.nav-tabs li").click(function(e) {
			window.location = $(this).find("a").attr("href");
		});
	}
	
	window.w2dc_lightbox = function() {
		// Special trick for lightbox
		if (typeof lightbox != 'undefined') {
			var dataLightboxValue = $("#w2dc-lighbox-images a").data("w2dc-lightbox");
			$("#w2dc-lighbox-images a").removeAttr("data-w2dc-lightbox").attr("data-lightbox", dataLightboxValue);
			$('body').on('click', 'a[data-w2dc-lightbox]', function(event) {
				event.preventDefault();
				var link = $('#w2dc-lighbox-images a[href="'+$(this).attr('href')+'"]');
				lightbox.option({
				      'wrapAround': true
				    })
				lightbox.start(link);
			});
		}
	}
	
	window.w2dc_sticky_scroll = function() {
		$('.w2dc-sticky-scroll').each(function() {
			var element = $(this);
			var id = element.data("id");
			var toppadding = (element.data("toppadding")) ? element.data("toppadding") : 0;
			//var height = (element.data("height")) ? element.data("height") : null;
			
			if (toppadding == 0 && $("body").hasClass("admin-bar")) {
				toppadding = 32;
			}
			
			if ($('.site-header.header-fixed.fixed:visible').length) {
				var headerHeight = $('.site-header.header-fixed.fixed').outerHeight();
				toppadding = toppadding + headerHeight;
			}

			if (!$("#w2dc-scroller-anchor-"+id).length) {
				var anchor = $("<div>", {
					id: 'w2dc-scroller-anchor-'+id
				});
				element.before(anchor);
	
				var background = $("<div>", {
					id: 'w2dc-sticky-scroll-background-'+id,
					style: {position: 'relative'}
				});
				element.after(background);
			}
				
			window["w2dc_sticky_scroll_toppadding_"+id] = toppadding;
	
			$("#w2dc-sticky-scroll-background-"+id).position().left = element.position().left;
			$("#w2dc-sticky-scroll-background-"+id).position().top = element.position().top;
			$("#w2dc-sticky-scroll-background-"+id).width(element.width());
			$("#w2dc-sticky-scroll-background-"+id).height(element.height());

			var w2dc_scroll_function = function(e) {
				var id = e.data.id;
				var toppadding = e.data.toppadding;
				var b = $(document).scrollTop();
				var d = $("#w2dc-scroller-anchor-"+id).offset().top - toppadding;
				var c = e.data.obj;
				var e = $("#w2dc-sticky-scroll-background-"+id);
				
				c.width(c.parent().width()).css({ 'z-index': 100 });
		
				// .w2dc-scroller-bottom - this is special class used to restrict the area of scroll of map canvas
				if ($(".w2dc-scroller-bottom").length) {
					var f = $(".w2dc-scroller-bottom").offset().top - (c.height() + toppadding);
				} else {
					var f = $(document).height();
				}
		
				if (f > c.height()) {
					if (b >= d && b < f) {
						c.css({ position: "fixed", top: toppadding });
						e.css({ position: "relative" });
					} else {
						if (b <= d) {
							c.stop().css({ position: "relative", top: "" });
							e.css({ position: "absolute" });
						}
						if (b >= f) {
							c.css({ position: "absolute" });
							c.stop().offset({ top: f + toppadding });
							e.css({ position: "relative" });
						}
					}
				} else {
					c.css({ position: "relative", top: "" });
					e.css({ position: "absolute" });
				}
			};
			if ($(document).width() >= 768) {
				var args = {id: id, obj: $(this), toppadding: toppadding};
				$(window).scroll(args, w2dc_scroll_function);
				w2dc_scroll_function({data: args});
			}

			$("#w2dc-sticky-scroll-background-"+id).css({ position: "absolute" });

			/*if (height == '100%') {
				element.height(function(index, height) {
					return window.innerHeight - $("#scroller_anchor_"+id).outerHeight(true) - toppadding;
				});
				$(window).resize(function(){
					element.height(function(index, height) {
						return window.innerHeight - $("#scroller_anchor_"+id).outerHeight(true) - toppadding;
					});
				});
			}*/
		});
	}
	
	window.w2dc_full_height_maps = function() {
		$('.w2dc-maps-canvas-wrapper').each(function() {
			var element = $(this);
			var height = (element.data("height")) ? element.data("height") : null;
			
			if (height == '100%') {
				var toppadding = (element.data("toppadding")) ? element.data("toppadding") : 0;
				
				if (toppadding == 0 && $("body").hasClass("admin-bar")) {
					toppadding = 32;
				}
				
				if ($('.site-header.header-fixed.fixed:visible').length) {
					var headerHeight = $('.site-header.header-fixed.fixed').outerHeight();
					toppadding = toppadding + headerHeight;
				}

				element.height(function(index, height) {
					return window.innerHeight - toppadding;
				});
				$(window).resize(function(){
					element.height(function(index, height) {
						return window.innerHeight - toppadding;
					});
				});
			}
		});
	}
	
	window.w2dc_tooltips = function() {
		$('[data-toggle="w2dc-tooltip"]').w2dc_tooltip({
			 trigger : 'hover'
		});
	}
	
	window.w2dc_ratings = function() {
		$('body').on('click', '.w2dc-rating-active .w2dc-rating-icon', function() {
			var rating = $(this).parent(".w2dc-rating-stars");
			var rating_wrapper = $(this).parents(".w2dc-rating");
			
			rating_wrapper.fadeTo(2000, 0.3);
			
			$.ajax({
	        	url: w2dc_js_objects.ajaxurl,
	        	type: "POST",
	        	dataType: "json",
	            data: {
	            	action: 'w2dc_save_rating',
	            	rating: $(this).data("rating"),
	            	post_id: rating.data("listing"),
	            	_wpnonce: rating.data("nonce")
	            },
	            rating_wrapper: rating_wrapper,
	            success: function(response_from_the_action_function){
	            	if (response_from_the_action_function != 0 && response_from_the_action_function.html) {
	            		this.rating_wrapper
	            		.replaceWith(response_from_the_action_function.html)
	            		.fadeIn("fast");
	            	}
	            }
	        });
		});
	}

	window.w2dc_hours_content_field = function() {
		function close_option(option) {
			if (option.is(":checked")) {
				option.parents(".w2dc-week-day-wrap").find("select").attr("disabled", "disabled");
			} else {
				option.parents(".w2dc-week-day-wrap").find("select").removeAttr("disabled");
			}
		}
		$(".w2dc-closed-day-option").each(function() {
			close_option($(this));
		});
		$("body").on("change", ".w2dc-closed-day-option", function() {
			close_option($(this));
		});
		
		$("body").on("click", ".w2dc-clear-hours", function() {
			$(this).parents(".w2dc-field-input-block").find("select").each( function() { $(this).val($(this).find("option:first").val()).removeAttr('disabled'); });
			$(this).parents(".w2dc-field-input-block").find('input[type="checkbox"]').each( function() { $(this).attr('checked', false); });
			return false;
		});
	}

	window.w2dc_custom_input_controls = function() {
		// Custom input controls
		$(".w2dc-checkbox label, .w2dc-radio label").each(function() {
			if (!$(this).find(".w2dc-control-indicator").length) {
				$(this).append($("<div>").addClass("w2dc-control-indicator"));
			}
		});
	}
	$(document).ajaxComplete(function(event, xhr, settings) {
		if (settings.url === w2dc_js_objects.ajaxurl) {
			w2dc_custom_input_controls();
		}
	});

	window.w2dc_get_rid_of_select2_choosen = function() {
		$("select.w2dc-form-control").each(function (i, obj) {
			// get rid of select2
			if ($(obj).hasClass('select2-hidden-accessible') || $('#s2id_' + $(obj).attr('id')).length) {
				$(obj).select2('destroy');
			}
			// get rid of chosen
			if ($('#' + $(obj).attr('id') + '_chosen').length) {
				$(obj).chosen('destroy');
			}
		});
	}
		
	window.w2dc_process_main_search_fields = function() {
		if (typeof categories_combobox != "undefined") {
			$(".w2dc-selectmenu-w2dc-category").categories_combobox();
			$(".w2dc-selectmenu-w2dc-location").locations_combobox();
			$(".w2dc-address-autocomplete").address_autocomplete();
		}
	}
	
	window.w2dc_advancedSearch = function(uID, more_filters, less_filters) {
		if ($("#use_advanced_" + uID).val()) {
			$("#w2dc-advanced-search-label_" + uID).find(".w2dc-advanced-search-text").text(less_filters);

			$("#w2dc-advanced-search-label_" + uID).find(".w2dc-advanced-search-toggle")
			.removeClass("w2dc-glyphicon-chevron-down")
			.addClass("w2dc-glyphicon-chevron-up");
		}
		$("#w2dc-advanced-search-label_" + uID).off("click");
		$("#w2dc-advanced-search-label_" + uID).click(function(e) {
			if ($("#w2dc_advanced_search_fields_" + uID).is(":hidden")) {
				$(this).find(".w2dc-advanced-search-text").text(less_filters);
				$("#use_advanced_" + uID).val(1);
				$("#w2dc_advanced_search_fields_" + uID).show();

				$(this).find(".w2dc-advanced-search-toggle")
				.removeClass("w2dc-glyphicon-chevron-down")
				.addClass("w2dc-glyphicon-chevron-up");
			} else {
				$(this).find(".w2dc-advanced-search-text").text(more_filters);
				$("#use_advanced_" + uID).val(0);
				$("#w2dc_advanced_search_fields_" + uID).hide();

				$(this).find(".w2dc-advanced-search-toggle")
				.removeClass("w2dc-glyphicon-chevron-up")
				.addClass("w2dc-glyphicon-chevron-down");
			}
		});
	};

	window.w2dc_equalColumnsHeightEvent = function() {
		$(window).on('orientationchange resize', w2dc_equalColumnsHeight);
	}
		
	window.w2dc_equalColumnsHeight = function() {
		if ($(document).width() >= 768) {
			setTimeout(function(){
				$(".w2dc-listings-grid .w2dc-listing").css('height', '');

				var currentTallest = 0;
				var currentRowStart = 0;
				var rowDivs = new Array();
				var $el;
				var topPosition = 0;
				$(".w2dc-listings-grid .w2dc-listing").each(function() {
					$el = $(this);
					var topPostion = $el.position().top;
					if (currentRowStart != topPostion) {
						for (var currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
							rowDivs[currentDiv].height(currentTallest);
						}
						rowDivs.length = 0;
						currentRowStart = topPostion;
						currentTallest = $el.height();
						rowDivs.push($el);
					} else {
						rowDivs.push($el);
						currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
					}
					for (var currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
						rowDivs[currentDiv].height(currentTallest);
					}
				});
			}, 500);
		}
	}

	var w2dc_animation_finished = true;
	window.w2dc_listings_carousel = function() {

		if ($(document).width() >= 768) {
			$(".w2dc-listings-carousel-wrapper").each(function() {
				var id = $(this).data("controller-hash");
				var currentTallest = 0;
				$(this).find("article.w2dc-listing").each(function() {
					currentTallest = (currentTallest < $(this).height()) ? ($(this).height()) : (currentTallest);
				});
				$(this).height(currentTallest);
				
				var content = $("#w2dc-controller-"+id+" .w2dc-listings-block-content");
				var width = content.find("article.w2dc-listing").width();
				var margin = 20;
				var slide_width = width + margin;
				$("body").on("click", "#w2dc-controller-"+id+" .w2dc-listings-carousel-button-left", function() {
					w2dc_prev_slide(content, slide_width);
				});
				$("body").on("click", "#w2dc-controller-"+id+" .w2dc-listings-carousel-button-right", function() {
					w2dc_next_slide(content, slide_width);
				});
				$("body").on("swiperight", "#w2dc-controller-"+id+" .w2dc-listings-carousel", function() {
					w2dc_prev_slide(content, slide_width);
				});
				$("body").on("swipeleft", "#w2dc-controller-"+id+" .w2dc-listings-carousel", function() {
					w2dc_next_slide(content, slide_width);
				});
				$("body").on("mousewheel", "#w2dc-controller-"+id+" .w2dc-listings-carousel", function(event, delta, deltaX, deltaY) {
					if (delta > 0) {
						w2dc_prev_slide(content, slide_width);
					}
					if (deltaY < 0) {
						w2dc_next_slide(content, slide_width);
					}
					event.stopPropagation();
					event.preventDefault();
				});
			});
		}
	}
	window.w2dc_prev_slide = function(content, slide_width) {
		if (w2dc_animation_finished) {
			var listing = content.find("article.w2dc-listing:last");
			content
			.css({ "margin-left": -slide_width })
			.prepend(listing.clone());
			
			w2dc_animation_finished = false;
			content.animate({
				"margin-left": 0
			}, 300, function () { 
				listing.remove();
				w2dc_animation_finished = true;
			});
		}
	}
	window.w2dc_next_slide = function(content, slide_width) {
		if (w2dc_animation_finished) {
			var listing = content.find("article.w2dc-listing:first");
			content.append(listing.clone());
			
			w2dc_animation_finished = false;
			content.animate({
				"margin-left": -slide_width
			}, 300, function () { 
				listing.remove();
				content.css({ "margin-left": 0 })
				w2dc_animation_finished = true;
			});
		}
	}
	
	window.w2dc_ajax_loader_target_show = function(target, scroll_to_anchor, offest_top) {
		if (typeof scroll_to_anchor != 'undefined' && scroll_to_anchor) {
			if (typeof offest_top == 'undefined' || !offest_top) {
				var offest_top = 0;
			}
			$('html,body').animate({scrollTop: scroll_to_anchor.offset().top - offest_top}, 'slow');
		}
		var id = target.attr("id");
		if (!$("[data-loader-id='"+id+"']").length) {
			var loader = $('<div data-loader-id="'+id+'" class="w2dc-ajax-target-loading"><div class="w2dc-loader"></div></div>');
			target.prepend(loader);
			loader.css({
				width: target.outerWidth()+10,
				height: target.outerHeight()+10
			});
			if (target.outerHeight() > 600) {
				loader.find(".w2dc-loader").addClass("w2dc-loader-max-top");
			}
		}
	}
	window.w2dc_ajax_loader_target_hide = function(id) {
		$("[data-loader-id='"+id+"']").remove();
	}
	
	window.w2dc_ajax_loader_show = function(msg) {
		var overlay = $('<div id="w2dc-ajax-loader-overlay"><div class="w2dc-loader"></div></div>');
	    $('body').append(overlay);
	}
	
	window.w2dc_ajax_loader_hide = function() {
		$("#w2dc-ajax-loader-overlay").remove();
	}

	window.w2dc_get_controller_args_array = function(hash) {
		if (typeof w2dc_controller_args_array != 'undefined' && Object.keys(w2dc_controller_args_array))
			for (var controller_hash in w2dc_controller_args_array)
				if (controller_hash == hash)
					return w2dc_controller_args_array[controller_hash];
	}

	window.w2dc_get_map_markers_attrs_array = function(hash) {
		if (typeof w2dc_map_markers_attrs_array != 'undefined' && Object.keys(w2dc_map_markers_attrs_array))
			for (var i=0; i<w2dc_map_markers_attrs_array.length; i++)
				if (hash == w2dc_map_markers_attrs_array[i].map_id)
					return w2dc_map_markers_attrs_array[i];
	}

	window.w2dc_get_original_w2dc_map_markers_attrs_array = function(hash) {
		if (typeof _w2dc_map_markers_attrs_array != 'undefined' && Object.keys(_w2dc_map_markers_attrs_array))
			for (var i=0; i<_w2dc_map_markers_attrs_array.length; i++)
				if (hash == _w2dc_map_markers_attrs_array[i].map_id)
					return _w2dc_map_markers_attrs_array[i];
	}
	
	window.w2dc_process_listings_ajax_responce = function(response_from_the_action_function, do_replace, remove_shapes, do_replace_markers) {
		var responce_hash = response_from_the_action_function.hash;
		if (response_from_the_action_function) {
			var listings_block = $('#w2dc-controller-'+responce_hash);
			if (do_replace) {
				listings_block.replaceWith(response_from_the_action_function.html);
			} else {
				listings_block.find(".w2dc-listings-block-content").append(response_from_the_action_function.html);
			}
			w2dc_ajax_loader_target_hide("w2dc-controller-"+responce_hash);
			if (response_from_the_action_function.map_markers && typeof w2dc_maps[responce_hash] != 'undefined') {
				if (do_replace) {
					w2dc_clearMarkers(responce_hash);
				}
				if (remove_shapes) {
					w2dc_removeShapes(responce_hash);
				}
				if (typeof w2dc_infoWindows[responce_hash] != 'undefined') {
					w2dc_infoWindows[responce_hash].close();
				}
				var markers_array = response_from_the_action_function.map_markers;
				
				var enable_radius_circle = 0;
				var enable_clusters = 0;
				var show_summary_button = 1;
				var show_readmore_button = 1;
				var attrs_array;
				if (attrs_array = w2dc_get_map_markers_attrs_array(responce_hash)) {
					var enable_radius_circle = attrs_array.enable_radius_circle;
					var enable_clusters = attrs_array.enable_clusters;
					var show_summary_button = attrs_array.show_summary_button;
					var show_readmore_button = attrs_array.show_readmore_button;
					var map_attrs = attrs_array.map_attrs;

					if (do_replace_markers) {
						attrs_array.markers_array = eval(response_from_the_action_function.map_markers);
					}
				}

		    	for (var j=0; j<markers_array.length; j++) {
	    			var map_coords_1 = markers_array[j][1];
			    	var map_coords_2 = markers_array[j][2];
			    	if ($.isNumeric(map_coords_1) && $.isNumeric(map_coords_2)) {
		    			var point = new google.maps.LatLng(map_coords_1, map_coords_2);

		    			var location_obj = new w2dc_glocation(markers_array[j][0], point, 
		    				markers_array[j][3],
		    				markers_array[j][4],
		    				markers_array[j][6],
		    				markers_array[j][7],
		    				markers_array[j][8],
		    				markers_array[j][9],
		    				markers_array[j][10],
		    				markers_array[j][11],
		    				show_summary_button,
		    				show_readmore_button,
		    				responce_hash,
		    				false
			    		);
			    		var marker = location_obj.w2dc_placeMarker(responce_hash);
			    		w2dc_global_locations_array[responce_hash].push(location_obj);
			    	}
	    		}
		    	if (w2dc_global_markers_array[responce_hash].length) {
		    		var bounds = new google.maps.LatLngBounds();
		    		for (var j=0; j<w2dc_global_markers_array[responce_hash].length; j++) {
		    			bounds.extend(w2dc_global_markers_array[responce_hash][j].position);
		    		}
		    		w2dc_maps[responce_hash].fitBounds(bounds);

		    		if (w2dc_global_markers_array[responce_hash].length == 1)
		    			w2dc_maps[responce_hash].setZoom(ZOOM_FOR_SINGLE_MARKER);
		    	}

		    	w2dc_ajax_loader_target_hide('w2dc-maps-canvas-'+responce_hash);

		    	if (do_replace) {
	    			w2dc_setClusters(enable_clusters, responce_hash, w2dc_global_markers_array[responce_hash]);
		    	}

		    	if (remove_shapes) {
			    	if (enable_radius_circle && typeof response_from_the_action_function.radius_params != 'undefined') {
			    		var radius_params = response_from_the_action_function.radius_params;
						var map_radius = parseFloat(radius_params.radius_value);
						w2dc_draw_radius(radius_params, map_radius, responce_hash);
					}
		    	}
			}
			if (typeof response_from_the_action_function.map_listings != 'undefined' && typeof w2dc_maps[responce_hash] != 'undefined') {
				var map_listings_block = $('#w2dc-map-listings-panel-'+responce_hash);
		    	if (map_listings_block.length) {
		    		if (do_replace) {
		    			map_listings_block.html(response_from_the_action_function.map_listings);
		    		} else {
		    			map_listings_block.append(response_from_the_action_function.map_listings);
		    		}
		    	}
		    	w2dc_ajax_loader_target_hide('w2dc-map-search-panel-wrapper-'+responce_hash);
			}
		}
		w2dc_ajax_loader_target_hide('w2dc-controller-'+responce_hash);
		w2dc_ajax_loader_target_hide('w2dc-maps-canvas-'+responce_hash);
		w2dc_equalColumnsHeight();
		w2dc_show_on_map_links();
		w2dc_sticky_scroll();
	}

	window.w2dc_load_ajax_initial_elements = function() {
		// We have to wait while Google Maps API will be completely loaded
		if (typeof w2dc_controller_args_array != 'undefined' && Object.keys(w2dc_controller_args_array)) {
			for (var controller_hash in w2dc_controller_args_array) {
				var post_params = w2dc_controller_args_array[controller_hash];
				if (w2dc_js_objects.ajax_initial_load || (typeof post_params.ajax_initial_load != 'undefined' && post_params.ajax_initial_load == 1)) {
					var ajax_params = {'action': 'w2dc_controller_request', 'hash': controller_hash};
					for (var attrname in ajax_params) { post_params[attrname] = ajax_params[attrname]; }
	
					if ((typeof post_params['with_map'] != 'undefined' && post_params['with_map']) || $("#w2dc-maps-canvas-"+controller_hash).length) {
						var map_attrs_array;
						if (map_attrs_array = w2dc_get_map_markers_attrs_array(controller_hash))
							if (typeof map_attrs_array.map_attrs.ajax_loading != "undefined" && map_attrs_array.map_attrs.ajax_loading == 1)
								continue;
							
						post_params['with_map'] = 1;
						w2dc_ajax_loader_target_show($('#w2dc-maps-canvas-'+controller_hash));
					}
	
				   	w2dc_ajax_loader_target_show($('#w2dc-controller-'+controller_hash));
					$.post(
						w2dc_js_objects.ajaxurl,
						post_params,
						function(response_from_the_action_function) {
							w2dc_process_listings_ajax_responce(response_from_the_action_function, true, true, true);
							var responce_hash = response_from_the_action_function.hash;
							if (response_from_the_action_function.map_markers && typeof w2dc_maps[responce_hash] != 'undefined')
								if (typeof _w2dc_map_markers_attrs_array != 'undefined' && _w2dc_map_markers_attrs_array.length) {
									for (var i=0; i<_w2dc_map_markers_attrs_array.length; i++)
										if (responce_hash == _w2dc_map_markers_attrs_array[i].map_id)
											_w2dc_map_markers_attrs_array[i].markers_array = eval(response_from_the_action_function.map_markers);
								}
						},
						'json'
					);
				}
			}
		}
	}
	
	window.w2dc_ajax_iloader = $("<div>", { class: 'w2dc-ajax-iloader' }).html('<div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div>');
	window.w2dc_add_iloader_on_element = function(button) {
		button
		.attr('disabled', 'disabled')
		.wrapInner('<div class="w2dc-hidden"></div>')
		.append(w2dc_ajax_iloader);
	}
	window.w2dc_delete_iloader_from_element = function(button) {
		button.find(".w2dc-hidden").contents().unwrap();
		button.removeAttr('disabled').find(".w2dc-ajax-iloader").remove();
	}
	
	var w2dc_show_more_button_processing = false;
	$(window).scroll(function() {
		$('.w2dc-show-more-button.w2dc-scrolling-paginator').each(function() {
			if ($(window).scrollTop() + $(window).height() > $(this).position().top) {
				if (!w2dc_show_more_button_processing) {
					w2dc_callShowMoreListings($(this));
				}
			}
		});
	});
	$('body').on('click', '.w2dc-show-more-button', function(e) {
		e.preventDefault();
		w2dc_callShowMoreListings($(this));
	});
	var w2dc_callShowMoreListings = function(button) {
		var controller_hash = button.data("controller-hash");
		var listings_args_array;
		if (listings_args_array = w2dc_get_controller_args_array(controller_hash)) {
			w2dc_add_iloader_on_element(button);

			var post_params = $.extend({}, listings_args_array);
			if (typeof post_params.paged != 'undefined')
				var paged = parseInt(post_params.paged)+1;
			else
				var paged = 2;
			listings_args_array.paged = paged;
			
			var existing_listings = '';
			$("#w2dc-controller-"+controller_hash+" .w2dc-listings-block-content article").each(function(index) {
				existing_listings = $(this).attr("id").replace("post-", "") + "," + existing_listings;
			});

			var ajax_params = {'action': 'w2dc_controller_request', 'do_append': 1, 'paged': paged, 'existing_listings': existing_listings, 'hash': controller_hash};
			for (var attrname in ajax_params) { post_params[attrname] = ajax_params[attrname]; }

			if ($("#w2dc-maps-canvas-"+controller_hash).length) {
				var map_attrs_array;
				if (map_attrs_array = w2dc_get_map_markers_attrs_array(controller_hash)) {
					if ((typeof map_attrs_array.map_attrs.ajax_loading == 'undefined' || map_attrs_array.map_attrs.ajax_loading == 0)
					&&
					(typeof map_attrs_array.map_attrs.drawing_state == 'undefined' || map_attrs_array.map_attrs.drawing_state == 0)
					&&
					(typeof map_attrs_array.map_attrs.map_markers_is_limit == 'undefined' || map_attrs_array.map_attrs.map_markers_is_limit == 1)) {
						w2dc_ajax_loader_target_show($('#w2dc-maps-canvas-'+controller_hash));
					  	post_params.with_map = 1;
					  	post_params.map_markers_is_limit = 1;
					  	if ($("#w2dc-map-listings-panel-"+controller_hash).length) {
							post_params.map_listings = 1;
							w2dc_ajax_loader_target_show($("#w2dc-map-search-panel-wrapper-"+controller_hash));
						}
					} else {
						post_params.with_map = 0;
						post_params.map_listings = 0;
					}
				}
			}

			w2dc_show_more_button_processing = true;
			$.post(
				w2dc_js_objects.ajaxurl,
				post_params,
				w2dc_completeAJAXShowMore(button),
				'json'
			);
		}
	}
	var w2dc_completeAJAXShowMore = function(button) {
		return function(response_from_the_action_function) {
			w2dc_process_listings_ajax_responce(response_from_the_action_function, false, false, false);
			w2dc_show_more_button_processing = false;
			w2dc_delete_iloader_from_element(button);
			if (response_from_the_action_function.hide_show_more_listings_button) {
				button.hide();
			}
		}
	}

	if (w2dc_js_objects.ajax_load) {
		$("form.w2dc-search-form-submit").each(function() {
			var form = $(this);
			if (form.find('button[type="submit"]').is(":hidden")) {
				var inputs = form.find('input, select').not(':input[type=text], :input[type=submit], :input[type=reset]');
				inputs.on("change", {"form": form}, function(e) {
					var form = e.data.form;
					form.find('button[type=submit]').trigger('click');
				});
			}
		});
		$("body").on("submit", ".w2dc-search-form-submit", function(e) {
			var search_inputs = $(this).serializeArray();
			var post_params = {};
			for (var attr in search_inputs) {
				// checkboxes search form values
				if (search_inputs[attr]['name'].indexOf('[]') != -1) {
					if (typeof post_params[search_inputs[attr]['name']] == 'undefined')
						post_params[search_inputs[attr]['name']] = [];
					post_params[search_inputs[attr]['name']].push(search_inputs[attr]['value']);
				} else
					post_params[search_inputs[attr]['name']] = search_inputs[attr]['value'];
			}
			
			var controller_hash = false;
			if (typeof post_params['hash'] != 'undefined' && post_params['hash']) {
				controller_hash = post_params['hash'];
			}

			if (!controller_hash) {
				if (typeof w2dc_controller_args_array != 'undefined' && Object.keys(w2dc_controller_args_array)) {
					for (var _controller_hash in w2dc_controller_args_array) {
						if ($("#w2dc-controller-"+_controller_hash).data("custom-home") == 1) {
							controller_hash = _controller_hash;
							post_params["custom_home"] = 1;
							post_params["controller"] = 'directory_controller';
							break;
						}
					}
				}
			}
			if (!controller_hash) {
				$(".w2dc-maps-canvas").each(function() {
					if ($(this).data("custom-home") == 1) {
						controller_hash = $(this).data("shortcode-hash");
						post_params["custom_home"] = 1;
						post_params["controller"] = 'directory_controller';
						return false;
					}
				});
			}

			if (controller_hash) {
				e.preventDefault();
				var search_button_obj = null;
				if ($(this).find('button[type="submit"]')) {
					search_button_obj = $(this).find('button[type="submit"]');
					if (search_button_obj.is(":visible")) {
						w2dc_add_iloader_on_element(search_button_obj);
					}
				}

				post_params['hash'] = controller_hash;

				var ajax_params = {'action': 'w2dc_controller_request'};
				// collect needed params from listing block
				var listings_args_array;
				if (listings_args_array = w2dc_get_controller_args_array(controller_hash)) {
					ajax_params.hide_order = listings_args_array.hide_order;
					ajax_params.hide_count = listings_args_array.hide_count;
					ajax_params.hide_paginator = listings_args_array.hide_paginator;
					ajax_params.show_views_switcher = listings_args_array.show_views_switcher;
					ajax_params.listings_view_type = listings_args_array.listings_view_type;
					ajax_params.listings_view_grid_columns = listings_args_array.listings_view_grid_columns;
					ajax_params.listing_thumb_width = listings_args_array.listing_thumb_width;
					ajax_params.wrap_logo_list_view = listings_args_array.wrap_logo_list_view;
					ajax_params.logo_animation_effect = listings_args_array.logo_animation_effect;
					ajax_params.grid_view_logo_ratio = listings_args_array.grid_view_logo_ratio;
					ajax_params.scrolling_paginator = listings_args_array.scrolling_paginator;
					ajax_params.perpage = listings_args_array.perpage;
					ajax_params.onepage = listings_args_array.onepage;
					// do not send order params by defaut, send them when already was a click on order buttons, and we prevent failure when ordering by distance
					if (w2dc_find_get_parameter('order_by')) {
						ajax_params.order = listings_args_array.order;
						ajax_params.order_by = listings_args_array.order_by;
						post_params["order"] = listings_args_array.order;
						post_params["order_by"] = listings_args_array.order_by;
					}
					ajax_params.base_url = listings_args_array.base_url;
					if (typeof listings_args_array.directories != 'undefined') {
						ajax_params.directories = listings_args_array.directories;
					}
				}
				// collect needed params from map attributes
				if (typeof ajax_params.perpage == 'undefined') {
					var map_attrs_array;
					if (map_attrs_array = w2dc_get_map_markers_attrs_array(controller_hash))
						if (typeof map_attrs_array.map_attrs.num != 'undefined')
							ajax_params.perpage = map_attrs_array.map_attrs.num;
				}

				var map_attrs_array;
				if (map_attrs_array = w2dc_get_map_markers_attrs_array(controller_hash)) {
					// save new search parameters for the map
					for (var attrname in post_params) { map_attrs_array.map_attrs[attrname] = post_params[attrname]; }

					// repair ajax_loading after w2dc_drawFreeHandPolygon
					if (typeof w2dc_get_original_w2dc_map_markers_attrs_array(controller_hash).map_attrs.ajax_loading != 'undefined' && w2dc_get_original_w2dc_map_markers_attrs_array(controller_hash).map_attrs.ajax_loading == 1) {
						map_attrs_array.map_attrs.ajax_loading = 1;
						google.maps.event.addListener(w2dc_maps[controller_hash], 'idle', function() {
							w2dc_setAjaxMarkers(w2dc_maps[controller_hash], controller_hash);
						});
					}
					// remove drawing_state after w2dc_drawFreeHandPolygon
					if (typeof map_attrs_array.map_attrs.drawing_state != 'undefined') {
						delete map_attrs_array.map_attrs.drawing_state;
					}
					if (typeof map_attrs_array.map_attrs.ajax_loading != 'undefined' && map_attrs_array.map_attrs.ajax_loading == 1) {
						delete map_attrs_array.map_attrs.locations;
						delete map_attrs_array.map_attrs.swLat;
						delete map_attrs_array.map_attrs.swLng;
						delete map_attrs_array.map_attrs.neLat;
						delete map_attrs_array.map_attrs.neLng;
						delete map_attrs_array.map_attrs.action;
						var enable_clusters = map_attrs_array.enable_clusters;
						var enable_radius_circle = map_attrs_array.enable_radius_circle;
						var show_summary_button = map_attrs_array.show_summary_button;
						var show_readmore_button = map_attrs_array.show_readmore_button;

						map_attrs_array.map_attrs.include_categories_children = 1;
						w2dc_setAjaxMarkers(w2dc_maps[controller_hash], controller_hash, search_button_obj);
						return false;
					}
				}
				
				if ($("#w2dc-map-listings-panel-"+controller_hash).length) {
					post_params.map_listings = 1;
					w2dc_ajax_loader_target_show($("#w2dc-map-search-panel-wrapper-"+controller_hash));
				}

				if ($("#w2dc-controller-"+controller_hash).length) {
					if ($(this).hasClass('w2dc-map-search-form')) {
						var anchor = false;
					} else {
						if ($(this).data("scroll-to") == "listings") {
							var anchor = $('#w2dc-controller-'+controller_hash);
						} else if ($(this).data("scroll-to") == "map") {
							var anchor = $('#w2dc-maps-canvas-'+controller_hash);
						}
					}
					if (typeof window["w2dc_sticky_scroll_toppadding_"+controller_hash] != 'undefined') {
						var sticky_scroll_toppadding = window["w2dc_sticky_scroll_toppadding_"+controller_hash];
					} else {
						var sticky_scroll_toppadding = 0;
					}
					w2dc_ajax_loader_target_show($('#w2dc-controller-'+controller_hash), anchor, sticky_scroll_toppadding);
				} else {
			   		post_params.without_listings = 1;
				}

				for (var attrname in ajax_params) { post_params[attrname] = ajax_params[attrname]; }

				if ($("#w2dc-maps-canvas-"+controller_hash).length) {
					w2dc_ajax_loader_target_show($('#w2dc-maps-canvas-'+controller_hash));
			   		post_params.with_map = 1;
			   		if (map_attrs_array && (typeof map_attrs_array.map_attrs.map_markers_is_limit == 'undefined' || map_attrs_array.map_attrs.map_markers_is_limit == 1)) {
			   			post_params.map_markers_is_limit = 1;
			   		}
			   	}

				if (
						(typeof post_params.location_id == 'undefined' || !post_params.address) &&
						typeof post_params.address != 'undefined' &&
						post_params.address &&
						typeof post_params.radius != 'undefined' &&
						post_params.radius
				) {
					if (typeof google.maps != 'undefined' && typeof google.maps.places != 'undefined') {
						var geocoder = new google.maps.Geocoder();
						geocoder.geocode({'address': post_params.address}, function(results, status) {
						    if (status == google.maps.GeocoderStatus.OK) {
						    	post_params.start_latitude = results[0].geometry.location.lat();
						    	post_params.start_longitude = results[0].geometry.location.lng();
						    } else {
								//alert('Sorry, we are unable to geocode entered address!');
							}
						    w2dc_startAJAXSearch(post_params, search_button_obj);
						});
					} else {
						alert("Google Geocoder was not loaded. Check Google API keys and enable Google Maps Geocoding API in Google APIs console.");
						w2dc_startAJAXSearch(post_params, search_button_obj);
					}
				} else {
					w2dc_startAJAXSearch(post_params, search_button_obj);
				}
				
				window.history.pushState("", "", "?"+$.param(post_params));
				var url = document.location.pathname;
				for (var attrname in post_params) {
					var sep = (url.indexOf('?') > -1) ? '&' : '?';
					url = url + sep + attrname + '=' + post_params[attrname];
				}
				if (typeof ga == 'function') {
					ga('send', 'pageview', url);
				}
			}
		});
		var w2dc_search_requests_counter = 0;
		var w2dc_startAJAXSearch = function(post_params, search_button_obj) {
			w2dc_search_requests_counter++;
			$.post(
				w2dc_js_objects.ajaxurl,
				post_params,
				w2dc_completeAJAXSearch(search_button_obj),
				'json'
			);
		}
		var w2dc_completeAJAXSearch = function(search_button_obj) {
			return function(response_from_the_action_function) {
				w2dc_search_requests_counter--;
				if (w2dc_search_requests_counter == 0) {
					w2dc_process_listings_ajax_responce(response_from_the_action_function, true, true, true);
					if (search_button_obj) {
						w2dc_delete_iloader_from_element(search_button_obj);
					}
				}
			}
		}
		// needed hack for mobile devices - draggable makes input text fields uneditable
		$('body').on('click', '.w2dc-map-search-wrapper input', function() {
		    $(this).focus();
		});

		$('body').on('click', '.w2dc-map-search-toggle, .w2dc-map-sidebar-toggle', function(e) {
			e.preventDefault();
			var id = $(this).data('id');
			$("#w2dc-map-search-form-"+id).toggleClass("w2dc-sidebar-open");
			$("#w2dc-maps-canvas-"+id).toggleClass("w2dc-sidebar-open");
			$("#w2dc-map-search-panel-wrapper-"+id).on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
				google.maps.event.trigger(w2dc_maps[id], 'resize');
			});
		});

		$('body').on('click', '.w2dc-orderby-links a', function(e) {
			e.preventDefault();

			var href = $(this).attr('href');
			var controller_hash = $(this).data('controller-hash');
			var listings_args_array;
			if (listings_args_array = w2dc_get_controller_args_array(controller_hash)) {
				var post_params = $.extend({}, listings_args_array);
				var ajax_params = {'action': 'w2dc_controller_request', 'order_by': $(this).data('orderby'), 'order': $(this).data('order'), 'paged': 1, 'hash': controller_hash};
				for (var attrname in ajax_params) { post_params[attrname] = ajax_params[attrname]; }

				if ($("#w2dc-maps-canvas-"+controller_hash).length) {
					var map_attrs_array;
					if (map_attrs_array = w2dc_get_map_markers_attrs_array(controller_hash)) {
						if ((typeof map_attrs_array.map_attrs.ajax_loading == 'undefined' || map_attrs_array.map_attrs.ajax_loading == 0)
						&&
						(typeof map_attrs_array.map_attrs.drawing_state == 'undefined' || map_attrs_array.map_attrs.drawing_state == 0)
						&&
						(typeof map_attrs_array.map_attrs.map_markers_is_limit == 'undefined' || map_attrs_array.map_attrs.map_markers_is_limit == 1)) {
							w2dc_ajax_loader_target_show($('#w2dc-maps-canvas-'+controller_hash));
						  	post_params.with_map = 1;
						  	post_params.map_markers_is_limit = 1;
						  	if ($("#w2dc-map-listings-panel-"+controller_hash).length) {
								post_params.map_listings = 1;
								w2dc_ajax_loader_target_show($("#w2dc-map-search-panel-wrapper-"+controller_hash));
							}
						} else {
							post_params.with_map = 0;
							post_params.map_listings = 0;
						}
							
					}
				}
				
				window.history.pushState("", "", href);

				w2dc_ajax_loader_target_show($('#w2dc-controller-'+controller_hash));
				$.post(
					w2dc_js_objects.ajaxurl,
					post_params,
					function(response_from_the_action_function) {
						w2dc_process_listings_ajax_responce(response_from_the_action_function, true, true, true);
					},
					'json'
				);
			}
		});

		$('body').on('click', '.w2dc-pagination li a', function(e) {
			if ($(this).data('controller-hash')) {
				e.preventDefault();

				var href = $(this).attr('href');
				var controller_hash = $(this).data('controller-hash');
				var paged = $(this).data('page');
				var listings_args_array;
				if (listings_args_array = w2dc_get_controller_args_array(controller_hash)) {
					var post_params = $.extend({}, listings_args_array);
					
					var existing_listings = '';
					$("#w2dc-controller-"+controller_hash+" .w2dc-listings-block-content article").each(function(index) {
						existing_listings = $(this).attr("id").replace("post-", "") + "," + existing_listings;
					});

					var ajax_params = {'action': 'w2dc_controller_request', 'paged': paged, 'existing_listings': existing_listings, 'hash': controller_hash};
					for (var attrname in ajax_params) { post_params[attrname] = ajax_params[attrname]; }
							
					if ($("#w2dc-maps-canvas-"+controller_hash).length) {
						var map_attrs_array;
						if (map_attrs_array = w2dc_get_map_markers_attrs_array(controller_hash))
							if ((typeof map_attrs_array.map_attrs.ajax_loading == 'undefined' || map_attrs_array.map_attrs.ajax_loading == 0)
							&&
							(typeof map_attrs_array.map_attrs.drawing_state == 'undefined' || map_attrs_array.map_attrs.drawing_state == 0)
							&&
							(typeof map_attrs_array.map_attrs.map_markers_is_limit == 'undefined' || map_attrs_array.map_attrs.map_markers_is_limit == 1)) {
								w2dc_ajax_loader_target_show($('#w2dc-maps-canvas-'+controller_hash));
							  	post_params.with_map = 1;
							  	post_params.map_markers_is_limit = 1;
							  	if ($("#w2dc-map-listings-panel-"+controller_hash).length) {
									post_params.map_listings = 1;
									w2dc_ajax_loader_target_show($("#w2dc-map-search-panel-wrapper-"+controller_hash));
								}
							} else {
								post_params.with_map = 0;
								post_params.map_listings = 0;
							}
					}
					var anchor = $('#w2dc-controller-'+controller_hash);
					
					window.history.pushState("", "", href);

					if (typeof window["w2dc_sticky_scroll_toppadding_"+controller_hash] != 'undefined') {
						var sticky_scroll_toppadding = window["w2dc_sticky_scroll_toppadding_"+controller_hash];
					} else {
						var sticky_scroll_toppadding = 0;
					}
					w2dc_ajax_loader_target_show($('#w2dc-controller-'+controller_hash), anchor, sticky_scroll_toppadding);
					$.post(
						w2dc_js_objects.ajaxurl,
						post_params,
						function(response_from_the_action_function) {
							w2dc_process_listings_ajax_responce(response_from_the_action_function, true, false, true);
						},
						'json'
					);
				}
			}
		});
	}

	$('body').on('click', '.w2dc-list-view-btn', function() {
		var button = $(this);
		var hash = button.data('shortcode-hash');
		var listings_block = $('#w2dc-controller-'+hash).find('.w2dc-listings-block');
		if (listings_block.hasClass('w2dc-listings-grid')) {
			listings_block.find('.w2dc-listings-block-content').fadeTo("fast", 0, function() {
				button.removeClass('w2dc-btn-default').addClass('w2dc-btn-primary');
				button.parents('.w2dc-views-links').find('.w2dc-grid-view-btn').removeClass('w2dc-btn-primary').addClass('w2dc-btn-default');
				listings_block.removeClass('w2dc-listings-grid w2dc-listings-grid-1 w2dc-listings-grid-2 w2dc-listings-grid-3 w2dc-listings-grid-4');
				listings_block.addClass('w2dc-listings-list-view');
				listings_block.find('article.w2dc-listing').each(function() {
					$(this).css('height', 'auto');
				});
				$.cookie("w2dc_listings_view_"+hash, 'list', {expires: 365, path: "/"});
			});
			listings_block.find('.w2dc-listings-block-content').fadeTo("fast", 1);
		}
	});
	$('body').on('click', '.w2dc-grid-view-btn', function() {
		var button = $(this);
		var hash = button.data('shortcode-hash');
		var listings_block = $('#w2dc-controller-'+hash).find('.w2dc-listings-block');
		if (!listings_block.hasClass('w2dc-listings-grid')) {
			listings_block.find('.w2dc-listings-block-content').fadeTo("fast", 0, function() {
				button.removeClass('w2dc-btn-default').addClass('w2dc-btn-primary');
				button.parents('.w2dc-views-links').find('.w2dc-list-view-btn').removeClass('w2dc-btn-primary').addClass('w2dc-btn-default');
				listings_block.removeClass('w2dc-listings-list-view');
				listings_block.addClass('w2dc-listings-grid').addClass('w2dc-listings-grid-'+button.data('grid-columns'));
				w2dc_equalColumnsHeight();
				$.cookie("w2dc_listings_view_"+hash, 'grid', {expires: 365, path: "/"});
			});
			listings_block.find('.w2dc-listings-block-content').fadeTo("fast", 1);
		}
	});
	
	$(".w2dc-remove-from-favourites-list").click(function() {
		var listing_id = $(this).attr("listingid");
		
		if ($.cookie("favourites") != null) {
			var favourites_array = $.cookie("favourites").split('*');
		} else {
			var favourites_array = new Array();
		}

		for (var count=0; count<favourites_array.length; count++) {
			if (favourites_array[count] == listing_id) {
				delete favourites_array[count];
			}
		}

		$(".w2dc-listing#post-"+listing_id).remove();
		
		$.cookie("favourites", favourites_array.join('*'), {expires: 365, path: "/"});
		return false;
	});
	
	// AJAX Contact form
	$(document).on('submit', '#w2dc_contact_form', function(e) {
		e.preventDefault();

	       var $this = $(this);
	       $this.css('opacity', '0.5');
	       $this.find('.w2dc-send-message-button').val(w2dc_js_objects.send_button_sending).attr('disabled', 'disabled');
	       $this.find('#w2dc_contact_warning').hide();

	       var data = {
	           action: "w2dc_contact_form",
	           listing_id: $('#w2dc_listing_id').val(),
	           contact_name: $('#w2dc_contact_name').val(),
	           contact_email: $('#w2dc_contact_email').val(),
	           contact_message: $('#w2dc_contact_message').val(),
	           security: $('#w2dc_contact_nonce').val(),
	           'g-recaptcha-response': ($('#g-recaptcha-response').length ? $('#g-recaptcha-response').val() : '')
	       };

	       $.ajax({
	        	url: w2dc_js_objects.ajaxurl,
	        	type: "POST",
	        	dataType: "json",
	            data: data,
	            global: false,
	            success: function(response_from_the_action_function){
	            	if (response_from_the_action_function != 0) {
	            		if (response_from_the_action_function.error == '') {
			                $('#w2dc_contact_name').val(''),
			 	            $('#w2dc_contact_email').val(''),
			 	            $('#w2dc_contact_message').val(''),
			                $this.find('#w2dc_contact_warning').html(response_from_the_action_function.success).show();
	            		} else {
	            			$this.find('#w2dc_contact_warning').html(response_from_the_action_function.error).show();
	            		}
	            		$this.css('opacity', '1');
		                $this.find('.w2dc-send-message-button').val(w2dc_js_objects.send_button_text).removeAttr('disabled');
	            	}
	            }
	        });
	});
})(jQuery);


// google_maps_view.js -------------------------------------------------------------------------------------------------------------------------------------------
(function($) {
	"use strict";

	/* Stack-based Douglas Peucker line simplification routine 
	returned is a reduced GLatLng array 
	After code by  Dr. Gary J. Robinson,
	Environmental Systems Science Centre,
	University of Reading, Reading, UK
	*/
	function w2dc_GDouglasPeucker(source, kink) {
		var n_source, n_stack, n_dest, start, end, i, sig;    
		var dev_sqr, max_dev_sqr, band_sqr;
		var x12, y12, d12, x13, y13, d13, x23, y23, d23;
		var F = ((Math.PI / 180.0) * 0.5 );
		var index = new Array();
		var sig_start = new Array();
		var sig_end = new Array();
	
		if ( source.length < 3 ) 
			return(source);
	
		n_source = source.length;
		band_sqr = kink * 360.0 / (2.0 * Math.PI * 6378137.0);
		band_sqr *= band_sqr;
		n_dest = 0;
		sig_start[0] = 0;
		sig_end[0] = n_source-1;
		n_stack = 1;
	
		while ( n_stack > 0 ) {
			start = sig_start[n_stack-1];
			end = sig_end[n_stack-1];
			n_stack--;
	
			if ( (end - start) > 1 ) {
				x12 = (source[end].lng() - source[start].lng());
				y12 = (source[end].lat() - source[start].lat());
				if (Math.abs(x12) > 180.0) 
					x12 = 360.0 - Math.abs(x12);
				x12 *= Math.cos(F * (source[end].lat() + source[start].lat()));
				d12 = (x12*x12) + (y12*y12);
	
				for ( i = start + 1, sig = start, max_dev_sqr = -1.0; i < end; i++ ) {                                    
					x13 = (source[i].lng() - source[start].lng());
					y13 = (source[i].lat() - source[start].lat());
					if (Math.abs(x13) > 180.0) 
						x13 = 360.0 - Math.abs(x13);
					x13 *= Math.cos (F * (source[i].lat() + source[start].lat()));
					d13 = (x13*x13) + (y13*y13);
	
					x23 = (source[i].lng() - source[end].lng());
					y23 = (source[i].lat() - source[end].lat());
					if (Math.abs(x23) > 180.0) 
						x23 = 360.0 - Math.abs(x23);
					x23 *= Math.cos(F * (source[i].lat() + source[end].lat()));
					d23 = (x23*x23) + (y23*y23);
	
					if ( d13 >= ( d12 + d23 ) )
						dev_sqr = d23;
					else if ( d23 >= ( d12 + d13 ) )
						dev_sqr = d13;
					else
						dev_sqr = (x13 * y12 - y13 * x12) * (x13 * y12 - y13 * x12) / d12;// solve triangle
	
					if ( dev_sqr > max_dev_sqr  ){
						sig = i;
						max_dev_sqr = dev_sqr;
					}
				}
	
				if ( max_dev_sqr < band_sqr ) {
					index[n_dest] = start;
					n_dest++;
				} else {
					n_stack++;
					sig_start[n_stack-1] = sig;
					sig_end[n_stack-1] = end;
					n_stack++;
					sig_start[n_stack-1] = start;
					sig_end[n_stack-1] = sig;
				}
			} else {
				index[n_dest] = start;
				n_dest++;
			}
		}
		index[n_dest] = n_source-1;
		n_dest++;
	
		var r = new Array();
		for(var i=0; i < n_dest; i++)
			r.push(source[index[i]]);
	
		return r;
	}
	function w2dc_drawFreeHandPolygon(map_id) {
		var poly = new google.maps.Polyline({
			map: w2dc_maps[map_id],
			clickable:false,
			strokeColor: '#AA2143',
			strokeWeight: 2,
			zIndex: 1000,
		});
		
		var move = google.maps.event.addListener(w2dc_maps[map_id], 'mousemove', function(e) {
			poly.getPath().push(e.latLng);
		});
		
		google.maps.event.addListenerOnce(w2dc_maps[map_id], 'mouseup', function(e) {
			google.maps.event.removeListener(move);
			var path = poly.getPath();
			poly.setMap(null);
		
			var theArrayofLatLng = path.b;
			var ArrayforPolygontoUse = w2dc_GDouglasPeucker(theArrayofLatLng, 50);
		
			var geo_poly = [];
			var lat_lng;
			for (lat_lng in ArrayforPolygontoUse) {
				geo_poly.push({'lat': ArrayforPolygontoUse[lat_lng].lat(), 'lng': ArrayforPolygontoUse[lat_lng].lng()});
			}

			var map_attrs_array;
			if (geo_poly && (map_attrs_array = w2dc_get_map_markers_attrs_array(map_id))) {
				w2dc_ajax_loader_target_show($('#w2dc-maps-canvas-'+map_id));
	
				var ajax_params = {};
				for (var attrname in map_attrs_array.map_attrs) { ajax_params[attrname] = map_attrs_array.map_attrs[attrname]; }
				ajax_params.action = 'w2dc_search_by_poly';
				ajax_params.hash = map_id;
				ajax_params.geo_poly = geo_poly;
				ajax_params.num = -1; // do not limit markers on map

				var listings_args_array;
				if (listings_args_array = w2dc_get_controller_args_array(map_id)) {
					ajax_params.hide_order = listings_args_array.hide_order;
					ajax_params.hide_count = listings_args_array.hide_count;
					ajax_params.hide_paginator = listings_args_array.hide_paginator;
					ajax_params.show_views_switcher = listings_args_array.show_views_switcher;
					ajax_params.listings_view_type = listings_args_array.listings_view_type;
					ajax_params.listings_view_grid_columns = listings_args_array.listings_view_grid_columns;
					ajax_params.listing_thumb_width = listings_args_array.listing_thumb_width;
					ajax_params.wrap_logo_list_view = listings_args_array.wrap_logo_list_view;
					ajax_params.logo_animation_effect = listings_args_array.logo_animation_effect;
					ajax_params.grid_view_logo_ratio = listings_args_array.grid_view_logo_ratio;
					ajax_params.scrolling_paginator = listings_args_array.scrolling_paginator;
					ajax_params.perpage = listings_args_array.perpage;
					ajax_params.onepage = listings_args_array.onepage;
					ajax_params.order = listings_args_array.order;
					ajax_params.order_by = listings_args_array.order_by;
					ajax_params.base_url = listings_args_array.base_url;
	
					w2dc_ajax_loader_target_show($('#w2dc-controller-'+map_id));
				} else {
					ajax_params.without_listings = 1;
				}
				
				if ($("#w2dc-map-listings-panel-"+map_id).length) {
					ajax_params.map_listings = 1;
					w2dc_ajax_loader_target_show($("#w2dc-map-search-panel-wrapper-"+map_id));
				}

				console.log(ajax_params);
				$.post(
					w2dc_js_objects.ajaxurl,
					ajax_params,
					function(response_from_the_action_function) {
						w2dc_process_listings_ajax_responce(response_from_the_action_function, true, false, false);
					},
					'json'
				);
			 
				var polyOptions = {
					map: w2dc_maps[map_id],
					fillColor: '#0099FF',
					fillOpacity: 0.3,
					strokeColor: '#AA2143',
					strokeWeight: 1,
					clickable: false,
					zIndex: 1,
					path:ArrayforPolygontoUse,
					editable: false
				}
	
				w2dc_polygons[map_id] = new google.maps.Polygon(polyOptions);
			}
	
			var drawButton = $(w2dc_maps[map_id].getDiv()).find('.w2dc-map-draw').get(0);
			drawButton.drawing_state = 0;
			$('body').unbind('touchmove');
			w2dc_enableDrawing(map_id);
			$(w2dc_maps[map_id].getDiv()).css('cursor', 'auto');
			$(drawButton).removeClass('w2dc-btn-active');
			w2dc_enableDrawing(map_id);
			google.maps.event.clearListeners(w2dc_maps[map_id].getDiv(), 'mousedown');
			
			var editButton = $(w2dc_maps[map_id].getDiv()).find('.w2dc-map-edit').get(0);
			$(editButton).removeAttr('disabled');
		});
	}
	function w2dc_disableDrawing(map_id) {
		$(w2dc_maps[map_id].getDiv()).find('.w2dc-map-custom-controls').hide();
		if ($('#w2dc-map-search-wrapper-'+map_id).length) $('#w2dc-map-search-wrapper-'+map_id).hide();
		w2dc_maps[map_id].setOptions({
			draggable: false, 
			scrollwheel: false,
			streetViewControl: false
		});
	}
	function w2dc_enableDrawing(map_id) {
		$(w2dc_maps[map_id].getDiv()).find('.w2dc-map-custom-controls').show();
		if ($('#w2dc-map-search-wrapper-'+map_id).length) $('#w2dc-map-search-wrapper-'+map_id).show();
		
		var attrs_array = w2dc_get_map_markers_attrs_array(map_id);
		var enable_wheel_zoom = attrs_array.enable_wheel_zoom;
		var enable_dragging_touchscreens = attrs_array.enable_dragging_touchscreens;
		if (enable_dragging_touchscreens || !('ontouchstart' in document.documentElement))
			var enable_dragging = true;
		else
			var enable_dragging = false;

		w2dc_maps[map_id].setOptions({
			draggable: enable_dragging, 
			scrollwheel: enable_wheel_zoom,
			streetViewControl: true
		});
	}
	function w2dc_createDummyDiv(){
		var controlDiv = document.createElement('div');
	    $(controlDiv).addClass('w2dc-map-dummy-div');
		controlDiv.index = -1;
		return controlDiv;
	}
	
	window.w2dc_show_on_map_links = function() {
		$(".w2dc-show-on-map").each(function() {
			var location_id = $(this).data("location-id");

			var passed = false;
			for (var map_id in w2dc_maps) {
				if (typeof w2dc_global_locations_array[map_id] != 'undefined') {
					for (var i=0; i<w2dc_global_locations_array[map_id].length; i++) {
						if (typeof w2dc_global_locations_array[map_id][i] == 'object') {
							if (location_id == w2dc_global_locations_array[map_id][i].id) {
								passed = true;
							}
						}
					}
				}
			}
			if (passed) {
				$(this).parent('.w2dc-listing-figcaption-option').show();
			} else {
				$(this).css({'cursor': 'auto'});
				if ($(this).hasClass('w2dc-btn')) {
					$(this).hide();
				}
			}
		});
	}

	function w2dc_load_maps() {
		for (var i=0; i<w2dc_map_markers_attrs_array.length; i++)
			if (typeof w2dc_maps[w2dc_map_markers_attrs_array[i].map_id] == 'undefined') // workaround for "tricky" themes and plugins to load maps twice
				w2dc_load_map(i);

		w2dc_show_on_map_links();
		
		w2dc_geolocatePosition();
	}

	window.w2dc_load_maps_api = function() {
		$(document).trigger('w2dc_google_maps_api_loaded');

		// are there any markers?
		if (typeof w2dc_map_markers_attrs_array != 'undefined' && w2dc_map_markers_attrs_array.length) {
			_w2dc_map_markers_attrs_array = JSON.parse(JSON.stringify(w2dc_map_markers_attrs_array));
			google.maps.event.addDomListener(window, 'load', w2dc_load_maps());
		}

		w2dc_load_ajax_initial_elements();

		$(".w2dc-field-autocomplete").each( function() {
			if (google.maps && google.maps.places) {
				if (w2dc_google_maps_objects.address_autocomplete_code != '0')
					var options = { componentRestrictions: {country: w2dc_google_maps_objects.address_autocomplete_code}};
				else
					var options = { };
				var searchBox = new google.maps.places.Autocomplete(this, options);
			}
		});

		if ($(".direction_button").length) {
			var map_id = $(".direction_button").attr("id").replace("get_direction_button_", "");

			var directionsService = new google.maps.DirectionsService();
			var directionsDisplay = new google.maps.DirectionsRenderer({map: w2dc_maps[map_id]})
			directionsDisplay.setPanel(document.getElementById("route_"+map_id));
		}
		
		$(".direction_button").click(function() {
			map_id = $(".direction_button").attr("id").replace("get_direction_button_", "");
			// Retrieve the start and end locations and create
			// a DirectionsRequest using DRIVING directions.
			var start = $("#from_direction_"+map_id).val();
			var end = $(".select_direction_"+map_id+":checked").val();
			var request = {
				origin: start,
				destination: end,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};

			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
				} else {
					w2dc_handleDirectionsErrors(status);
				}
			});
		});
		
		$('body').on('click', '.w2dc-show-on-map', function() {
			var location_id = $(this).data("location-id");

			for (var map_id in w2dc_maps) {
				if (typeof w2dc_global_locations_array[map_id] != 'undefined') {
					for (var i=0; i<w2dc_global_locations_array[map_id].length; i++) {
						if (typeof w2dc_global_locations_array[map_id][i] == 'object') {
							if (location_id == w2dc_global_locations_array[map_id][i].id) {
								var location_obj = w2dc_global_locations_array[map_id][i];
								if (!location_obj.is_ajax_markers) {
									w2dc_showInfoWindow(location_obj, location_obj.marker, map_id);
								} else {
									w2dc_ajax_loader_target_show($('#w2dc-maps-canvas-'+map_id));
									
									var post_data = {'location_id': location_obj.id, 'action': 'w2dc_get_map_marker_info'};
									$.ajax({
							    		type: "POST",
							    		url: w2dc_js_objects.ajaxurl,
							    		data: eval(post_data),
							    		map_id: map_id,
							    		dataType: 'json',
							    		success: function(response_from_the_action_function) {
							    			var marker_array = response_from_the_action_function;
							    			var map_coords_1 = marker_array[1];
									    	var map_coords_2 = marker_array[2];
									    	if ($.isNumeric(map_coords_1) && $.isNumeric(map_coords_2)) {
								    			var point = new google.maps.LatLng(map_coords_1, map_coords_2);
						
								    			var new_location_obj = new w2dc_glocation(marker_array[0], point, 
								    				marker_array[3],
								    				marker_array[4],
								    				marker_array[6],
								    				marker_array[7],
								    				marker_array[8],
								    				marker_array[9],
								    				marker_array[10],
								    				marker_array[11],
								    				location_obj.show_summary_button,
								    				location_obj.show_readmore_button,
								    				this.map_id,
								    				true
									    		);
								    			w2dc_showInfoWindow(new_location_obj, location_obj.marker, this.map_id);
									    	}
							    		},
							    		complete: function() {
											w2dc_ajax_loader_target_hide('w2dc-maps-canvas-'+this.map_id);
										}
									});
								}
							}
						}
					}
				}
			}
		});
	}

	//$(function() {
	document.addEventListener("DOMContentLoaded", function() {
		if ((typeof google == 'undefined' || typeof google.maps == 'undefined') && !w2dc_google_maps_objects.notinclude_maps_api) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			var key = '';
			var language = '';
			if (w2dc_google_maps_objects.google_api_key)
				key = "&key="+w2dc_google_maps_objects.google_api_key;
			if (w2dc_js_objects.lang)
				language = "&language="+w2dc_js_objects.lang;
			script.src = "//maps.google.com/maps/api/js?libraries=places"+key+"&callback="+w2dc_google_maps_callback.callback+language;
			document.body.appendChild(script);
		} else {
			w2dc_3rd_party_maps_plugin = true;
			window[w2dc_google_maps_callback.callback]();
		}
	});

	function w2dc_load_map(i) {
		var map_id = w2dc_map_markers_attrs_array[i].map_id;
		var markers_array = w2dc_map_markers_attrs_array[i].markers_array;
		var enable_radius_circle = w2dc_map_markers_attrs_array[i].enable_radius_circle;
		var enable_clusters = w2dc_map_markers_attrs_array[i].enable_clusters;
		var show_summary_button = w2dc_map_markers_attrs_array[i].show_summary_button;
		var map_style_name = w2dc_map_markers_attrs_array[i].map_style_name;
		var draw_panel = w2dc_map_markers_attrs_array[i].draw_panel;
		var show_readmore_button = w2dc_map_markers_attrs_array[i].show_readmore_button;
		var enable_full_screen = w2dc_map_markers_attrs_array[i].enable_full_screen;
		var enable_wheel_zoom = w2dc_map_markers_attrs_array[i].enable_wheel_zoom;
		var enable_dragging_touchscreens = w2dc_map_markers_attrs_array[i].enable_dragging_touchscreens;
		var map_attrs = w2dc_map_markers_attrs_array[i].map_attrs;
		if (document.getElementById("w2dc-maps-canvas-"+map_id)) {
			if (typeof w2dc_fullScreens[map_id] == "undefined" || !w2dc_fullScreens[map_id]) {
				if (!w2dc_js_objects.is_rtl)
					var cposition = google.maps.ControlPosition.RIGHT_TOP;
				else
					var cposition = google.maps.ControlPosition.LEFT_TOP;
				
				if (enable_dragging_touchscreens || !('ontouchstart' in document.documentElement))
					var enable_dragging = true;
				else
					var enable_dragging = false;
				
				if (enable_wheel_zoom)
					var gestureHandling = 'greedy';
				else
					var gestureHandling = 'cooperative';

				var mapOptions = {
						zoom: 1,
						draggable: enable_dragging,
						scrollwheel: enable_wheel_zoom,
						gestureHandling: gestureHandling,
						disableDoubleClickZoom: true,
					    streetViewControl: true,
					    streetViewControlOptions: {
					        position: cposition
					    },
						mapTypeControl: false,
						zoomControl: false,
						panControl: false,
						scaleControl: false,
						fullscreenControl: false
					  }
				if (map_style_name) {
					mapOptions.styles = eval(w2dc_google_maps_objects.map_styles[map_style_name]);
				}
	
			    w2dc_maps[map_id] = new google.maps.Map(document.getElementById("w2dc-maps-canvas-"+map_id), mapOptions);
			    w2dc_maps_attrs[map_id] = map_attrs;
	
			    var customControls;
			    google.maps.event.addListenerOnce(w2dc_maps[map_id], 'idle', function() {
			    	if (typeof w2dc_maps[map_id].controls[cposition].getAt(-1) != 'undefined')
			    		w2dc_maps[map_id].controls[cposition].removeAt(-1);
			    	customControls = document.createElement('div');
				    customControls.index = -1;
				    w2dc_maps[map_id].controls[cposition].push(customControls);
				    $(customControls).addClass('w2dc-map-custom-controls');
				    $(customControls).html('<div class="w2dc-btn-group"><button class="w2dc-btn w2dc-btn-primary w2dc-map-btn-zoom-in"><span class="w2dc-glyphicon w2dc-glyphicon-plus"></span></button><button class="w2dc-btn w2dc-btn-primary w2dc-map-btn-zoom-out"><span class="w2dc-glyphicon w2dc-glyphicon-minus"></span></button></div> <div class="w2dc-btn-group"><button class="w2dc-btn w2dc-btn-primary w2dc-map-btn-roadmap">'+w2dc_maps[map_id].mapTypes.roadmap.name+'</button><button class="w2dc-btn w2dc-btn-primary w2dc-map-btn-satellite">'+w2dc_maps[map_id].mapTypes.satellite.name+'</button>'+(enable_full_screen ? '<button class="w2dc-btn w2dc-btn-primary w2dc-map-btn-fullscreen"><span class="w2dc-glyphicon w2dc-glyphicon-fullscreen"></span></button>' : '')+'</div>');
				    
				    google.maps.event.addDomListener($(customControls).find('.w2dc-map-btn-zoom-in').get(0), 'click', function() {
				    	w2dc_maps[map_id].setZoom(w2dc_maps[map_id].getZoom() + 1);
				    });
				    google.maps.event.addDomListener($(customControls).find('.w2dc-map-btn-zoom-out').get(0), 'click', function() {
				    	w2dc_maps[map_id].setZoom(w2dc_maps[map_id].getZoom() - 1);
				    });
				    google.maps.event.addDomListener($(customControls).find('.w2dc-map-btn-roadmap').get(0), 'click', function() {
				    	w2dc_maps[map_id].setMapTypeId(google.maps.MapTypeId.ROADMAP);
				    });
				    google.maps.event.addDomListener($(customControls).find('.w2dc-map-btn-satellite').get(0), 'click', function() {
				    	w2dc_maps[map_id].setMapTypeId(google.maps.MapTypeId.HYBRID);
				    });
	
				    var interval;
				    var mapDiv = w2dc_maps[map_id].getDiv();
				    var mapDivParent = $(mapDiv).parent().parent();
				    var divStyle = mapDiv.style;
				    if (mapDiv.runtimeStyle)
				        divStyle = mapDiv.runtimeStyle;
				    var originalPos = divStyle.position;
				    var originalWidth = divStyle.width;
				    var originalHeight = divStyle.height;
				    // ie8 hack
				    if (originalWidth === "")
				        originalWidth = mapDiv.style.width;
				    if (originalHeight === "")
				        originalHeight = mapDiv.style.height;
				    var originalTop = divStyle.top;
				    var originalLeft = divStyle.left;
				    var originalZIndex = divStyle.zIndex;
				    var bodyStyle = document.body.style;
				    if (document.body.runtimeStyle)
				        bodyStyle = document.body.runtimeStyle;
				    var originalOverflow = bodyStyle.overflow;
				    var thePanoramaOpened = false;

				    //w2dc_fullScreens[map_id] = true;
				    //openFullScreen();

				    function openFullScreen() {
				    	mapDivParent.after("<div id='w2dc-map-placeholder-"+map_id+"'></div>");
				    	mapDivParent.appendTo('body');
				    	
				    	var center = w2dc_maps[map_id].getCenter();
				        mapDiv.style.position = "fixed";
				        mapDiv.style.width = "100%";
				        mapDiv.style.height = "100%";
				        mapDiv.style.top = "0";
				        mapDiv.style.left = "0";
				        mapDiv.style.zIndex = "100000";
				        $(mapDiv).parent(".w2dc-maps-canvas-wrapper").zIndex(100000);
				        document.body.style.overflow = "hidden";
				        $(customControls).find('.w2dc-map-btn-fullscreen span').removeClass('w2dc-glyphicon-fullscreen');
				        $(customControls).find('.w2dc-map-btn-fullscreen span').addClass('w2dc-glyphicon-resize-small');
				        google.maps.event.trigger(w2dc_maps[map_id], "resize");
				        w2dc_maps[map_id].setCenter(center);
				        
				        var elements_to_zindex = [
				                                  "#w2dc-map-search-wrapper-"+map_id,
				                                  "#w2dc-map-search-panel-wrapper-"+map_id,
				                                  "#w2dc-map-sidebar-toggle-container-"+map_id,
				        ];
				        $(elements_to_zindex).each(function() {
				        	if ($(this).length) {
				        		$(this).css('position', 'fixed').zIndex(100001);
				        	}
				        });
				    }
				    function closeFullScreen() {
				    	$('#w2dc-map-placeholder-'+map_id).after(mapDivParent);
				    	$('#w2dc-map-placeholder-'+map_id).detach();
				    	
				    	var center = w2dc_maps[map_id].getCenter();
			            if (originalPos === "") {
			                mapDiv.style.position = "relative";
			            } else {
			                mapDiv.style.position = originalPos;
			            }
			            mapDiv.style.width = originalWidth;
			            mapDiv.style.height = originalHeight;
			            mapDiv.style.top = originalTop;
			            mapDiv.style.left = originalLeft;
			            mapDiv.style.zIndex = originalZIndex;
			            $(mapDiv).parent(".w2dc-maps-canvas-wrapper").zIndex(originalZIndex);
			            document.body.style.overflow = originalOverflow;
			            $(customControls).find('.w2dc-map-btn-fullscreen span').removeClass('w2dc-glyphicon-resize-small');
				        $(customControls).find('.w2dc-map-btn-fullscreen span').addClass('w2dc-glyphicon-fullscreen');
	
			            google.maps.event.trigger(w2dc_maps[map_id], "resize");
			            w2dc_maps[map_id].setCenter(center);
			            
			            var elements_to_zindex = [
				                                  "#w2dc-map-search-wrapper-"+map_id,
				                                  "#w2dc-map-search-panel-wrapper-"+map_id,
				                                  "#w2dc-map-sidebar-toggle-container-"+map_id,
				        ];
				        $(elements_to_zindex).each(function() {
				        	if ($(this).length) {
				        		$(this).css('position', 'absolute').zIndex(1);
				        	}
				        });
				    }
				    if (enable_full_screen) {
				    	google.maps.event.addDomListener($(customControls).find('.w2dc-map-btn-fullscreen').get(0), 'click', function() {
					    	if (typeof w2dc_fullScreens[map_id] == "undefined" || !w2dc_fullScreens[map_id]) {
					    		$("#w2dc-maps-canvas-wrapper-"+map_id).addClass("w2dc-map-full-screen");
					    		w2dc_fullScreens[map_id] = true;
					    		openFullScreen();
					    	} else {
					    		$("#w2dc-maps-canvas-wrapper-"+map_id).removeClass("w2dc-map-full-screen");
					    		w2dc_fullScreens[map_id] = false;
					    		closeFullScreen();
					    	}
					    });
					    var thePanorama = w2dc_maps[map_id].getStreetView();
					    google.maps.event.addListener(thePanorama, 'visible_changed', function() {
					    	thePanoramaOpened = (this.getVisible() ? true : false);
					    	if ($("#w2dc-map-search-wrapper-"+map_id).length) {
					    		if (thePanoramaOpened)
					    			$("#w2dc-map-search-wrapper-"+map_id).hide();
					    		else
					    			$("#w2dc-map-search-wrapper-"+map_id).show();
					    	}
					    });
					    $(document).keyup(function(e) {
					    	if (typeof w2dc_fullScreens[map_id] != "undefined" && w2dc_fullScreens[map_id] && e.keyCode == 27 && !thePanoramaOpened) {
					    		$("#w2dc-maps-canvas-wrapper-"+map_id).removeClass("w2dc-map-full-screen");
					    		closeFullScreen();
					    		w2dc_fullScreens[map_id] = false;
					    	}
					    });
				    }
			    });

			    if (draw_panel) {
				    w2dc_maps[map_id].controls[google.maps.ControlPosition.LEFT_TOP].push(w2dc_createDummyDiv());
				    w2dc_maps[map_id].controls[google.maps.ControlPosition.RIGHT_TOP].push(w2dc_createDummyDiv());
				    w2dc_maps[map_id].controls[google.maps.ControlPosition.TOP_CENTER].push(w2dc_createDummyDiv());
				    
				    var drawPanelWrapper = document.createElement('div');
				    $(drawPanelWrapper).addClass('w2dc-map-draw-panel-wrapper');
				    
				    var drawPanel = document.createElement('div');
				    $(drawPanel).addClass('w2dc-map-draw-panel');
				    drawPanelWrapper.appendChild(drawPanel);

				    w2dc_maps[map_id].controls[google.maps.ControlPosition.TOP_CENTER].push(drawPanelWrapper);

				    var drawButton = document.createElement('button');
				    $(drawButton).addClass('w2dc-btn w2dc-btn-primary w2dc-map-draw').html('<span class="w2dc-glyphicon w2dc-glyphicon-pencil"></span> <span class="w2dc-map-draw-label">'+w2dc_google_maps_objects.draw_area_button+'</span>');
				    drawPanel.appendChild(drawButton);
				    drawButton.map_id = map_id;
					drawButton.drawing_state = 0;
					$(drawButton).click(function(e) {
						var map_id = drawButton.map_id;
						if (this.drawing_state == 0) {
							this.drawing_state = 1;
							$('body').bind('touchmove', function(e){e.preventDefault()});
							w2dc_clearMarkers(map_id);
							w2dc_removeShapes(map_id);
		
							w2dc_disableDrawing(map_id);
							
							var editButton = $(w2dc_maps[map_id].getDiv()).find('.w2dc-map-edit').get(0);
							$(editButton).attr('disabled', 'disabled');
		
							// remove ajax_loading and set drawing_state
							var map_attrs_array;
							if (map_attrs_array = w2dc_get_map_markers_attrs_array(map_id)) {
								map_attrs_array.map_attrs.drawing_state = 1;
								google.maps.event.clearListeners(w2dc_maps[map_id], 'idle');
								delete map_attrs_array.map_attrs.ajax_loading;
							}
			
							$(w2dc_maps[map_id].getDiv()).css('cursor', 'crosshair');
							$(this).toggleClass('w2dc-btn-active');
							google.maps.event.clearListeners(w2dc_maps[map_id].getDiv(), 'mousedown');
							
							w2dc_maps[map_id].getDiv().map_id = map_id;
							google.maps.event.addDomListener(w2dc_maps[map_id].getDiv(), 'mousedown', function(e) {
								var el = e.target;
			                    do {
			                        if ($(el).hasClass('w2dc-map-draw-panel')) {
			                            return;
			                        }
			                    } while (el = el.parentNode);
								w2dc_drawFreeHandPolygon(this.map_id);
							});
						} else if (this.drawing_state == 1) {
							this.drawing_state = 0;
							$('body').unbind('touchmove');
							w2dc_enableDrawing(map_id);
							$(w2dc_maps[map_id].getDiv()).css('cursor', 'auto');
							$(this).toggleClass('w2dc-btn-active');
							google.maps.event.clearListeners(w2dc_maps[map_id].getDiv(), 'mousedown');
							
							// repair ajax_loading and set drawing_state
							var map_attrs_array;
							if (map_attrs_array = w2dc_get_map_markers_attrs_array(map_id)) {
								map_attrs_array.map_attrs.drawing_state = 0;
								if (typeof w2dc_get_original_map_markers_attrs_array(map_id).map_attrs.ajax_loading != 'undefined' && w2dc_get_original_map_markers_attrs_array(map_id).map_attrs.ajax_loading == 1) {
									map_attrs_array.map_attrs.ajax_loading = 1;
									google.maps.event.addListener(w2dc_maps[map_id], 'idle', function() {
										w2dc_setAjaxMarkers(w2dc_maps[map_id], map_id);
									});
								}
							}
						}
					});
				    
				    var editButton = document.createElement('button');
				    $(editButton).addClass('w2dc-btn w2dc-btn-primary w2dc-map-edit').html('<span class="w2dc-glyphicon w2dc-glyphicon-edit"></span> <span class="w2dc-map-edit-label">'+w2dc_google_maps_objects.edit_area_button+'</span>').attr('disabled', 'disabled');
				    drawPanel.appendChild(editButton);
				    editButton.map_id = map_id;
				    editButton.editing_state = 0;
				    $(editButton).click(function(e) {
				    	var map_id = editButton.map_id;
						if (this.editing_state == 0) {
							this.editing_state = 1;
							$(this).toggleClass('w2dc-btn-active');
							$(this).find('.w2dc-map-edit-label').text(w2dc_google_maps_objects.apply_area_button);
							if (typeof w2dc_polygons[map_id] != 'undefined') {
								w2dc_polygons[map_id].setOptions({'editable': true});
							}
						} else if (this.editing_state == 1) {
							this.editing_state = 0;
							$(this).toggleClass('w2dc-btn-active');
							$(this).find('.w2dc-map-edit-label').text(w2dc_google_maps_objects.edit_area_button);
							if (typeof w2dc_polygons[map_id] != 'undefined') {
								w2dc_polygons[map_id].setOptions({'editable': false});
								var path = w2dc_polygons[map_id].getPath();
								var theArrayofLatLng = path.b;
								var geo_poly = [];
								var lat_lng;
								for (lat_lng in theArrayofLatLng) {
									geo_poly.push({'lat': theArrayofLatLng[lat_lng].lat(), 'lng': theArrayofLatLng[lat_lng].lng()});
								}
		
								var map_attrs_array;
								if (geo_poly && (map_attrs_array = w2dc_get_map_markers_attrs_array(map_id))) {
									w2dc_ajax_loader_target_show($('#w2dc-maps-canvas-'+map_id));

									var ajax_params = {};
									for (var attrname in map_attrs_array.map_attrs) { ajax_params[attrname] = map_attrs_array.map_attrs[attrname]; }
									ajax_params.action = 'w2dc_search_by_poly';
									ajax_params.hash = map_id;
									ajax_params.geo_poly = geo_poly;
		
									var listings_args_array;
									if (listings_args_array = w2dc_get_controller_args_array(map_id)) {
										ajax_params.hide_order = listings_args_array.hide_order;
										ajax_params.hide_count = listings_args_array.hide_count;
										ajax_params.hide_paginator = listings_args_array.hide_paginator;
										ajax_params.show_views_switcher = listings_args_array.show_views_switcher;
										ajax_params.listings_view_type = listings_args_array.listings_view_type;
										ajax_params.listings_view_grid_columns = listings_args_array.listings_view_grid_columns;
										ajax_params.listing_thumb_width = listings_args_array.listing_thumb_width;
										ajax_params.wrap_logo_list_view = listings_args_array.wrap_logo_list_view;
										ajax_params.logo_animation_effect = listings_args_array.logo_animation_effect;
										ajax_params.grid_view_logo_ratio = listings_args_array.grid_view_logo_ratio;
										ajax_params.scrolling_paginator = listings_args_array.scrolling_paginator;
										ajax_params.perpage = listings_args_array.perpage;
										ajax_params.onepage = listings_args_array.onepage;
										ajax_params.order = listings_args_array.order;
										ajax_params.order_by = listings_args_array.order_by;
										ajax_params.base_url = listings_args_array.base_url;
		
										w2dc_ajax_loader_target_show($('#w2dc-controller-'+map_id));
									} else {
										ajax_params.without_listings = 1;
									}
									
									if ($("#w2dc-map-listings-panel-"+map_id).length) {
										ajax_params.map_listings = 1;
										w2dc_ajax_loader_target_show($("#w2dc-map-search-panel-wrapper-"+map_id));
									}
								
									$.post(
										w2dc_js_objects.ajaxurl,
										ajax_params,
										function(response_from_the_action_function) {
											w2dc_process_listings_ajax_responce(response_from_the_action_function, true, false, false);
										},
										'json'
									);
								}
							}
						}
				    });
				    
				    var reloadButton = document.createElement('button');
				    $(reloadButton).addClass('w2dc-btn w2dc-btn-primary w2dc-map-reload').html('<span class="w2dc-glyphicon w2dc-glyphicon-refresh"></span> <span class="w2dc-map-reload-label">'+w2dc_google_maps_objects.reload_map_button+'</span>');
				    drawPanel.appendChild(reloadButton);
				    reloadButton.map_id = map_id;
				    $(reloadButton).click(function(e) {
						var map_id = reloadButton.map_id;
						for (var i=0; i<w2dc_map_markers_attrs_array.length; i++) {
							if (w2dc_map_markers_attrs_array[i].map_id == map_id) {
								w2dc_map_markers_attrs_array[i] = JSON.parse(JSON.stringify(_w2dc_map_markers_attrs_array[i]));
								
								$('body').unbind('touchmove');
		
								var editButton = $(w2dc_maps[map_id].getDiv()).find('.w2dc-map-edit').get(0);
								$(editButton).removeClass('w2dc-btn-active');
								$(editButton).find('.w2dc-map-edit-label').text(w2dc_google_maps_objects.edit_area_button);
								$(editButton).attr('disabled', 'disabled');
		
								w2dc_clearMarkers(map_id);
								w2dc_removeShapes(map_id);
								w2dc_load_map(i);
								google.maps.event.trigger(w2dc_maps[map_id], 'idle');
								if (w2dc_global_markers_array[map_id].length) {
						    		var bounds = new google.maps.LatLngBounds();
						    		for (var j=0; j<w2dc_global_markers_array[map_id].length; j++) {
						    			bounds.extend(w2dc_global_markers_array[map_id][j].position);
						    		}
						    		w2dc_maps[map_id].fitBounds(bounds);
						    		
						    		var map_attrs = w2dc_map_markers_attrs_array[i].map_attrs;
							    	if (typeof map_attrs.start_zoom != 'undefined' && map_attrs.start_zoom > 0)
								    	var zoom_level = map_attrs.start_zoom;
									else if (markers_array.length == 1)
										var zoom_level = markers_array[0][5];
								    else if (markers_array.length > 1)
										var zoom_level = 11;
								    else
										var zoom_level = 2;
	
									if (typeof map_attrs.start_latitude != 'undefined' && map_attrs.start_latitude && typeof map_attrs.start_longitude != 'undefined' && map_attrs.start_longitude) {
								    	var start_latitude = map_attrs.start_latitude;
								    	var start_longitude = map_attrs.start_longitude;
								    	var map_center = new google.maps.LatLng(start_latitude, start_longitude);
								    	w2dc_maps[map_id].setCenter(map_center);
									    w2dc_maps[map_id].setZoom(parseInt(zoom_level));
								    }
						    	}
								break;
							}
						}
					});

				    if (w2dc_google_maps_objects.enable_my_location_button) {
						google.maps.event.addListenerOnce(w2dc_maps[map_id], 'tilesloaded', function(){
						    if ($(drawPanel).width() > 502) {
							    var locationButton = document.createElement('button');
							    $(locationButton).addClass('w2dc-btn w2dc-btn-primary w2dc-map-location').html('<span class="w2dc-glyphicon w2dc-glyphicon-screenshot"></span> <span class="w2dc-map-location-label">'+w2dc_google_maps_objects.my_location_button+'</span>');
							    drawPanel.appendChild(locationButton);
							    
							    locationButton.map_id = map_id;
							    $(locationButton).click(function(e) {
									var map_id = locationButton.map_id;
									if (navigator.geolocation) {
								    	navigator.geolocation.getCurrentPosition(
								    		function(position) {
									    		var start_latitude = position.coords.latitude;
									    		var start_longitude = position.coords.longitude;
											    w2dc_maps[map_id].setCenter(new google.maps.LatLng(start_latitude, start_longitude));
									    	},
									    	function(e) {
										   		alert(e.message);
										    },
										   	{timeout: 10000}
									    );
									}
								});
						    }
						});
				    }
			    }
			} // end of (!fullScreen)

		    w2dc_global_markers_array[map_id] = [];
		    w2dc_global_locations_array[map_id] = [];

			var bounds = new google.maps.LatLngBounds();
		    if (markers_array.length) {
		    	if (typeof map_attrs.ajax_markers_loading != 'undefined' && map_attrs.ajax_markers_loading == 1)
					var is_ajax_markers = true;
				else
					var is_ajax_markers = false;
	
		    	var markers = [];
		    	for (var j=0; j<markers_array.length; j++) {
	    			var map_coords_1 = markers_array[j][1];
			    	var map_coords_2 = markers_array[j][2];
			    	if ($.isNumeric(map_coords_1) && $.isNumeric(map_coords_2)) {
		    			var point = new google.maps.LatLng(map_coords_1, map_coords_2);
		    			bounds.extend(point);
	
		    			var location_obj = new w2dc_glocation(
		    				markers_array[j][0],  // location ID
		    				point, 
		    				markers_array[j][3],  // map icon file
		    				markers_array[j][4],  // map icon color
		    				markers_array[j][6],  // listing title
		    				markers_array[j][7],  // logo image
		    				markers_array[j][8],  // listing link
		    				markers_array[j][9],  // content fields output
		    				markers_array[j][10],  // listing link anchor
		    				markers_array[j][11], // is nofollow link
		    				show_summary_button,
		    				show_readmore_button,
		    				map_id,
		    				is_ajax_markers
			    		);
			    		var marker = location_obj.w2dc_placeMarker(map_id);
			    		markers.push(marker);
	
			    		w2dc_global_locations_array[map_id].push(location_obj);
			    	}
	    		}
	
		    	w2dc_setClusters(enable_clusters, map_id, markers)
	
		    	if (enable_radius_circle && typeof window['radius_params_'+map_id] != 'undefined') {
		    		var radius_params = window['radius_params_'+map_id];
					var map_radius = parseFloat(radius_params.radius_value);
					w2dc_draw_radius(radius_params, map_radius, map_id);
				}
		    } else
		    	var zoom_level = 2;
		    
		    
		    if (typeof map_attrs.start_zoom != 'undefined' && map_attrs.start_zoom > 0)
	    		var zoom_level = map_attrs.start_zoom;
		    else if (markers_array.length == 1)
				var zoom_level = markers_array[0][5];
	    	else if (markers_array.length > 1)
				var zoom_level = 11;
	    	else
				var zoom_level = 2;
		    
		    /*google.maps.event.addListener(w2dc_maps[map_id], 'bounds_changed', function() {
				var zoom_level = w2dc_maps[map_id].getZoom();
				w2dc_maps[map_id].setZoom(parseInt(zoom_level));
			});*/

		    if (typeof map_attrs.start_latitude != 'undefined' && map_attrs.start_latitude && typeof map_attrs.start_longitude != 'undefined' && map_attrs.start_longitude) {
	    		var start_latitude = map_attrs.start_latitude;
	    		var start_longitude = map_attrs.start_longitude;
	    		var map_center = new google.maps.LatLng(start_latitude, start_longitude);
	    		w2dc_maps[map_id].setCenter(map_center);
	    		w2dc_maps[map_id].setZoom(parseInt(zoom_level));
		    } else if (typeof map_attrs.start_address != 'undefined' && map_attrs.start_address) {
		    	// use closures here
		    	w2dc_geocodeStartAddress(map_attrs, w2dc_maps[map_id], zoom_level);
		    } else if (markers_array.length) {
		    	if (markers_array.length == 1) {
		    		var map_center = bounds.getCenter();
	    			w2dc_maps[map_id].setCenter(map_center);
				    w2dc_maps[map_id].setZoom(parseInt(zoom_level));
	    		} else if (markers_array.length > 1) {
	    			if (typeof map_attrs.start_zoom != 'undefined' && map_attrs.start_zoom > 0) {
	    				var map_center = bounds.getCenter();
		    			w2dc_maps[map_id].setCenter(map_center);
	    				w2dc_maps[map_id].setZoom(parseInt(map_attrs.start_zoom));
	    			} else {
	    				w2dc_maps[map_id].fitBounds(bounds);
	    			}
	    		}
	    	} else {
	    		var map_center = new google.maps.LatLng(34, 0);
	    		w2dc_maps[map_id].setCenter(map_center);
			    w2dc_maps[map_id].setZoom(parseInt(zoom_level));
	    	}
		    
		    if ((typeof map_attrs.ajax_loading != 'undefined' && map_attrs.ajax_loading == 1)
		    	&& ((typeof map_attrs.start_latitude != 'undefined' && map_attrs.start_latitude && typeof map_attrs.start_longitude != 'undefined' && map_attrs.start_longitude)
		    		||
		    		(typeof map_attrs.start_address != 'undefined' && map_attrs.start_address))
		    ) {
		    	delete map_attrs.swLat;
		    	delete map_attrs.swLng;
				delete map_attrs.neLat;
				delete map_attrs.neLng;
				delete map_attrs.action;
		    	// use closures here
		    	w2dc_setMapAjaxListener(w2dc_maps[map_id], map_id);
		    }
		}
	}

	function w2dc_setMapAjaxListener(map, map_id, search_button_obj) {
		google.maps.event.addListener(map, 'idle', function() {
			w2dc_setAjaxMarkers(map, map_id, search_button_obj);
		});
	}
	function w2dc_geocodeStartAddress(map_attrs, map, zoom_level) {
		function _geocodeStartAddress() {
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address': map_attrs.start_address}, function(results, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
			    	var start_latitude = results[0].geometry.location.lat();
			    	var start_longitude = results[0].geometry.location.lng();
			    } else {
			    	var start_latitude = 34;
			    	var start_longitude = 0;
		    	}
			    map.setCenter(new google.maps.LatLng(start_latitude, start_longitude));
			    map.setZoom(parseInt(zoom_level));
			});
		}
		_geocodeStartAddress();
	}
	function w2dc_geolocatePosition() {
		if (navigator.geolocation) {
			var geolocation_maps = [];
	    	for (var map_id in w2dc_maps_attrs) {
	    		if (typeof w2dc_maps_attrs[map_id].geolocation != 'undefined' && w2dc_maps_attrs[map_id].geolocation == 1) {
	    			geolocation_maps.push({ 'map': w2dc_maps[map_id], 'map_id': map_id});
	    		}
	    	}
	    	if (geolocation_maps.length) {
	    		navigator.geolocation.getCurrentPosition(
	    			function(position) {
		    			var start_latitude = position.coords.latitude;
		    			var start_longitude = position.coords.longitude;
				    	for (var i in geolocation_maps) {
				    		geolocation_maps[i].map.setCenter(new google.maps.LatLng(start_latitude, start_longitude));

				    		var map_id = geolocation_maps[i].map_id;
				    		for (var j=0; j<w2dc_map_markers_attrs_array.length; j++) {
								if (w2dc_map_markers_attrs_array[j].map_id == map_id) {
									w2dc_map_markers_attrs_array[j].map_attrs.start_latitude = start_latitude;
									w2dc_map_markers_attrs_array[j].map_attrs.start_longitude = start_longitude;
								}
				    		}
				    	}
		    		}, 
		    		function(e) {
		    			alert(e.message);
			    	},
			    	{timeout: 10000}
		    	);
	    	}
		}
	}
	function w2dc_project(latLng) {
		var TILE_SIZE = 256;
		var siny = Math.sin(latLng.lat() * Math.PI / 180);
		siny = Math.min(Math.max(siny, -0.9999), 0.9999);
		return new google.maps.Point(
		   TILE_SIZE * (0.5 + latLng.lng() / 360),
		   TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
	}
	window.w2dc_setAjaxMarkers = function(map, map_id, search_button_obj) {
		var attrs_array = w2dc_get_map_markers_attrs_array(map_id);
		var map_attrs = attrs_array.map_attrs;
		var enable_radius_circle = attrs_array.enable_radius_circle;
		var enable_clusters = attrs_array.enable_clusters;
		var show_summary_button = attrs_array.show_summary_button;
		var show_readmore_button = attrs_array.show_readmore_button;
		var search_button_obj = typeof search_button_obj !== 'undefined' ? search_button_obj : null;

		if (search_button_obj && (typeof map_attrs.address != 'undefined' && map_attrs.address)) {
			var address_string = map_attrs.address;
			if (typeof w2dc_searchAddresses[map_id] == "undefined" || w2dc_searchAddresses[map_id] != address_string) {
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode({'address': address_string}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						var latitude = results[0].geometry.location.lat();
						var longitude = results[0].geometry.location.lng();
					}
					map.panTo(new google.maps.LatLng(latitude, longitude));
				    
					//w2dc_ajax_loader_target_hide("w2dc-controller-"+map_id);
					//w2dc_ajax_loader_target_hide("w2dc-maps-canvas-"+map_id);
					w2dc_delete_iloader_from_element(search_button_obj);
					w2dc_setAjaxMarkers(map, map_id);
				});
				w2dc_searchAddresses[map_id] = address_string;

				//return false;
			}
		}
	
		var bounds_new = map.getBounds();
		if (bounds_new) {
			var south_west = bounds_new.getSouthWest();
			var north_east = bounds_new.getNorthEast();
		} else
			return false;
	
		if (typeof map_attrs.swLat != 'undefined' && typeof map_attrs.swLng != 'undefined' && typeof map_attrs.neLat != 'undefined' && typeof map_attrs.neLng != 'undefined') {
			var bounds_old = new google.maps.LatLngBounds();
		    var sw_point = new google.maps.LatLng(map_attrs.swLat, map_attrs.swLng);
		    var ne_point = new google.maps.LatLng(map_attrs.neLat, map_attrs.neLng);
		    bounds_old.extend(sw_point);
		    bounds_old.extend(ne_point);
	
		    var scale = 1 << map.getZoom();
		    var worldCoordinate_new = w2dc_project(sw_point);
		    var worldCoordinate_old = w2dc_project(south_west);
		    if (
		    	(bounds_old.contains(south_west) && bounds_old.contains(north_east))
		    	||
			    	(140 > Math.abs(Math.floor(worldCoordinate_new.x*scale) - Math.floor(worldCoordinate_old.x*scale))
			    	&&
			    	140 > Math.abs(Math.floor(worldCoordinate_new.y*scale) - Math.floor(worldCoordinate_old.y*scale)))
		    )
		    	return false;
		}
		map_attrs.swLat = south_west.lat();
		map_attrs.swLng = south_west.lng();
		map_attrs.neLat = north_east.lat();
		map_attrs.neLng = north_east.lng();
		
		w2dc_ajax_loader_target_show($('#w2dc-maps-canvas-'+map_id));
	
		var ajax_params = {};
		for (var attrname in map_attrs) { ajax_params[attrname] = map_attrs[attrname]; }
		ajax_params.action = 'w2dc_get_map_markers';
		ajax_params.hash = map_id;

		var listings_args_array;
		if (listings_args_array = w2dc_get_controller_args_array(map_id)) {
			ajax_params.hide_order = listings_args_array.hide_order;
			ajax_params.hide_count = listings_args_array.hide_count;
			ajax_params.hide_paginator = listings_args_array.hide_paginator;
			ajax_params.show_views_switcher = listings_args_array.show_views_switcher;
			ajax_params.listings_view_type = listings_args_array.listings_view_type;
			ajax_params.listings_view_grid_columns = listings_args_array.listings_view_grid_columns;
			ajax_params.listing_thumb_width = listings_args_array.listing_thumb_width;
			ajax_params.wrap_logo_list_view = listings_args_array.wrap_logo_list_view;
			ajax_params.logo_animation_effect = listings_args_array.logo_animation_effect;
			ajax_params.grid_view_logo_ratio = listings_args_array.grid_view_logo_ratio;
			ajax_params.scrolling_paginator = listings_args_array.scrolling_paginator;
			ajax_params.perpage = listings_args_array.perpage;
			ajax_params.onepage = listings_args_array.onepage;
			ajax_params.order = listings_args_array.order;
			ajax_params.order_by = listings_args_array.order_by;
			ajax_params.base_url = listings_args_array.base_url;
	
			w2dc_ajax_loader_target_show($('#w2dc-controller-'+map_id));
		} else
			ajax_params.without_listings = 1;
		
		if ($("#w2dc-map-listings-panel-"+map_id).length) {
			ajax_params.map_listings = 1;
			w2dc_ajax_loader_target_show($("#w2dc-map-search-panel-wrapper-"+map_id));
		}
	
		$.ajax({
			type: "POST",
			url: w2dc_js_objects.ajaxurl,
			data: ajax_params,
			dataType: 'json',
			success: function(response_from_the_action_function) {
				if (response_from_the_action_function) {
					var responce_hash = response_from_the_action_function.hash;
	
					if (response_from_the_action_function.html) {
						var listings_block = $('#w2dc-controller-'+responce_hash);
						listings_block.replaceWith(response_from_the_action_function.html);
						w2dc_ajax_loader_target_hide('w2dc-controller-'+responce_hash);
					}
					
					var map_listings_block = $('#w2dc-map-listings-panel-'+responce_hash);
			    	if (map_listings_block.length) {
			    		map_listings_block.html(response_from_the_action_function.map_listings);
			    		w2dc_ajax_loader_target_hide('w2dc-map-search-panel-wrapper-'+responce_hash);
			    	}
	
					w2dc_clearMarkers(map_id);
					w2dc_removeShapes(map_id);
					// do not close opened info window when its marker is still in the viewpost
					/*if (typeof w2dc_infoWindows[map_id] != 'undefined') {
						var y1 = map_attrs.neLat;
						var y2 =  map_attrs.swLat;
						
						// when zoom level 2 - there may be problems with neLng and swLng of bounds
						if (map_attrs.neLat > map_attrs.swLng) {
							var x1 = map_attrs.neLng;
							var x2 = map_attrs.swLng;
						} else {
							var x1 = 180;
							var x2 = -180;
						}
		
						if (w2dc_infoWindows[map_id].marker.position.lat() < y2 || w2dc_infoWindows[map_id].marker.position.lat() > y1 || w2dc_infoWindows[map_id].marker.position.lng() < x2 || w2dc_infoWindows[map_id].marker.position.lng() > x1)
							w2dc_infoWindows[map_id].close();
					}*/
					
					if (typeof map_attrs.ajax_markers_loading != 'undefined' && map_attrs.ajax_markers_loading == 1)
						var is_ajax_markers = true;
					else
						var is_ajax_markers = false;
		
					var markers_array = response_from_the_action_function.map_markers;
					w2dc_global_locations_array[map_id] = [];
			    	for (var j=0; j<markers_array.length; j++) {
		    			var map_coords_1 = markers_array[j][1];
				    	var map_coords_2 = markers_array[j][2];
				    	if ($.isNumeric(map_coords_1) && $.isNumeric(map_coords_2)) {
			    			var point = new google.maps.LatLng(map_coords_1, map_coords_2);
	
			    			var location_obj = new w2dc_glocation(markers_array[j][0], point, 
			    				markers_array[j][3],
			    				markers_array[j][4],
			    				markers_array[j][6],
			    				markers_array[j][7],
			    				markers_array[j][8],
			    				markers_array[j][9],
			    				markers_array[j][10],
			    				markers_array[j][11],
			    				show_summary_button,
			    				show_readmore_button,
			    				map_id,
			    				is_ajax_markers
				    		);
				    		var marker = location_obj.w2dc_placeMarker(map_id);
	
				    		w2dc_global_locations_array[map_id].push(location_obj);
				    	}
		    		}
			    	w2dc_setClusters(enable_clusters, map_id, w2dc_global_markers_array[map_id]);

			    	if (enable_radius_circle && typeof response_from_the_action_function.radius_params != 'undefined') {
			    		var radius_params = response_from_the_action_function.radius_params;
						var map_radius = parseFloat(radius_params.radius_value);
						w2dc_draw_radius(radius_params, map_radius, responce_hash);
					}
				}
			},
			complete: w2dc_completeAJAXSearchOnMap(map_id, search_button_obj)
		});
	}
	var w2dc_completeAJAXSearchOnMap = function(map_id, search_button_obj) {
		return function() {
			w2dc_ajax_loader_target_hide("w2dc-controller-"+map_id);
			w2dc_ajax_loader_target_hide("w2dc-maps-canvas-"+map_id);
			w2dc_equalColumnsHeight();
			if (search_button_obj) {
				w2dc_delete_iloader_from_element(search_button_obj);
			}
		}
	}
	window.w2dc_draw_radius = function(radius_params, map_radius, map_id) {
		if (radius_params.dimension == 'miles')
			map_radius *= 1.609344;
		var map_coords_1 = radius_params.map_coords_1;
		var map_coords_2 = radius_params.map_coords_2;

		if ($.isNumeric(map_coords_1) && $.isNumeric(map_coords_2)) {
			map_radius *= 1000; // we need radius exactly in meters
			w2dc_drawCircles[map_id] = new google.maps.Circle({
		    	center: new google.maps.LatLng(map_coords_1, map_coords_2),
		        radius: map_radius,
		        strokeColor: "#FF0000",
		        strokeOpacity: 0.25,
		        strokeWeight: 1,
		        fillColor: "#FF0000",
		        fillOpacity: 0.1,
		        map: w2dc_maps[map_id]
		    });
			google.maps.event.addListener(w2dc_drawCircles[map_id], 'mouseup', function(event) {
				w2dc_dragended = false;
			});
		}
	}
	window.w2dc_placeMarker = function(location, map_id) {
		if (w2dc_google_maps_objects.map_markers_type != 'icons') {
			if (w2dc_google_maps_objects.global_map_icons_path != '') {
				var re = /(?:\.([^.]+))?$/;
				if (location.map_icon_file && typeof re.exec(w2dc_google_maps_objects.global_map_icons_path+'icons/'+location.map_icon_file)[1] != "undefined")
					var icon_file = w2dc_google_maps_objects.global_map_icons_path+'icons/'+location.map_icon_file;
				else
					var icon_file = w2dc_google_maps_objects.global_map_icons_path+"blank.png";
		
				var customIcon = {
					url: icon_file,
				    size: new google.maps.Size(parseInt(w2dc_google_maps_objects.marker_image_width), parseInt(w2dc_google_maps_objects.marker_image_height)),
				    origin: new google.maps.Point(0, 0),
				    anchor: new google.maps.Point(parseInt(w2dc_google_maps_objects.marker_image_anchor_x), parseInt(w2dc_google_maps_objects.marker_image_anchor_y))
				};
		
				var marker = new google.maps.Marker({
					position: location.point,
					map: w2dc_maps[map_id],
					icon: customIcon,
					animation: google.maps.Animation.DROP
				});
			} else 
				var marker = new google.maps.Marker({
					position: location.point,
					map: w2dc_maps[map_id],
					animation: google.maps.Animation.DROP
				});
			
			w2dc_dragended = false;
		} else {
			w2dc_load_richtext();
			
			if (location.map_icon_color)
				var map_marker_color = location.map_icon_color;
			else
				var map_marker_color = w2dc_google_maps_objects.default_marker_color;

			if (w2dc_in_array(location.map_icon_file, w2dc_google_maps_objects.map_markers_array)) {
				var map_marker_icon = '<span class="w2dc-map-marker-icon w2dc-fa '+location.map_icon_file+'" style="color: '+map_marker_color+';"></span>';
				var map_marker_class = 'w2dc-map-marker';
			} else {
				if (w2dc_google_maps_objects.default_marker_icon) {
					var map_marker_icon = '<span class="w2dc-map-marker-icon w2dc-fa '+w2dc_google_maps_objects.default_marker_icon+'" style="color: '+map_marker_color+';"></span>';
					var map_marker_class = 'w2dc-map-marker';
				} else {
					var map_marker_icon = '';
					var map_marker_class = 'w2dc-map-marker-empty';
				}
			}

			var marker = new RichMarker({
				position: location.point,
				map: w2dc_maps[map_id],
				flat: true,
				content: '<div class="'+map_marker_class+'" style="background: '+map_marker_color+' none repeat scroll 0 0;">'+map_marker_icon+'</div>'
			});
			
			w2dc_dragended = false;
			google.maps.event.addListener(w2dc_maps[map_id], 'dragend', function(event) {
			    w2dc_dragended = true;
			});
			google.maps.event.addListener(w2dc_maps[map_id], 'mouseup', function(event) {
				w2dc_dragended = false;
			});
		}
		
		w2dc_global_markers_array[map_id].push(marker);

		google.maps.event.addListener(marker, 'click', function() {
			if (!w2dc_dragended) {
				var attrs_array = w2dc_get_map_markers_attrs_array(map_id);
				if (attrs_array.center_map_onclick) {
					var map_attrs = attrs_array.map_attrs;
					if (typeof map_attrs.ajax_loading == 'undefined' || map_attrs.ajax_loading == 0)
							w2dc_maps[map_id].panTo(marker.getPosition());
				}
				
				if ($('#w2dc-map-listings-panel-'+map_id).length) {
					if ($('#w2dc-map-listings-panel-'+map_id+' #post-'+location.id).length) {
						$('#w2dc-map-listings-panel-'+map_id).animate({scrollTop: $('#w2dc-map-listings-panel-'+map_id).scrollTop() + $('#w2dc-map-listings-panel-'+map_id+' #post-'+location.id).position().top}, 'fast');
					}
				}

				if (!location.is_ajax_markers)
					w2dc_showInfoWindow(location, marker, map_id);
				else {
					w2dc_ajax_loader_target_show($('#w2dc-maps-canvas-'+map_id));
		
					var post_data = {'location_id': location.id, 'action': 'w2dc_get_map_marker_info'};
					$.ajax({
			    		type: "POST",
			    		url: w2dc_js_objects.ajaxurl,
			    		data: eval(post_data),
			    		dataType: 'json',
			    		success: function(response_from_the_action_function) {
			    			var marker_array = response_from_the_action_function;
			    			var map_coords_1 = marker_array[1];
					    	var map_coords_2 = marker_array[2];
					    	if ($.isNumeric(map_coords_1) && $.isNumeric(map_coords_2)) {
				    			var point = new google.maps.LatLng(map_coords_1, map_coords_2);
		
				    			var new_location_obj = new w2dc_glocation(marker_array[0], point, 
				    				marker_array[3],
				    				marker_array[4],
				    				marker_array[6],
				    				marker_array[7],
				    				marker_array[8],
				    				marker_array[9],
				    				marker_array[10],
				    				marker_array[11],
				    				location.show_summary_button,
				    				location.show_readmore_button,
				    				map_id,
				    				true
					    		);
				    			w2dc_showInfoWindow(new_location_obj, marker, map_id);
					    	}
			    		},
			    		complete: function() {
							w2dc_ajax_loader_target_hide("w2dc-maps-canvas-"+map_id);
						}
					});
				}
			}
		});
	
		return marker;
	}
	// This function builds info Window and shows it hiding another
	function w2dc_showInfoWindow(w2dc_glocation, marker, map_id) {
		// infobox_packed.js -------------------------------------------------------------------------------------------------------------------------------------------
		function InfoBox(t){t=t||{},google.maps.OverlayView.apply(this,arguments),this.content_=t.content||"",this.disableAutoPan_=t.disableAutoPan||!1,this.maxWidth_=t.maxWidth||0,this.pixelOffset_=t.pixelOffset||new google.maps.Size(0,0),this.position_=t.position||new google.maps.LatLng(0,0),this.zIndex_=t.zIndex||null,this.boxClass_=t.boxClass||"infoBox",this.boxStyle_=t.boxStyle||{},this.closeBoxMargin_=t.closeBoxMargin||"2px",this.closeBoxURL_=t.closeBoxURL||"http://www.google.com/intl/en_us/mapfiles/close.gif",""===t.closeBoxURL&&(this.closeBoxURL_=""),this.infoBoxClearance_=t.infoBoxClearance||new google.maps.Size(1,1),"undefined"==typeof t.visible&&(t.visible="undefined"==typeof t.isHidden?!0:!t.isHidden),this.isHidden_=!t.visible,this.alignBottom_=t.alignBottom||!1,this.pane_=t.pane||"floatPane",this.enableEventPropagation_=t.enableEventPropagation||!1,this.div_=null,this.closeListener_=null,this.moveListener_=null,this.contextListener_=null,this.eventListeners_=null,this.fixedWidthSet_=null}InfoBox.prototype=new google.maps.OverlayView,InfoBox.prototype.createInfoBoxDiv_=function(){var t,e,i,o=this,s=function(t){t.cancelBubble=!0,t.stopPropagation&&t.stopPropagation()},n=function(t){t.returnValue=!1,t.preventDefault&&t.preventDefault(),o.enableEventPropagation_||s(t)};if(!this.div_){if(this.div_=document.createElement("div"),this.setBoxStyle_(),"undefined"==typeof this.content_.nodeType?this.div_.innerHTML=this.getCloseBoxImg_()+this.content_:(this.div_.innerHTML=this.getCloseBoxImg_(),this.div_.appendChild(this.content_)),this.getPanes()[this.pane_].appendChild(this.div_),this.addClickHandler_(),this.div_.style.width?this.fixedWidthSet_=!0:0!==this.maxWidth_&&this.div_.offsetWidth>this.maxWidth_?(this.div_.style.width=this.maxWidth_,this.div_.style.overflow="auto",this.fixedWidthSet_=!0):(i=this.getBoxWidths_(),this.div_.style.width=this.div_.offsetWidth-i.left-i.right+"px",this.fixedWidthSet_=!1),this.panBox_(this.disableAutoPan_),!this.enableEventPropagation_){for(this.eventListeners_=[],e=["mousedown","mouseover","mouseout","mouseup","click","dblclick","touchstart","touchend","touchmove"],t=0;t<e.length;t++)this.eventListeners_.push(google.maps.event.addDomListener(this.div_,e[t],s));this.eventListeners_.push(google.maps.event.addDomListener(this.div_,"mouseover",function(){this.style.cursor="default"}))}this.contextListener_=google.maps.event.addDomListener(this.div_,"contextmenu",n),google.maps.event.trigger(this,"domready")}},InfoBox.prototype.getCloseBoxImg_=function(){var t="";return""!==this.closeBoxURL_&&(t="<img",t+=" src='"+this.closeBoxURL_+"'",t+=" align=right",t+=" style='",t+=" position: relative;",t+=" cursor: pointer;",t+=" margin: "+this.closeBoxMargin_+";",t+="'>"),t},InfoBox.prototype.addClickHandler_=function(){var t;""!==this.closeBoxURL_?(t=this.div_.firstChild,this.closeListener_=google.maps.event.addDomListener(t,"click",this.getCloseClickHandler_())):this.closeListener_=null},InfoBox.prototype.getCloseClickHandler_=function(){var t=this;return function(e){e.cancelBubble=!0,e.stopPropagation&&e.stopPropagation(),google.maps.event.trigger(t,"closeclick"),t.close()}},InfoBox.prototype.panBox_=function(t){var e,i,o=0,s=0;if(!t&&(e=this.getMap(),e instanceof google.maps.Map)){e.getBounds().contains(this.position_)||e.setCenter(this.position_),i=e.getBounds();var n=e.getDiv(),h=n.offsetWidth,d=n.offsetHeight,l=this.pixelOffset_.width,r=this.pixelOffset_.height,a=this.div_.offsetWidth,p=this.div_.offsetHeight,_=this.infoBoxClearance_.width,f=this.infoBoxClearance_.height,v=this.getProjection().fromLatLngToContainerPixel(this.position_);if(v.x<-l+_?o=v.x+l-_:v.x+a+l+_>h&&(o=v.x+a+l+_-h),this.alignBottom_?v.y<-r+f+p?s=v.y+r-f-p:v.y+r+f>d&&(s=v.y+r+f-d):v.y<-r+f?s=v.y+r-f:v.y+p+r+f>d&&(s=v.y+p+r+f-d),0!==o||0!==s){{e.getCenter()}e.panBy(o,s)}}},InfoBox.prototype.setBoxStyle_=function(){var t,e;if(this.div_){this.div_.className=this.boxClass_,this.div_.style.cssText="",e=this.boxStyle_;for(t in e)e.hasOwnProperty(t)&&(this.div_.style[t]=e[t]);this.div_.style.WebkitTransform="translateZ(0)","undefined"!=typeof this.div_.style.opacity&&""!==this.div_.style.opacity&&(this.div_.style.MsFilter='"progid:DXImageTransform.Microsoft.Alpha(Opacity='+100*this.div_.style.opacity+')"',this.div_.style.filter="alpha(opacity="+100*this.div_.style.opacity+")"),this.div_.style.position="absolute",this.div_.style.visibility="hidden",null!==this.zIndex_&&(this.div_.style.zIndex=this.zIndex_)}},InfoBox.prototype.getBoxWidths_=function(){var t,e={top:0,bottom:0,left:0,right:0},i=this.div_;return document.defaultView&&document.defaultView.getComputedStyle?(t=i.ownerDocument.defaultView.getComputedStyle(i,""),t&&(e.top=parseInt(t.borderTopWidth,10)||0,e.bottom=parseInt(t.borderBottomWidth,10)||0,e.left=parseInt(t.borderLeftWidth,10)||0,e.right=parseInt(t.borderRightWidth,10)||0)):document.documentElement.currentStyle&&i.currentStyle&&(e.top=parseInt(i.currentStyle.borderTopWidth,10)||0,e.bottom=parseInt(i.currentStyle.borderBottomWidth,10)||0,e.left=parseInt(i.currentStyle.borderLeftWidth,10)||0,e.right=parseInt(i.currentStyle.borderRightWidth,10)||0),e},InfoBox.prototype.onRemove=function(){this.div_&&(this.div_.parentNode.removeChild(this.div_),this.div_=null)},InfoBox.prototype.draw=function(){this.createInfoBoxDiv_();var t=this.getProjection().fromLatLngToDivPixel(this.position_);this.div_.style.left=t.x+this.pixelOffset_.width+"px",this.alignBottom_?this.div_.style.bottom=-(t.y+this.pixelOffset_.height)+"px":this.div_.style.top=t.y+this.pixelOffset_.height+"px",this.div_.style.visibility=this.isHidden_?"hidden":"visible"},InfoBox.prototype.setOptions=function(t){"undefined"!=typeof t.boxClass&&(this.boxClass_=t.boxClass,this.setBoxStyle_()),"undefined"!=typeof t.boxStyle&&(this.boxStyle_=t.boxStyle,this.setBoxStyle_()),"undefined"!=typeof t.content&&this.setContent(t.content),"undefined"!=typeof t.disableAutoPan&&(this.disableAutoPan_=t.disableAutoPan),"undefined"!=typeof t.maxWidth&&(this.maxWidth_=t.maxWidth),"undefined"!=typeof t.pixelOffset&&(this.pixelOffset_=t.pixelOffset),"undefined"!=typeof t.alignBottom&&(this.alignBottom_=t.alignBottom),"undefined"!=typeof t.position&&this.setPosition(t.position),"undefined"!=typeof t.zIndex&&this.setZIndex(t.zIndex),"undefined"!=typeof t.closeBoxMargin&&(this.closeBoxMargin_=t.closeBoxMargin),"undefined"!=typeof t.closeBoxURL&&(this.closeBoxURL_=t.closeBoxURL),"undefined"!=typeof t.infoBoxClearance&&(this.infoBoxClearance_=t.infoBoxClearance),"undefined"!=typeof t.isHidden&&(this.isHidden_=t.isHidden),"undefined"!=typeof t.visible&&(this.isHidden_=!t.visible),"undefined"!=typeof t.enableEventPropagation&&(this.enableEventPropagation_=t.enableEventPropagation),this.div_&&this.draw()},InfoBox.prototype.setContent=function(t){this.content_=t,this.div_&&(this.closeListener_&&(google.maps.event.removeListener(this.closeListener_),this.closeListener_=null),this.fixedWidthSet_||(this.div_.style.width=""),"undefined"==typeof t.nodeType?this.div_.innerHTML=this.getCloseBoxImg_()+t:(this.div_.innerHTML=this.getCloseBoxImg_(),this.div_.appendChild(t)),this.fixedWidthSet_||(this.div_.style.width=this.div_.offsetWidth+"px","undefined"==typeof t.nodeType?this.div_.innerHTML=this.getCloseBoxImg_()+t:(this.div_.innerHTML=this.getCloseBoxImg_(),this.div_.appendChild(t))),this.addClickHandler_()),google.maps.event.trigger(this,"content_changed")},InfoBox.prototype.setPosition=function(t){this.position_=t,this.div_&&this.draw(),google.maps.event.trigger(this,"position_changed")},InfoBox.prototype.setZIndex=function(t){this.zIndex_=t,this.div_&&(this.div_.style.zIndex=t),google.maps.event.trigger(this,"zindex_changed")},InfoBox.prototype.setVisible=function(t){this.isHidden_=!t,this.div_&&(this.div_.style.visibility=this.isHidden_?"hidden":"visible")},InfoBox.prototype.getContent=function(){return this.content_},InfoBox.prototype.getPosition=function(){return this.position_},InfoBox.prototype.getZIndex=function(){return this.zIndex_},InfoBox.prototype.getVisible=function(){var t;return t="undefined"==typeof this.getMap()||null===this.getMap()?!1:!this.isHidden_},InfoBox.prototype.show=function(){this.isHidden_=!1,this.div_&&(this.div_.style.visibility="visible")},InfoBox.prototype.hide=function(){this.isHidden_=!0,this.div_&&(this.div_.style.visibility="hidden")},InfoBox.prototype.open=function(t,e){var i=this;e&&(this.position_=e.getPosition(),this.moveListener_=google.maps.event.addListener(e,"position_changed",function(){i.setPosition(this.getPosition())})),this.setMap(t),this.div_&&this.panBox_()},InfoBox.prototype.close=function(){var t;if(this.closeListener_&&(google.maps.event.removeListener(this.closeListener_),this.closeListener_=null),this.eventListeners_){for(t=0;t<this.eventListeners_.length;t++)google.maps.event.removeListener(this.eventListeners_[t]);this.eventListeners_=null}this.moveListener_&&(google.maps.event.removeListener(this.moveListener_),this.moveListener_=null),this.contextListener_&&(google.maps.event.removeListener(this.contextListener_),this.contextListener_=null),this.setMap(null)};

		if (w2dc_glocation.nofollow)
			var nofollow = 'rel="nofollow"';
		else
			var nofollow = '';
	
		var windowHtml = '<div class="w2dc-map-info-window">';
		windowHtml += '<div class="w2dc-map-info-window-title">';
		if (w2dc_glocation.listing_url && w2dc_glocation.show_readmore_button)
			windowHtml += '<a class="w2dc-map-info-window-title-link" href="' + w2dc_glocation.listing_url + '" ' + nofollow + '>';
		windowHtml += w2dc_glocation.listing_title;
		if (w2dc_glocation.listing_url && w2dc_glocation.show_readmore_button)
			windowHtml += '</a>';
		windowHtml += '<span class="w2dc-close-info-window w2dc-fa w2dc-fa-close" onClick="w2dc_infoWindows[&quot;' + map_id + '&quot;].close();"></span>';
		windowHtml += '</div>';

		if (w2dc_glocation.listing_logo) {
			windowHtml += '<div class="w2dc-map-info-window-logo" style="width: ' + (w2dc_google_maps_objects.infowindow_logo_width+10) + 'px">';
			if (w2dc_glocation.listing_url && w2dc_glocation.show_readmore_button)
				windowHtml += '<a href="' + w2dc_glocation.listing_url + '" ' + nofollow + '>';
			windowHtml += '<img width="' + w2dc_google_maps_objects.infowindow_logo_width + 'px" src="' + w2dc_glocation.listing_logo + '" />';
			if (w2dc_glocation.listing_url && w2dc_glocation.show_readmore_button)
				windowHtml += '</a>';
			windowHtml += '</div>';
		}
	
		windowHtml += '<div class="w2dc-map-info-window-content w2dc-clearfix">';
		if (w2dc_glocation.content_fields) {
			for (var i=0; i<w2dc_glocation.content_fields.length; i++) {
				if (w2dc_glocation.content_fields[i]) {
					windowHtml += '<div class="w2dc-map-info-window-field">';
					if (w2dc_google_maps_objects.w2dc_map_content_fields_icons[i])
						windowHtml += '<span class="w2dc-map-field-icon w2dc-fa ' + w2dc_google_maps_objects.w2dc_map_content_fields_icons[i] + '"></span>';
					windowHtml += w2dc_glocation.content_fields[i];
					windowHtml += '</div>';
				}
			}
		}
		windowHtml += '</div>';
	
		if ((w2dc_glocation.show_summary_button && $("#"+w2dc_glocation.anchor).length) || (w2dc_glocation.listing_url && w2dc_glocation.show_readmore_button)) {
			if (!(w2dc_glocation.show_summary_button && $("#"+w2dc_glocation.anchor).length) || !(w2dc_glocation.listing_url && w2dc_glocation.show_readmore_button))
				var button_class = 'w2dc-map-info-window-buttons-single';
			else
				var button_class = 'w2dc-map-info-window-buttons';
	
			windowHtml += '<div class="' + button_class + ' w2dc-clearfix">';
			if (w2dc_glocation.show_summary_button && $("#"+w2dc_glocation.anchor).length)
				windowHtml += '<a href="javascript:void(0);" class="w2dc-btn w2dc-btn-primary w2dc-scroll-to-listing" onClick="w2dc_scrollToListing(&quot;' + w2dc_glocation.anchor + '&quot;, &quot;' + map_id + '&quot;);">' + w2dc_google_maps_objects.w2dc_map_info_window_button_summary + '</a>';
			if (w2dc_glocation.listing_url && w2dc_glocation.show_readmore_button)
				windowHtml += '<a href="' +  w2dc_glocation.listing_url + '" ' + nofollow + ' class="w2dc-btn w2dc-btn-primary">' + w2dc_google_maps_objects.w2dc_map_info_window_button_readmore + '</a>';
			windowHtml += '</div>';
		}
		
		var tongue_pos = (parseInt(w2dc_google_maps_objects.infowindow_width)/2);
	
		windowHtml += '<div style="position: absolute; left: '+(tongue_pos-10)+'px;"><div style="position: absolute; overflow: hidden; left: -6px; top: -1px; width: 16px; height: 30px;"><div class="w2dc-map-info-window-tongue" style="position: absolute; left: 6px; transform: skewX(22.6deg); transform-origin: 0px 0px 0px;  -webkit-transform: skewX(22.6deg); -webkit-transform-origin: 0px 0px 0px; height: 24px; width: 10px; box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.6);"></div></div><div style="position: absolute; overflow: hidden; top: -1px; left: 10px; width: 16px; height: 30px;"><div class="w2dc-map-info-window-tongue" style="position: absolute; left: 0px; transform: skewX(-22.6deg); transform-origin: 10px 0px 0px; -webkit-transform: skewX(-22.6deg); -webkit-transform-origin: 10px 0px 0px; height: 24px; width: 10px; box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.6);"></div></div></div>';
		windowHtml += '</div>';
	            
	    var myOptions = {
	             content: windowHtml
	            ,alignBottom: true
	            ,disableAutoPan: false
	            ,pixelOffset: new google.maps.Size(-tongue_pos, parseInt(w2dc_google_maps_objects.infowindow_offset)-24)
	            ,zIndex: null
	            ,boxStyle: { 
	              width: w2dc_google_maps_objects.infowindow_width+"px"
	             }
	    		,closeBoxURL: ""
	            ,infoBoxClearance: new google.maps.Size(1, 1)
	            ,isHidden: false
	            ,pane: "floatPane"
	            ,enableEventPropagation: false
	    };
	
	    // we use global infoWindow, not to close/open it - just to set new content (in order to prevent blinking)
	    if (typeof w2dc_infoWindows[map_id] != 'undefined') {
	    	w2dc_infoWindows[map_id].close();
	    }
	
	    w2dc_infoWindows[map_id] = new InfoBox(myOptions);
	    w2dc_infoWindows[map_id].open(w2dc_maps[map_id], marker);
	    w2dc_infoWindows[map_id].marker = marker;
	}

	window.w2dc_scrollToListing = function(anchor, map_id) {
		var scroll_to_anchor = $("#"+anchor);
		var sticky_scroll_toppadding = 0;
		if (typeof window["w2dc_sticky_scroll_toppadding_"+map_id] != 'undefined') {
			sticky_scroll_toppadding = window["w2dc_sticky_scroll_toppadding_"+map_id];
		}

		if (scroll_to_anchor.length) {
			$('html,body').animate({scrollTop: scroll_to_anchor.position().top - sticky_scroll_toppadding}, 'fast');
		}
	}

	function w2dc_handleDirectionsErrors(status){
	   if (status == google.maps.DirectionsStatus.NOT_FOUND)
	     alert("No corresponding geographic location could be found for one of the specified addresses. This may be due to the fact that the address is relatively new, or it may be incorrect.");
	   else if (status == google.maps.DirectionsStatus.ZERO_RESULTS)
	     alert("No route could be found between the origin and destination.");
	   else if (status == google.maps.DirectionsStatus.UNKNOWN_ERROR)
	     alert("A directions request could not be processed due to a server error. The request may succeed if you try again.");
	   else if (status == google.maps.DirectionsStatus.REQUEST_DENIED)
	     alert("The webpage is not allowed to use the directions service.");
	   else if (status == google.maps.DirectionsStatus.INVALID_REQUEST)
	     alert("The provided DirectionsRequest was invalid.");
	   else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT)
	     alert("The webpage has sent too many requests within the allowed time period.");
	   else alert("An unknown error occurred.");
	}
	window.w2dc_setClusters = function(enable_clusters, map_id, markers) {
		if (enable_clusters && typeof MarkerClusterer == 'function') {
			var clusterStyles = [];
			
			if (w2dc_google_maps_objects.global_map_icons_path != '')
				var clusterStyles = [
					{
						url: w2dc_google_maps_objects.global_map_icons_path + 'clusters/icon_cluster1.png',
						height: 64,
						width: 64
					},
					{
						url: w2dc_google_maps_objects.global_map_icons_path + 'clusters/icon_cluster2.png',
						height: 74,
						width: 74
					},
					{
						url: w2dc_google_maps_objects.global_map_icons_path + 'clusters/icon_cluster3.png',
						height: 84,
						width: 84
					},
					{
						url: w2dc_google_maps_objects.global_map_icons_path + 'clusters/icon_cluster4.png',
						height: 94,
						width: 94
					},
					{
						url: w2dc_google_maps_objects.global_map_icons_path + 'clusters/icon_cluster5.png',
						height: 104,
						width: 104
					}
				];
			var mcOptions = {
				gridSize: 40,
				styles: clusterStyles
			};
			var accuracy = 8000;
			
			if (markers.length != 0) {
			    for (var i=0; i < markers.length; i++) {
			        var existingMarker = markers[i];
			        var pos = existingMarker.getPosition();

			        for (var j=0; j < markers.length; j++) {
			        	var markerToCompare = markers[i];
				        var markerToComparePos = markerToCompare.getPosition();
				        if (markerToComparePos.equals(pos)) {
				            var newLat = markerToComparePos.lat() + (Math.random() -.5) / accuracy;
				            var newLng = markerToComparePos.lng() + (Math.random() -.5) / accuracy;
				            markers[i].setPosition(new google.maps.LatLng(newLat,newLng));
				        }
			        }
			    }
			}
			
			w2dc_markerClusters[map_id] = new MarkerClusterer(w2dc_maps[map_id], markers, mcOptions);
		}
	}
	window.w2dc_clearMarkers = function(map_id) {
		if (typeof w2dc_markerClusters[map_id] != 'undefined')
			w2dc_markerClusters[map_id].clearMarkers();
	
		if (w2dc_global_markers_array[map_id]) {
			for(var i = 0; i<w2dc_global_markers_array[map_id].length; i++){
				w2dc_global_markers_array[map_id][i].setMap(null);
			}
		}
		w2dc_global_markers_array[map_id] = [];
		w2dc_global_locations_array[map_id] = [];
		
		if (typeof w2dc_infoWindows[map_id] != 'undefined')
			w2dc_infoWindows[map_id].close();
	}
	window.w2dc_removeShapes = function(map_id) {
		if (typeof w2dc_drawCircles[map_id] != 'undefined') {
			google.maps.event.clearListeners(w2dc_drawCircles[map_id], 'mouseup');
			w2dc_drawCircles[map_id].setMap(null);
		}

		if (typeof w2dc_polygons[map_id] != 'undefined')
			w2dc_polygons[map_id].setMap(null);
	}
	window.w2dc_setZoomCenter = function(map) {
		if (typeof google != 'undefined' && typeof google.maps != 'undefined') {
			var zoom = map.getZoom();
			var center = map.getCenter();
			google.maps.event.trigger(map, 'resize');
			map.setZoom(zoom);
			map.setCenter(center);
		}
	}

	window.w2dc_geocodeField = function(field, error_message) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function(position) {
					var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode({'latLng': latlng}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							if (results[0]) {
								field.val(results[0].formatted_address);
							}
						}
					});
			    },
			    function(e) {
			    	alert(e.message);
		    	},
			    {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
		    );
		} else
			alert(error_message);
	}

	window.w2dc_sort_autocomplete_items = function(a, b) {
		if (a.term_in_name && !b.term_in_name) {
			return -1;
		} else if (!a.term_in_name && b.term_in_name) {
			return 1;
		} else if (a.is_term && !b.is_term) {
			return -1;
		} else if (!a.is_term && b.is_term) {
			return 1;
		} else if (a.parents == '' && b.parents != '') {
			return -1;
		} else if (a.parents != '' && b.parents == '') {
			return 1;
		} else if (a.name > b.name) {
			return 1;
		} else if (b.name > a.name) {
			return -1;
		} else {
			return 0;
		}
	}

})(jQuery);

function w2dc_make_slug(name) {
	name = name.toLowerCase();
	
	var defaultDiacriticsRemovalMap = [
	                                   {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
	                                   {'base':'AA','letters':/[\uA732]/g},
	                                   {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
	                                   {'base':'AO','letters':/[\uA734]/g},
	                                   {'base':'AU','letters':/[\uA736]/g},
	                                   {'base':'AV','letters':/[\uA738\uA73A]/g},
	                                   {'base':'AY','letters':/[\uA73C]/g},
	                                   {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
	                                   {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
	                                   {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
	                                   {'base':'DZ','letters':/[\u01F1\u01C4]/g},
	                                   {'base':'Dz','letters':/[\u01F2\u01C5]/g},
	                                   {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
	                                   {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
	                                   {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
	                                   {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
	                                   {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
	                                   {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
	                                   {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
	                                   {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
	                                   {'base':'LJ','letters':/[\u01C7]/g},
	                                   {'base':'Lj','letters':/[\u01C8]/g},
	                                   {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
	                                   {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
	                                   {'base':'NJ','letters':/[\u01CA]/g},
	                                   {'base':'Nj','letters':/[\u01CB]/g},
	                                   {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
	                                   {'base':'OI','letters':/[\u01A2]/g},
	                                   {'base':'OO','letters':/[\uA74E]/g},
	                                   {'base':'OU','letters':/[\u0222]/g},
	                                   {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
	                                   {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
	                                   {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
	                                   {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
	                                   {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
	                                   {'base':'TZ','letters':/[\uA728]/g},
	                                   {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
	                                   {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
	                                   {'base':'VY','letters':/[\uA760]/g},
	                                   {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
	                                   {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
	                                   {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
	                                   {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
	                                   {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
	                                   {'base':'aa','letters':/[\uA733]/g},
	                                   {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
	                                   {'base':'ao','letters':/[\uA735]/g},
	                                   {'base':'au','letters':/[\uA737]/g},
	                                   {'base':'av','letters':/[\uA739\uA73B]/g},
	                                   {'base':'ay','letters':/[\uA73D]/g},
	                                   {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
	                                   {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
	                                   {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
	                                   {'base':'dz','letters':/[\u01F3\u01C6]/g},
	                                   {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
	                                   {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
	                                   {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
	                                   {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
	                                   {'base':'hv','letters':/[\u0195]/g},
	                                   {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
	                                   {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
	                                   {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
	                                   {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
	                                   {'base':'lj','letters':/[\u01C9]/g},
	                                   {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
	                                   {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
	                                   {'base':'nj','letters':/[\u01CC]/g},
	                                   {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
	                                   {'base':'oi','letters':/[\u01A3]/g},
	                                   {'base':'ou','letters':/[\u0223]/g},
	                                   {'base':'oo','letters':/[\uA74F]/g},
	                                   {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
	                                   {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
	                                   {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
	                                   {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
	                                   {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
	                                   {'base':'tz','letters':/[\uA729]/g},
	                                   {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
	                                   {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
	                                   {'base':'vy','letters':/[\uA761]/g},
	                                   {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
	                                   {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
	                                   {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
	                                   {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
	                               ];
	for(var i=0; i<defaultDiacriticsRemovalMap.length; i++)
		name = name.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);

	//change spaces and other characters by '_'
	name = name.replace(/\W/gi, "_");
	// remove double '_'
	name = name.replace(/(\_)\1+/gi, "_");
	
	return name;
}

function w2dc_in_array(val, arr) 
{
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == val)
			return i;
	}
	return false;
}

function w2dc_find_get_parameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}


/*!
 * jQuery Mousewheel 3.1.13 -------------------------------------------------------------------------------------------------------------------------------------------
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});


// tax_dropdowns.js -------------------------------------------------------------------------------------------------------------------------------------------
(function($) {
	"use strict";
	
	if (typeof $.ui.selectmenu != 'undefined' && typeof $.ui.autocomplete != 'undefined') {
		// correct menu width
		$.ui.autocomplete.prototype._resizeMenu = function () {
			var ul = this.menu.element;
			ul.outerWidth(this.element.outerWidth());
		}

		window.categories_combobox = $.widget("custom.categories_combobox", {
			input_icon_class: "w2dc-glyphicon-search",

			_create: function() {
				this.wrapper = $("<div>")
				.addClass("w2dc-dropdowns-menu-categories-autocomplete")
				.insertAfter(this.element);

				this.element.hide();
				this._createAutocomplete();
				this._createShowAllButton();
			},

			_createAutocomplete: function() {
				var selected = this.element.find("[data-selected=\"selected\"]");
				if (this.element.data("autocomplete-name") && this.element.data("autocomplete-value")) {
					var value = this.element.data("autocomplete-value");
				} else {
					var value = selected.data("name") ? selected.data("name") : "";
				}
				
				// when combobox is placed on sticky map - append to its wrapper
				if (this.wrapper.parents(".w2dc-maps-canvas-wrapper.w2dc-sticky-scroll").length) {
					var append_to = this.wrapper;
				} else {
					var append_to = null;
				}

				this.input = $("<input>", { name: this.element.data("autocomplete-name") ? this.element.data("autocomplete-name") : ""})
				.appendTo(this.wrapper)
				.val(value)
				.attr("placeholder", this.element.data("placeholder"))
				.addClass("w2dc-form-control")
				.autocomplete({
					delay: 0,
					minLength: 0,
					appendTo: append_to,
					source: $.proxy(this, "_source")/*,
					close: function() {
						input.trigger("focus");
						input.autocomplete("search", "");
					}*/
				});
				
				var input = this.input;
				var id = this.element.data("id");
				
				this.input.autocomplete("widget").addClass("w2dc-dropdowns-menu");
				this.input.autocomplete("instance")._renderItem = function(ul, item) {
					var term = input.val();
					var label = item.label;
					if (term) {
						label = label.replace(new RegExp(term,'gi'), function(str) {
							return '<b>' + str + '</b>';
						});
					}

					var li = $("<li>"),
					wrapper = $("<div>", {
						html: label,
						class: "w2dc-dropdowns-menu-search"
					});

					if (item.icon) {
						$("<span>", {
							style: "background-image: url('" + item.icon + "'); background-size: cover;",
							class: "ui-icon"
						})
						.appendTo(wrapper);
					}

					if (item.parents) {
						var term = input.val();
						var parents = item.parents;
						if (term) {
							parents = parents.replace(new RegExp(term,'gi'), function(str) {
								return '<b>' + str + '</b>';
							});
						}
						
						$("<span>")
						.html(parents)
						.addClass("w2dc-dropdowns-menu-search-parents")
						.appendTo(wrapper);
					} else {
						wrapper.addClass("w2dc-dropdowns-menu-search-root");
					}
		
					return li.append(wrapper).appendTo(ul);
				};

				this._on(input, {
					autocompleteselect: function(event, ui) {
						this._trigger("select", event, {
							item: ui.item
						});

						if (ui.item.is_term) {
							var name = ui.item.name;
							$('#selected_tax\\['+id+'\\]').val(ui.item.value).trigger("change");
						} else {
							var name = ui.item.value;
							$('#selected_tax\\['+id+'\\]').val('');
						}
						this.input.val(name);

						return false;
					},
					autocompletefocus: function(event, ui) {
						event.preventDefault();
					},
					click: function(event, ui) {
						input.trigger("focus");
						input.autocomplete("search", input.val());
					},
					autocompletesearch: function(event, ui) {
						if (input.val() == '') {
							$('#selected_tax\\['+id+'\\]').val('');
						}
					}
				});
				
				$(document).on("submit", "form", function() {
					input.autocomplete("close");
				});
			},

			_createShowAllButton: function() {
				var input = this.input,
				wasOpen = false;

				this.wrapper.addClass("w2dc-has-feedback");
				$("<span>", {
					class: "w2dc-dropdowns-menu-button w2dc-glyphicon w2dc-form-control-feedback " + this.input_icon_class
				})
				.appendTo(this.wrapper)
				.on("mousedown", function() {
					wasOpen = input.autocomplete("widget").is(":visible");
				})
				.on("click", function() {
					input.trigger("focus");

					// Close if already visible
					if (wasOpen) {
						return;
					}

					// Pass empty string as value to search for, displaying all results
					input.autocomplete("search", input.val());
				});
			},

			_source: function(request, response) {
				var term = $.trim(request.term);
				var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
				var common_array = [];
				this.element.children("option").map(function() {
						var text = $(this).text(),
						value = $(this).val(),
						name = $(this).data("name"),
						icon = $(this).data("icon"),
						parents = $(this).data("parents"),
						term_in_name = matcher.test(name),
						term_in_parents = matcher.test(parents);
						if (this.value && (!term || term_in_name || term_in_parents)) {
							common_array.push({
								label: text,
								value: value,
								name: name,
								icon: icon,
								parents: parents,
								option: this,
								is_term: true,
								term_in_name: term_in_name
							});
						}
				});
				if (term) {
					common_array.sort(w2dc_sort_autocomplete_items);
				}
				response(common_array);
			},

			_destroy: function() {
				this.wrapper.remove();
				this.element.show();
			}
		});
		window.locations_combobox = $.widget("custom.locations_combobox", categories_combobox, {
			input_icon_class: "w2dc-glyphicon-map-marker",
			placeholder: "",

			_create: function() {
				this.wrapper = $("<div>")
				.addClass("w2dc-dropdowns-menu-locations-autocomplete")
				.insertAfter(this.element);
				
				this.uID = this.element.data("id");
				this.placeholder = this.element.data("placeholder");

				this.element.hide();
				this._createAutocomplete();
				this._createShowAllButton();
				this._addMyLocationButton();
			},
			
			_createAutocomplete: function() {
				this._super();

				this._on(this.input, {
					autocompleteselect: function(event, ui) {
						var form = this.input.parents("form");
						var id = form.data("id");
						if ($("#radius_"+id).val() > 0) {
							form.trigger("submit");
						}
					}
				});
			},
			
			_addMyLocationButton: function() {
				if (this.element.data("autocomplete-name")) {
					this.wrapper.find(".w2dc-form-control-feedback").addClass("w2dc-get-location");
				}
			},

			_source: function(request, response) {
				var term = $.trim(request.term);
				
				var common_array = [];
				
				var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
				this.element.children("option").map(function() {
					var text = $(this).text(),
					value = $(this).val(),
					name = $(this).data("name"),
					icon = $(this).data("icon"),
					parents = $(this).data("parents"),
					term_in_name = matcher.test(name),
					term_in_parents = matcher.test(parents);
					if (this.value && (!term || term_in_name || term_in_parents)) {
						common_array.push({
							label: text,
							value: value,
							name: name,
							icon: icon,
							parents: parents,
							option: this,
							is_term: true,
							term_in_name: term_in_name
						});
					}
				});

				if (this.element.data("autocomplete-name")) {
					var autoCompleteService = new google.maps.places.AutocompleteService();
					if (term && typeof google.maps != 'undefined' && typeof google.maps.places != 'undefined') {
						if (w2dc_google_maps_objects.address_autocomplete_code != '0')
							var options = { input: term, componentRestrictions: {country: w2dc_google_maps_objects.address_autocomplete_code}};
						else
							var options = { input: term };
						autoCompleteService.getPlacePredictions(options, function (predictions, status) {
							if (status != google.maps.places.PlacesServiceStatus.OK) {
								//alert(status);
								//this.input.autocomplete("close");
							}
							$.map(predictions, function (prediction, i) {
								common_array.push({
									label: prediction.terms[0].value,
									value: prediction.description,
									name: prediction.terms[0].value,
									icon: "",
									parents: prediction.structured_formatting.secondary_text,
									is_term: false,
									term_in_name: true
								});
							})
	
							common_array.sort(w2dc_sort_autocomplete_items);
							response(common_array);
						});
					} else {
						if (term) {
							common_array.sort(w2dc_sort_autocomplete_items);
						}
						response(common_array);
					}
				}  else {
					if (term) {
						common_array.sort(w2dc_sort_autocomplete_items);
					}
					response(common_array);
				}
			},
		});
		window.address_autocomplete = $.widget("custom.address_autocomplete", categories_combobox, {
			input_icon_class: "w2dc-glyphicon-map-marker",

			_create: function() {
				this._createAutocomplete();
				this._addMyLocationButton();
			},
			
			_addMyLocationButton: function() {
				this.element.next(".w2dc-form-control-feedback").addClass("w2dc-get-location");
			},
			
			_createAutocomplete: function() {
				// when combobox is placed on sticky map - append to its wrapper
				if (this.wrapper.parents(".w2dc-maps-canvas-wrapper.w2dc-sticky-scroll").length) {
					var append_to = this.wrapper;
				} else {
					var append_to = null;
				}

				this.element
				.autocomplete({
					delay: 0,
					minLength: 0,
					appendTo: append_to,
					source: $.proxy(this, "_source")/*,
					close: function() {
						input.trigger("focus");
						input.autocomplete("search", "");
					}*/
				});
				this.element.autocomplete("widget").addClass("w2dc-dropdowns-menu");
				this.element.autocomplete("instance")._renderItem = function(ul, item) {
					var li = $("<li>"),
					wrapper = $("<div>", {
						text: item.label,
						class: "w2dc-dropdowns-menu-search"
					});

					if (item.icon) {
						$("<span>", {
							style: "background-image: url('" + item.icon + "'); background-size: cover;",
							class: "ui-icon"
						})
						.appendTo(wrapper);
					}

					if (item.parents) {
						$("<span>")
						.text(item.parents)
						.addClass("w2dc-dropdowns-menu-search-parents")
						.appendTo(wrapper);
					} else {
						wrapper.addClass("w2dc-dropdowns-menu-search-root");
					}
		
					return li.append(wrapper).appendTo(ul);
				};
				
				var input = this.element;

				this._on(input, {
					autocompleteselect: function(event, ui) {
						console.log(ui.item);
						this._trigger("select", event, {
							item: ui.item
						});

						input.val(ui.item.value);
						
						var form = input.parents("form");
						var id = form.data("id");
						if ($("#radius_"+id).val() > 0) {
							form.trigger("submit");
						}
						
						return false;
					},
					autocompletefocus: function(event, ui) {
						event.preventDefault();
					},
					click: function(event, ui) {
						input.trigger("focus");
						input.autocomplete("search", input.val());
					}
				});
			},
			
			_source: function(request, response) {
				var term = $.trim(request.term);
				
				var common_array = [];

				var autoCompleteService = new google.maps.places.AutocompleteService();
				if (term && typeof google.maps != 'undefined' && typeof google.maps.places != 'undefined') {
					if (w2dc_google_maps_objects.address_autocomplete_code != '0')
						var options = { input: term, componentRestrictions: {country: w2dc_google_maps_objects.address_autocomplete_code}};
					else
						var options = { input: term };
					autoCompleteService.getPlacePredictions(options, function (predictions, status) {
						if (status != google.maps.places.PlacesServiceStatus.OK) {
							//alert(status);
							//this.input.autocomplete("close");
						}
						$.map(predictions, function (prediction, i) {
							common_array.push({
								label: prediction.terms[0].value,
								value: prediction.description,
								name: prediction.terms[0].value,
								icon: "",
								parents: prediction.structured_formatting.secondary_text,
								is_term: false
							});
						})
						
						common_array.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
						
						response(common_array);
					});
				} else {
					response(common_array);
				}
			},
		});
	}

	$(document).on('change', '.w2dc-tax-dropdowns-wrap select', function() {
		var select_box = $(this).attr('id').split('_');
		var parent = $(this).val();
		var current_level = select_box[1];
		var uID = select_box[2];

		var divclass = $(this).parents('.w2dc-tax-dropdowns-wrap').attr('class').split(' ');
		var tax = divclass[0];
		var count = divclass[1];
		var hide_empty = divclass[2];

		w2dc_update_tax(parent, tax, current_level, count, hide_empty, uID, function() {});
	});

	function w2dc_update_tax(parent, tax, current_level, count, hide_empty, uID, callback) {
		var current_level = parseInt(current_level);
		var next_level = current_level + 1;
		var prev_level = current_level - 1;
		var selects_length = $('#w2dc-tax-dropdowns-wrap-'+uID+' select').length;
		
		if (parent)
			$('#selected_tax\\['+uID+'\\]').val(parent).trigger('change');
		else if (current_level > 1)
			$('#selected_tax\\['+uID+'\\]').val($('#chainlist_'+prev_level+'_'+uID).val()).trigger('change');
		else
			$('#selected_tax\\['+uID+'\\]').val(0).trigger('change');

		var exact_terms = $('#exact_terms\\['+uID+'\\]').val();

		for (var i=next_level; i<=selects_length; i++)
			$('#wrap_chainlist_'+i+'_'+uID).remove();
		
		if (parent) {
			var labels_source = w2dc_js_objects['tax_dropdowns_'+uID][uID];

			if (labels_source.labels[current_level] != undefined)
				var label = labels_source.labels[current_level];
			else
				var label = '';
			if (labels_source.titles[current_level] != undefined)
				var title = labels_source.titles[current_level];
			else
				var title = '';

			$('#chainlist_'+current_level+'_'+uID).addClass('w2dc-ajax-loading').attr('disabled', 'disabled');
			$.post(
				w2dc_js_objects.ajaxurl,
				{'action': 'w2dc_tax_dropdowns_hook', 'parentid': parent, 'next_level': next_level, 'tax': tax, 'count': count, 'hide_empty': hide_empty, 'label': label, 'title': title, 'exact_terms': exact_terms, 'uID': uID},
				function(response_from_the_action_function){
					if (response_from_the_action_function != 0)
						$('#w2dc-tax-dropdowns-wrap-'+uID).append(response_from_the_action_function);

					$('#chainlist_'+current_level+'_'+uID).removeClass('w2dc-ajax-loading').removeAttr('disabled');
					
					callback();
				}
			);
		}
	}
	
	function first(p){for(var i in p)return p[i];}
}(jQuery));



// jquery.coo_kie.js -------------------------------------------------------------------------------------------------------------------------------------------
jQuery.cookie=function(e,i,o){if("undefined"==typeof i){var n=null;if(document.cookie&&""!=document.cookie)for(var r=document.cookie.split(";"),t=0;t<r.length;t++){var p=jQuery.trim(r[t]);if(p.substring(0,e.length+1)==e+"="){n=decodeURIComponent(p.substring(e.length+1));break}}return n}o=o||{},null===i&&(i="",o.expires=-1);var u="";if(o.expires&&("number"==typeof o.expires||o.expires.toUTCString)){var s;"number"==typeof o.expires?(s=new Date,s.setTime(s.getTime()+24*o.expires*60*60*1e3)):s=o.expires,u="; expires="+s.toUTCString()}var a=o.path?"; path="+o.path:"",c=o.domain?"; domain="+o.domain:"",m=o.secure?"; secure":"";document.cookie=[e,"=",encodeURIComponent(i),u,a,c,m].join("")};



// google_maps_clasterer.js -------------------------------------------------------------------------------------------------------------------------------------------
(function(){var d=null;function e(a){return function(b){this[a]=b}}function h(a){return function(){return this[a]}}var j;
function k(a,b,c){this.extend(k,google.maps.OverlayView);this.c=a;this.a=[];this.f=[];this.ca=[53,56,66,78,90];this.j=[];this.A=!1;c=c||{};this.g=c.gridSize||60;this.l=c.minimumClusterSize||2;this.J=c.maxZoom||d;this.j=c.styles||[];this.X=c.imagePath||this.Q;this.W=c.imageExtension||this.P;this.O=!0;if(c.zoomOnClick!=void 0)this.O=c.zoomOnClick;this.r=!1;if(c.averageCenter!=void 0)this.r=c.averageCenter;l(this);this.setMap(a);this.K=this.c.getZoom();var f=this;google.maps.event.addListener(this.c,
"zoom_changed",function(){var a=f.c.getZoom();if(f.K!=a)f.K=a,f.m()});google.maps.event.addListener(this.c,"idle",function(){f.i()});b&&b.length&&this.C(b,!1)}j=k.prototype;j.Q="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m";j.P="png";j.extend=function(a,b){return function(a){for(var b in a.prototype)this.prototype[b]=a.prototype[b];return this}.apply(a,[b])};j.onAdd=function(){if(!this.A)this.A=!0,n(this)};j.draw=function(){};
function l(a){if(!a.j.length)for(var b=0,c;c=a.ca[b];b++)a.j.push({url:a.X+(b+1)+"."+a.W,height:c,width:c})}j.S=function(){for(var a=this.o(),b=new google.maps.LatLngBounds,c=0,f;f=a[c];c++)b.extend(f.getPosition());this.c.fitBounds(b)};j.z=h("j");j.o=h("a");j.V=function(){return this.a.length};j.ba=e("J");j.I=h("J");j.G=function(a,b){for(var c=0,f=a.length,g=f;g!==0;)g=parseInt(g/10,10),c++;c=Math.min(c,b);return{text:f,index:c}};j.$=e("G");j.H=h("G");
j.C=function(a,b){for(var c=0,f;f=a[c];c++)q(this,f);b||this.i()};function q(a,b){b.s=!1;b.draggable&&google.maps.event.addListener(b,"dragend",function(){b.s=!1;a.L()});a.a.push(b)}j.q=function(a,b){q(this,a);b||this.i()};function r(a,b){var c=-1;if(a.a.indexOf)c=a.a.indexOf(b);else for(var f=0,g;g=a.a[f];f++)if(g==b){c=f;break}if(c==-1)return!1;b.setMap(d);a.a.splice(c,1);return!0}j.Y=function(a,b){var c=r(this,a);return!b&&c?(this.m(),this.i(),!0):!1};
j.Z=function(a,b){for(var c=!1,f=0,g;g=a[f];f++)g=r(this,g),c=c||g;if(!b&&c)return this.m(),this.i(),!0};j.U=function(){return this.f.length};j.getMap=h("c");j.setMap=e("c");j.w=h("g");j.aa=e("g");
j.v=function(a){var b=this.getProjection(),c=new google.maps.LatLng(a.getNorthEast().lat(),a.getNorthEast().lng()),f=new google.maps.LatLng(a.getSouthWest().lat(),a.getSouthWest().lng()),c=b.fromLatLngToDivPixel(c);c.x+=this.g;c.y-=this.g;f=b.fromLatLngToDivPixel(f);f.x-=this.g;f.y+=this.g;c=b.fromDivPixelToLatLng(c);b=b.fromDivPixelToLatLng(f);a.extend(c);a.extend(b);return a};j.R=function(){this.m(!0);this.a=[]};
j.m=function(a){for(var b=0,c;c=this.f[b];b++)c.remove();for(b=0;c=this.a[b];b++)c.s=!1,a&&c.setMap(d);this.f=[]};j.L=function(){var a=this.f.slice();this.f.length=0;this.m();this.i();window.setTimeout(function(){for(var b=0,c;c=a[b];b++)c.remove()},0)};j.i=function(){n(this)};
function n(a){if(a.A)for(var b=a.v(new google.maps.LatLngBounds(a.c.getBounds().getSouthWest(),a.c.getBounds().getNorthEast())),c=0,f;f=a.a[c];c++)if(!f.s&&b.contains(f.getPosition())){for(var g=a,u=4E4,o=d,v=0,m=void 0;m=g.f[v];v++){var i=m.getCenter();if(i){var p=f.getPosition();if(!i||!p)i=0;else var w=(p.lat()-i.lat())*Math.PI/180,x=(p.lng()-i.lng())*Math.PI/180,i=Math.sin(w/2)*Math.sin(w/2)+Math.cos(i.lat()*Math.PI/180)*Math.cos(p.lat()*Math.PI/180)*Math.sin(x/2)*Math.sin(x/2),i=6371*2*Math.atan2(Math.sqrt(i),
Math.sqrt(1-i));i<u&&(u=i,o=m)}}o&&o.F.contains(f.getPosition())?o.q(f):(m=new s(g),m.q(f),g.f.push(m))}}function s(a){this.k=a;this.c=a.getMap();this.g=a.w();this.l=a.l;this.r=a.r;this.d=d;this.a=[];this.F=d;this.n=new t(this,a.z(),a.w())}j=s.prototype;
j.q=function(a){var b;a:if(this.a.indexOf)b=this.a.indexOf(a)!=-1;else{b=0;for(var c;c=this.a[b];b++)if(c==a){b=!0;break a}b=!1}if(b)return!1;if(this.d){if(this.r)c=this.a.length+1,b=(this.d.lat()*(c-1)+a.getPosition().lat())/c,c=(this.d.lng()*(c-1)+a.getPosition().lng())/c,this.d=new google.maps.LatLng(b,c),y(this)}else this.d=a.getPosition(),y(this);a.s=!0;this.a.push(a);b=this.a.length;b<this.l&&a.getMap()!=this.c&&a.setMap(this.c);if(b==this.l)for(c=0;c<b;c++)this.a[c].setMap(d);b>=this.l&&a.setMap(d);
a=this.c.getZoom();if((b=this.k.I())&&a>b)for(a=0;b=this.a[a];a++)b.setMap(this.c);else if(this.a.length<this.l)z(this.n);else{b=this.k.H()(this.a,this.k.z().length);this.n.setCenter(this.d);a=this.n;a.B=b;a.ga=b.text;a.ea=b.index;if(a.b)a.b.innerHTML=b.text;b=Math.max(0,a.B.index-1);b=Math.min(a.j.length-1,b);b=a.j[b];a.da=b.url;a.h=b.height;a.p=b.width;a.M=b.textColor;a.e=b.anchor;a.N=b.textSize;a.D=b.backgroundPosition;this.n.show()}return!0};
j.getBounds=function(){for(var a=new google.maps.LatLngBounds(this.d,this.d),b=this.o(),c=0,f;f=b[c];c++)a.extend(f.getPosition());return a};j.remove=function(){this.n.remove();this.a.length=0;delete this.a};j.T=function(){return this.a.length};j.o=h("a");j.getCenter=h("d");function y(a){a.F=a.k.v(new google.maps.LatLngBounds(a.d,a.d))}j.getMap=h("c");
function t(a,b,c){a.k.extend(t,google.maps.OverlayView);this.j=b;this.fa=c||0;this.u=a;this.d=d;this.c=a.getMap();this.B=this.b=d;this.t=!1;this.setMap(this.c)}j=t.prototype;
j.onAdd=function(){this.b=document.createElement("DIV");if(this.t)this.b.style.cssText=A(this,B(this,this.d)),this.b.innerHTML=this.B.text;this.getPanes().overlayMouseTarget.appendChild(this.b);var a=this;google.maps.event.addDomListener(this.b,"click",function(){var b=a.u.k;google.maps.event.trigger(b,"clusterclick",a.u);b.O&&a.c.fitBounds(a.u.getBounds())})};function B(a,b){var c=a.getProjection().fromLatLngToDivPixel(b);c.x-=parseInt(a.p/2,10);c.y-=parseInt(a.h/2,10);return c}
j.draw=function(){if(this.t){var a=B(this,this.d);this.b.style.top=a.y+"px";this.b.style.left=a.x+"px"}};function z(a){if(a.b)a.b.style.display="none";a.t=!1}j.show=function(){if(this.b)this.b.style.cssText=A(this,B(this,this.d)),this.b.style.display="";this.t=!0};j.remove=function(){this.setMap(d)};j.onRemove=function(){if(this.b&&this.b.parentNode)z(this),this.b.parentNode.removeChild(this.b),this.b=d};j.setCenter=e("d");
function A(a,b){var c=[];c.push("background-image:url('"+a.da+"');");c.push("background-position:"+(a.D?a.D:"0 0")+";");typeof a.e==="object"?(typeof a.e[0]==="number"&&a.e[0]>0&&a.e[0]<a.h?c.push("height:"+(a.h-a.e[0])+"px; padding-top:"+a.e[0]+"px;"):c.push("height:"+a.h+"px; line-height:"+a.h+"px;"),typeof a.e[1]==="number"&&a.e[1]>0&&a.e[1]<a.p?c.push("width:"+(a.p-a.e[1])+"px; padding-left:"+a.e[1]+"px;"):c.push("width:"+a.p+"px; text-align:center;")):c.push("height:"+a.h+"px; line-height:"+a.h+
"px; width:"+a.p+"px; text-align:center;");c.push("cursor:pointer; top:"+b.y+"px; left:"+b.x+"px; color:"+(a.M?a.M:"black")+"; position:absolute; font-size:"+(a.N?a.N:11)+"px; font-family:Arial,sans-serif; font-weight:bold");return c.join("")}window.MarkerClusterer=k;k.prototype.addMarker=k.prototype.q;k.prototype.addMarkers=k.prototype.C;k.prototype.clearMarkers=k.prototype.R;k.prototype.fitMapToMarkers=k.prototype.S;k.prototype.getCalculator=k.prototype.H;k.prototype.getGridSize=k.prototype.w;
k.prototype.getExtendedBounds=k.prototype.v;k.prototype.getMap=k.prototype.getMap;k.prototype.getMarkers=k.prototype.o;k.prototype.getMaxZoom=k.prototype.I;k.prototype.getStyles=k.prototype.z;k.prototype.getTotalClusters=k.prototype.U;k.prototype.getTotalMarkers=k.prototype.V;k.prototype.redraw=k.prototype.i;k.prototype.removeMarker=k.prototype.Y;k.prototype.removeMarkers=k.prototype.Z;k.prototype.resetViewport=k.prototype.m;k.prototype.repaint=k.prototype.L;k.prototype.setCalculator=k.prototype.$;
k.prototype.setGridSize=k.prototype.aa;k.prototype.setMaxZoom=k.prototype.ba;k.prototype.onAdd=k.prototype.onAdd;k.prototype.draw=k.prototype.draw;s.prototype.getCenter=s.prototype.getCenter;s.prototype.getSize=s.prototype.T;s.prototype.getMarkers=s.prototype.o;t.prototype.onAdd=t.prototype.onAdd;t.prototype.draw=t.prototype.draw;t.prototype.onRemove=t.prototype.onRemove;
})();


// jquery.bxslider.min.js -------------------------------------------------------------------------------------------------------------------------------------------
/**
 * BxSlider v4.1.2 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2014, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
!function(t){var e={},s={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,slideZIndex:50,touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",autoHover:!1,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){},onSliderResize:function(){}};t.fn.bxSlider=function(n){if(0==this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var o={},r=this;e.el=this;var a=t(window).width(),l=t(window).height(),d=function(){o.settings=t.extend({},s,n),o.settings.slideWidth=parseInt(o.settings.slideWidth),o.children=r.children(o.settings.slideSelector),o.children.length<o.settings.minSlides&&(o.settings.minSlides=o.children.length),o.children.length<o.settings.maxSlides&&(o.settings.maxSlides=o.children.length),o.settings.randomStart&&(o.settings.startSlide=Math.floor(Math.random()*o.children.length)),o.active={index:o.settings.startSlide},o.carousel=o.settings.minSlides>1||o.settings.maxSlides>1,o.carousel&&(o.settings.preloadImages="all"),o.minThreshold=o.settings.minSlides*o.settings.slideWidth+(o.settings.minSlides-1)*o.settings.slideMargin,o.maxThreshold=o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin,o.working=!1,o.controls={},o.interval=null,o.animProp="vertical"==o.settings.mode?"top":"left",o.usingCSS=o.settings.useCSS&&"fade"!=o.settings.mode&&function(){var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var i in e)if(void 0!==t.style[e[i]])return o.cssPrefix=e[i].replace("Perspective","").toLowerCase(),o.animProp="-"+o.cssPrefix+"-transform",!0;return!1}(),"vertical"==o.settings.mode&&(o.settings.maxSlides=o.settings.minSlides),r.data("origStyle",r.attr("style")),r.children(o.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),c()},c=function(){r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'),o.viewport=r.parent(),o.loader=t('<div class="bx-loading" />'),o.viewport.prepend(o.loader),r.css({width:"horizontal"==o.settings.mode?100*o.children.length+215+"%":"auto",position:"relative"}),o.usingCSS&&o.settings.easing?r.css("-"+o.cssPrefix+"-transition-timing-function",o.settings.easing):o.settings.easing||(o.settings.easing="swing"),f(),o.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),o.viewport.parent().css({maxWidth:p()}),o.settings.pager||o.viewport.parent().css({margin:"0 auto 0px"}),o.children.css({"float":"horizontal"==o.settings.mode?"left":"none",listStyle:"none",position:"relative"}),o.children.css("width",u()),"horizontal"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginRight",o.settings.slideMargin),"vertical"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginBottom",o.settings.slideMargin),"fade"==o.settings.mode&&(o.children.css({position:"absolute",zIndex:0,display:"none"}),o.children.eq(o.settings.startSlide).css({zIndex:o.settings.slideZIndex,display:"block"})),o.controls.el=t('<div class="bx-controls" />'),o.settings.captions&&P(),o.active.last=o.settings.startSlide==x()-1,o.settings.video&&r.fitVids();var e=o.children.eq(o.settings.startSlide);"all"==o.settings.preloadImages&&(e=o.children),o.settings.ticker?o.settings.pager=!1:(o.settings.pager&&T(),o.settings.controls&&C(),o.settings.auto&&o.settings.autoControls&&E(),(o.settings.controls||o.settings.autoControls||o.settings.pager)&&o.viewport.after(o.controls.el)),g(e,h)},g=function(e,i){var s=e.find("img, iframe").length;if(0==s)return i(),void 0;var n=0;e.find("img, iframe").each(function(){t(this).one("load",function(){++n==s&&i()}).each(function(){this.complete&&t(this).load()})})},h=function(){if(o.settings.infiniteLoop&&"fade"!=o.settings.mode&&!o.settings.ticker){var e="vertical"==o.settings.mode?o.settings.minSlides:o.settings.maxSlides,i=o.children.slice(0,e).clone().addClass("bx-clone"),s=o.children.slice(-e).clone().addClass("bx-clone");r.append(i).prepend(s)}o.loader.remove(),S(),"vertical"==o.settings.mode&&(o.settings.adaptiveHeight=!0),o.viewport.height(v()),r.redrawSlider(),o.settings.onSliderLoad(o.active.index),o.initialized=!0,o.settings.responsive&&t(window).bind("resize",Z),o.settings.auto&&o.settings.autoStart&&H(),o.settings.ticker&&L(),o.settings.pager&&q(o.settings.startSlide),o.settings.controls&&W(),o.settings.touchEnabled&&!o.settings.ticker&&O()},v=function(){var e=0,s=t();if("vertical"==o.settings.mode||o.settings.adaptiveHeight)if(o.carousel){var n=1==o.settings.moveSlides?o.active.index:o.active.index*m();for(s=o.children.eq(n),i=1;i<=o.settings.maxSlides-1;i++)s=n+i>=o.children.length?s.add(o.children.eq(i-1)):s.add(o.children.eq(n+i))}else s=o.children.eq(o.active.index);else s=o.children;return"vertical"==o.settings.mode?(s.each(function(){e+=t(this).outerHeight()}),o.settings.slideMargin>0&&(e+=o.settings.slideMargin*(o.settings.minSlides-1))):e=Math.max.apply(Math,s.map(function(){return t(this).outerHeight(!1)}).get()),e},p=function(){var t="100%";return o.settings.slideWidth>0&&(t="horizontal"==o.settings.mode?o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin:o.settings.slideWidth),t},u=function(){var t=o.settings.slideWidth,e=o.viewport.width();return 0==o.settings.slideWidth||o.settings.slideWidth>e&&!o.carousel||"vertical"==o.settings.mode?t=e:o.settings.maxSlides>1&&"horizontal"==o.settings.mode&&(e>o.maxThreshold||e<o.minThreshold&&(t=(e-o.settings.slideMargin*(o.settings.minSlides-1))/o.settings.minSlides)),t},f=function(){var t=1;if("horizontal"==o.settings.mode&&o.settings.slideWidth>0)if(o.viewport.width()<o.minThreshold)t=o.settings.minSlides;else if(o.viewport.width()>o.maxThreshold)t=o.settings.maxSlides;else{var e=o.children.first().width();t=Math.floor(o.viewport.width()/e)}else"vertical"==o.settings.mode&&(t=o.settings.minSlides);return t},x=function(){var t=0;if(o.settings.moveSlides>0)if(o.settings.infiniteLoop)t=o.children.length/m();else for(var e=0,i=0;e<o.children.length;)++t,e=i+f(),i+=o.settings.moveSlides<=f()?o.settings.moveSlides:f();else t=Math.ceil(o.children.length/f());return t},m=function(){return o.settings.moveSlides>0&&o.settings.moveSlides<=f()?o.settings.moveSlides:f()},S=function(){if(o.children.length>o.settings.maxSlides&&o.active.last&&!o.settings.infiniteLoop){if("horizontal"==o.settings.mode){var t=o.children.last(),e=t.position();b(-(e.left-(o.viewport.width()-t.width())),"reset",0)}else if("vertical"==o.settings.mode){var i=o.children.length-o.settings.minSlides,e=o.children.eq(i).position();b(-e.top,"reset",0)}}else{var e=o.children.eq(o.active.index*m()).position();o.active.index==x()-1&&(o.active.last=!0),void 0!=e&&("horizontal"==o.settings.mode?b(-e.left,"reset",0):"vertical"==o.settings.mode&&b(-e.top,"reset",0))}},b=function(t,e,i,s){if(o.usingCSS){var n="vertical"==o.settings.mode?"translate3d(0, "+t+"px, 0)":"translate3d("+t+"px, 0, 0)";r.css("-"+o.cssPrefix+"-transition-duration",i/1e3+"s"),"slide"==e?(r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),D()})):"reset"==e?r.css(o.animProp,n):"ticker"==e&&(r.css("-"+o.cssPrefix+"-transition-timing-function","linear"),r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),b(s.resetValue,"reset",0),N()}))}else{var a={};a[o.animProp]=t,"slide"==e?r.animate(a,i,o.settings.easing,function(){D()}):"reset"==e?r.css(o.animProp,t):"ticker"==e&&r.animate(a,speed,"linear",function(){b(s.resetValue,"reset",0),N()})}},w=function(){for(var e="",i=x(),s=0;i>s;s++){var n="";o.settings.buildPager&&t.isFunction(o.settings.buildPager)?(n=o.settings.buildPager(s),o.pagerEl.addClass("bx-custom-pager")):(n=s+1,o.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+s+'" class="bx-pager-link">'+n+"</a></div>"}o.pagerEl.html(e)},T=function(){o.settings.pagerCustom?o.pagerEl=t(o.settings.pagerCustom):(o.pagerEl=t('<div class="bx-pager" />'),o.settings.pagerSelector?t(o.settings.pagerSelector).html(o.pagerEl):o.controls.el.addClass("bx-has-pager").append(o.pagerEl),w()),o.pagerEl.on("click","a",I)},C=function(){o.controls.next=t('<a class="bx-next" href="">'+o.settings.nextText+"</a>"),o.controls.prev=t('<a class="bx-prev" href="">'+o.settings.prevText+"</a>"),o.controls.next.bind("click",y),o.controls.prev.bind("click",z),o.settings.nextSelector&&t(o.settings.nextSelector).append(o.controls.next),o.settings.prevSelector&&t(o.settings.prevSelector).append(o.controls.prev),o.settings.nextSelector||o.settings.prevSelector||(o.controls.directionEl=t('<div class="bx-controls-direction" />'),o.controls.directionEl.append(o.controls.prev).append(o.controls.next),o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))},E=function(){o.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+o.settings.startText+"</a></div>"),o.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+o.settings.stopText+"</a></div>"),o.controls.autoEl=t('<div class="bx-controls-auto" />'),o.controls.autoEl.on("click",".bx-start",k),o.controls.autoEl.on("click",".bx-stop",M),o.settings.autoControlsCombine?o.controls.autoEl.append(o.controls.start):o.controls.autoEl.append(o.controls.start).append(o.controls.stop),o.settings.autoControlsSelector?t(o.settings.autoControlsSelector).html(o.controls.autoEl):o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl),A(o.settings.autoStart?"stop":"start")},P=function(){o.children.each(function(){var e=t(this).find("img:first").attr("title");void 0!=e&&(""+e).length&&t(this).append('<div class="bx-caption"><span>'+e+"</span></div>")})},y=function(t){o.settings.auto&&r.stopAuto(),r.goToNextSlide(),t.preventDefault()},z=function(t){o.settings.auto&&r.stopAuto(),r.goToPrevSlide(),t.preventDefault()},k=function(t){r.startAuto(),t.preventDefault()},M=function(t){r.stopAuto(),t.preventDefault()},I=function(e){o.settings.auto&&r.stopAuto();var i=t(e.currentTarget),s=parseInt(i.attr("data-slide-index"));s!=o.active.index&&r.goToSlide(s),e.preventDefault()},q=function(e){var i=o.children.length;return"short"==o.settings.pagerType?(o.settings.maxSlides>1&&(i=Math.ceil(o.children.length/o.settings.maxSlides)),o.pagerEl.html(e+1+o.settings.pagerShortSeparator+i),void 0):(o.pagerEl.find("a").removeClass("active"),o.pagerEl.each(function(i,s){t(s).find("a").eq(e).addClass("active")}),void 0)},D=function(){if(o.settings.infiniteLoop){var t="";0==o.active.index?t=o.children.eq(0).position():o.active.index==x()-1&&o.carousel?t=o.children.eq((x()-1)*m()).position():o.active.index==o.children.length-1&&(t=o.children.eq(o.children.length-1).position()),t&&("horizontal"==o.settings.mode?b(-t.left,"reset",0):"vertical"==o.settings.mode&&b(-t.top,"reset",0))}o.working=!1,o.settings.onSlideAfter(o.children.eq(o.active.index),o.oldIndex,o.active.index)},A=function(t){o.settings.autoControlsCombine?o.controls.autoEl.html(o.controls[t]):(o.controls.autoEl.find("a").removeClass("active"),o.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},W=function(){1==x()?(o.controls.prev.addClass("disabled"),o.controls.next.addClass("disabled")):!o.settings.infiniteLoop&&o.settings.hideControlOnEnd&&(0==o.active.index?(o.controls.prev.addClass("disabled"),o.controls.next.removeClass("disabled")):o.active.index==x()-1?(o.controls.next.addClass("disabled"),o.controls.prev.removeClass("disabled")):(o.controls.prev.removeClass("disabled"),o.controls.next.removeClass("disabled")))},H=function(){o.settings.autoDelay>0?setTimeout(r.startAuto,o.settings.autoDelay):r.startAuto(),o.settings.autoHover&&r.hover(function(){o.interval&&(r.stopAuto(!0),o.autoPaused=!0)},function(){o.autoPaused&&(r.startAuto(!0),o.autoPaused=null)})},L=function(){var e=0;if("next"==o.settings.autoDirection)r.append(o.children.clone().addClass("bx-clone"));else{r.prepend(o.children.clone().addClass("bx-clone"));var i=o.children.first().position();e="horizontal"==o.settings.mode?-i.left:-i.top}b(e,"reset",0),o.settings.pager=!1,o.settings.controls=!1,o.settings.autoControls=!1,o.settings.tickerHover&&!o.usingCSS&&o.viewport.hover(function(){r.stop()},function(){var e=0;o.children.each(function(){e+="horizontal"==o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)});var i=o.settings.speed/e,s="horizontal"==o.settings.mode?"left":"top",n=i*(e-Math.abs(parseInt(r.css(s))));N(n)}),N()},N=function(t){speed=t?t:o.settings.speed;var e={left:0,top:0},i={left:0,top:0};"next"==o.settings.autoDirection?e=r.find(".bx-clone").first().position():i=o.children.first().position();var s="horizontal"==o.settings.mode?-e.left:-e.top,n="horizontal"==o.settings.mode?-i.left:-i.top,a={resetValue:n};b(s,"ticker",speed,a)},O=function(){o.touch={start:{x:0,y:0},end:{x:0,y:0}},o.viewport.bind("touchstart",X)},X=function(t){if(o.working)t.preventDefault();else{o.touch.originalPos=r.position();var e=t.originalEvent;o.touch.start.x=e.changedTouches[0].pageX,o.touch.start.y=e.changedTouches[0].pageY,o.viewport.bind("touchmove",Y),o.viewport.bind("touchend",V)}},Y=function(t){var e=t.originalEvent,i=Math.abs(e.changedTouches[0].pageX-o.touch.start.x),s=Math.abs(e.changedTouches[0].pageY-o.touch.start.y);if(3*i>s&&o.settings.preventDefaultSwipeX?t.preventDefault():3*s>i&&o.settings.preventDefaultSwipeY&&t.preventDefault(),"fade"!=o.settings.mode&&o.settings.oneToOneTouch){var n=0;if("horizontal"==o.settings.mode){var r=e.changedTouches[0].pageX-o.touch.start.x;n=o.touch.originalPos.left+r}else{var r=e.changedTouches[0].pageY-o.touch.start.y;n=o.touch.originalPos.top+r}b(n,"reset",0)}},V=function(t){o.viewport.unbind("touchmove",Y);var e=t.originalEvent,i=0;if(o.touch.end.x=e.changedTouches[0].pageX,o.touch.end.y=e.changedTouches[0].pageY,"fade"==o.settings.mode){var s=Math.abs(o.touch.start.x-o.touch.end.x);s>=o.settings.swipeThreshold&&(o.touch.start.x>o.touch.end.x?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto())}else{var s=0;"horizontal"==o.settings.mode?(s=o.touch.end.x-o.touch.start.x,i=o.touch.originalPos.left):(s=o.touch.end.y-o.touch.start.y,i=o.touch.originalPos.top),!o.settings.infiniteLoop&&(0==o.active.index&&s>0||o.active.last&&0>s)?b(i,"reset",200):Math.abs(s)>=o.settings.swipeThreshold?(0>s?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto()):b(i,"reset",200)}o.viewport.unbind("touchend",V)},Z=function(){var e=t(window).width(),i=t(window).height();(a!=e||l!=i)&&(a=e,l=i,r.redrawSlider(),o.settings.onSliderResize.call(r,o.active.index))};return r.goToSlide=function(e,i){if(!o.working&&o.active.index!=e)if(o.working=!0,o.oldIndex=o.active.index,o.active.index=0>e?x()-1:e>=x()?0:e,o.settings.onSlideBefore(o.children.eq(o.active.index),o.oldIndex,o.active.index),"next"==i?o.settings.onSlideNext(o.children.eq(o.active.index),o.oldIndex,o.active.index):"prev"==i&&o.settings.onSlidePrev(o.children.eq(o.active.index),o.oldIndex,o.active.index),o.active.last=o.active.index>=x()-1,o.settings.pager&&q(o.active.index),o.settings.controls&&W(),"fade"==o.settings.mode)o.settings.adaptiveHeight&&o.viewport.height()!=v()&&o.viewport.animate({height:v()},o.settings.adaptiveHeightSpeed),o.children.filter(":visible").fadeOut(o.settings.speed).css({zIndex:0}),o.children.eq(o.active.index).css("zIndex",o.settings.slideZIndex+1).fadeIn(o.settings.speed,function(){t(this).css("zIndex",o.settings.slideZIndex),D()});else{o.settings.adaptiveHeight&&o.viewport.height()!=v()&&o.viewport.animate({height:v()},o.settings.adaptiveHeightSpeed);var s=0,n={left:0,top:0};if(!o.settings.infiniteLoop&&o.carousel&&o.active.last)if("horizontal"==o.settings.mode){var a=o.children.eq(o.children.length-1);n=a.position(),s=o.viewport.width()-a.outerWidth()}else{var l=o.children.length-o.settings.minSlides;n=o.children.eq(l).position()}else if(o.carousel&&o.active.last&&"prev"==i){var d=1==o.settings.moveSlides?o.settings.maxSlides-m():(x()-1)*m()-(o.children.length-o.settings.maxSlides),a=r.children(".bx-clone").eq(d);n=a.position()}else if("next"==i&&0==o.active.index)n=r.find("> .bx-clone").eq(o.settings.maxSlides).position(),o.active.last=!1;else if(e>=0){var c=e*m();n=o.children.eq(c).position()}if("undefined"!=typeof n){var g="horizontal"==o.settings.mode?-(n.left-s):-n.top;b(g,"slide",o.settings.speed)}}},r.goToNextSlide=function(){if(o.settings.infiniteLoop||!o.active.last){var t=parseInt(o.active.index)+1;r.goToSlide(t,"next")}},r.goToPrevSlide=function(){if(o.settings.infiniteLoop||0!=o.active.index){var t=parseInt(o.active.index)-1;r.goToSlide(t,"prev")}},r.startAuto=function(t){o.interval||(o.interval=setInterval(function(){"next"==o.settings.autoDirection?r.goToNextSlide():r.goToPrevSlide()},o.settings.pause),o.settings.autoControls&&1!=t&&A("stop"))},r.stopAuto=function(t){o.interval&&(clearInterval(o.interval),o.interval=null,o.settings.autoControls&&1!=t&&A("start"))},r.getCurrentSlide=function(){return o.active.index},r.getCurrentSlideElement=function(){return o.children.eq(o.active.index)},r.getSlideCount=function(){return o.children.length},r.redrawSlider=function(){o.children.add(r.find(".bx-clone")).outerWidth(u()),o.viewport.css("height",v()),o.settings.ticker||S(),o.active.last&&(o.active.index=x()-1),o.active.index>=x()&&(o.active.last=!0),o.settings.pager&&!o.settings.pagerCustom&&(w(),q(o.active.index))},r.destroySlider=function(){o.initialized&&(o.initialized=!1,t(".bx-clone",this).remove(),o.children.each(function(){void 0!=t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!=t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),o.controls.el&&o.controls.el.remove(),o.controls.next&&o.controls.next.remove(),o.controls.prev&&o.controls.prev.remove(),o.pagerEl&&o.settings.controls&&o.pagerEl.remove(),t(".bx-caption",this).remove(),o.controls.autoEl&&o.controls.autoEl.remove(),clearInterval(o.interval),o.settings.responsive&&t(window).unbind("resize",Z))},r.reloadSlider=function(t){void 0!=t&&(n=t),r.destroySlider(),d()},d(),this}}(jQuery);



/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('w2dc_tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="w2dc-tooltip" role="tooltip"><div class="w2dc-tooltip-arrow"></div><div class="w2dc-tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('w2dc-in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('w2dc-fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass('w2dc-'+placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('w2dc-fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('w2dc-in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.w2dc-tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('w2dc-fade w2dc-in w2dc-top w2dc-bottom w2dc-left w2dc-right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('w2dc-in')

    $.support.transition && $tip.hasClass('w2dc-fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.w2dc-tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('w2dc-in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.w2dc_tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.w2dc_tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.w2dc_tooltip

  $.fn.w2dc_tooltip             = Plugin
  $.fn.w2dc_tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.w2dc_tooltip.noConflict = function () {
    $.fn.w2dc_tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.5
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */
+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('w2dc_popover', element, options)
  }

  if (!$.fn.w2dc_tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.5'

  Popover.DEFAULTS = $.extend({}, $.fn.w2dc_tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="w2dc-popover" role="tooltip"><div class="w2dc-arrow"></div><h3 class="w2dc-popover-title"></h3><div class="w2dc-popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.w2dc_tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.w2dc-popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.w2dc-popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('w2dc-fade w2dc-top w2dc-bottom w2dc-left w2dc-right w2dc-in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.w2dc-popover-title').html()) $tip.find('.w2dc-popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }
  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.w2dc_popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.w2dc_popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.w2dc_popover

  $.fn.w2dc_popover             = Plugin
  $.fn.w2dc_popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.w2dc_popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);



// jquery.tokenize.js -------------------------------------------------------------------------------------------------------------------------------------------
!function(e){var t={BACKSPACE:8,TAB:9,ENTER:13,ESCAPE:27,ARROW_UP:38,ARROW_DOWN:40},n=null,o="tokenize",s=function(t,n){if(!n.data(o)){var s=new e.tokenize(e.extend({},e.fn.tokenize.defaults,t));n.data(o,s),s.init(n)}return n.data(o)};e.tokenize=function(t){void 0==t&&(t=e.fn.tokenize.defaults),this.options=t},e.extend(e.tokenize.prototype,{init:function(t){var n=this;this.select=t.attr("multiple","multiple").css({margin:0,padding:0,border:0}).hide(),this.container=e("<div />").attr("class",this.select.attr("class")).addClass("Tokenize"),1==this.options.maxElements&&this.container.addClass("OnlyOne"),this.dropdown=e("<ul />").addClass("Dropdown"),this.tokensContainer=e("<ul />").addClass("TokensContainer"),this.options.autosize&&this.tokensContainer.addClass("Autosize"),this.searchToken=e("<li />").addClass("TokenSearch").appendTo(this.tokensContainer),this.searchInput=e("<input />").appendTo(this.searchToken),this.options.searchMaxLength>0&&this.searchInput.attr("maxlength",this.options.searchMaxLength),this.select.prop("disabled")&&this.disable(),this.options.sortable&&("undefined"!=typeof e.ui?this.tokensContainer.sortable({items:"li.Token",cursor:"move",placeholder:"Token MovingShadow",forcePlaceholderSize:!0,update:function(){n.updateOrder()},start:function(){n.searchToken.hide()},stop:function(){n.searchToken.show()}}).disableSelection():(this.options.sortable=!1,console.log("jQuery UI is not loaded, sortable option has been disabled"))),this.container.append(this.tokensContainer).append(this.dropdown).insertAfter(this.select),this.tokensContainer.on("click",function(e){e.stopImmediatePropagation(),n.searchInput.get(0).focus(),n.updatePlaceholder(),n.dropdown.is(":hidden")&&""!=n.searchInput.val()&&n.search()}),this.searchInput.on("blur",function(){n.tokensContainer.removeClass("Focused")}),this.searchInput.on("focus click",function(){n.tokensContainer.addClass("Focused"),n.options.displayDropdownOnFocus&&"select"==n.options.datas&&n.search()}),this.searchInput.on("keydown",function(e){n.resizeSearchInput(),n.keydown(e)}),this.searchInput.on("keyup",function(e){n.keyup(e)}),this.searchInput.on("keypress",function(e){n.keypress(e)}),this.searchInput.on("paste",function(){setTimeout(function(){n.resizeSearchInput()},10),setTimeout(function(){var t=n.searchInput.val().split(",");t.length>1&&e.each(t,function(e,t){n.tokenAdd(t.trim(),"")})},20)}),e(document).on("click",function(){n.dropdownHide(),1==n.options.maxElements&&n.searchInput.val()&&n.tokenAdd(n.searchInput.val(),"")}),this.resizeSearchInput(),this.remap(!0),this.updatePlaceholder()},updateOrder:function(){if(this.options.sortable){var t,n,o=this;e.each(this.tokensContainer.sortable("toArray",{attribute:"data-value"}),function(s,i){n=e('option[value="'+i+'"]',o.select),void 0==t?n.prependTo(o.select):t.after(n),t=n}),this.options.onReorder(this)}},updatePlaceholder:function(){0!=this.options.placeholder&&(void 0==this.placeholder&&(this.placeholder=e("<li />").addClass("Placeholder").html(this.options.placeholder),this.placeholder.insertBefore(e("li:first-child",this.tokensContainer))),0==this.searchInput.val().length&&0==e("li.Token",this.tokensContainer).length?this.placeholder.show():this.placeholder.hide())},dropdownShow:function(){this.dropdown.show()},dropdownPrev:function(){e("li.Hover",this.dropdown).length>0?e("li.Hover",this.dropdown).is("li:first-child")?(e("li.Hover",this.dropdown).removeClass("Hover"),e("li:last-child",this.dropdown).addClass("Hover")):e("li.Hover",this.dropdown).removeClass("Hover").prev().addClass("Hover"):e("li:first",this.dropdown).addClass("Hover")},dropdownNext:function(){e("li.Hover",this.dropdown).length>0?e("li.Hover",this.dropdown).is("li:last-child")?(e("li.Hover",this.dropdown).removeClass("Hover"),e("li:first-child",this.dropdown).addClass("Hover")):e("li.Hover",this.dropdown).removeClass("Hover").next().addClass("Hover"):e("li:first",this.dropdown).addClass("Hover")},dropdownAddItem:function(t,n,o){if(void 0==o&&(o=n),!e('li[data-value="'+t+'"]',this.tokensContainer).length){var s=this,i=e("<li />").attr("data-value",t).attr("data-text",n).html(o).on("click",function(t){t.stopImmediatePropagation(),s.tokenAdd(e(this).attr("data-value"),e(this).attr("data-text"))}).on("mouseover",function(){e(this).addClass("Hover")}).on("mouseout",function(){e("li",s.dropdown).removeClass("Hover")});this.dropdown.append(i),this.options.onDropdownAddItem(t,n,o,this)}return this},dropdownHide:function(){this.dropdownReset(),this.dropdown.hide()},dropdownReset:function(){this.dropdown.html("")},resizeSearchInput:function(){this.searchInput.attr("size",Number(this.searchInput.val().length)+5),this.updatePlaceholder()},resetSearchInput:function(){this.searchInput.val(""),this.resizeSearchInput()},resetPendingTokens:function(){e("li.PendingDelete",this.tokensContainer).removeClass("PendingDelete")},keypress:function(e){String.fromCharCode(e.which)==this.options.delimiter&&(e.preventDefault(),this.tokenAdd(this.searchInput.val(),""))},keydown:function(n){switch(n.keyCode){case t.BACKSPACE:0==this.searchInput.val().length&&(n.preventDefault(),e("li.Token.PendingDelete",this.tokensContainer).length?this.tokenRemove(e("li.Token.PendingDelete").attr("data-value")):e("li.Token:last",this.tokensContainer).addClass("PendingDelete"),this.dropdownHide());break;case t.TAB:case t.ENTER:if(e("li.Hover",this.dropdown).length){var o=e("li.Hover",this.dropdown);n.preventDefault(),this.tokenAdd(o.attr("data-value"),o.attr("data-text"))}else this.searchInput.val()&&(n.preventDefault(),this.tokenAdd(this.searchInput.val(),""));this.resetPendingTokens();break;case t.ESCAPE:this.resetSearchInput(),this.dropdownHide(),this.resetPendingTokens();break;case t.ARROW_UP:n.preventDefault(),this.dropdownPrev();break;case t.ARROW_DOWN:n.preventDefault(),this.dropdownNext();break;default:this.resetPendingTokens()}},keyup:function(e){switch(this.updatePlaceholder(),e.keyCode){case t.TAB:case t.ENTER:case t.ESCAPE:case t.ARROW_UP:case t.ARROW_DOWN:break;case t.BACKSPACE:this.searchInput.val()?this.search():this.dropdownHide();break;default:this.searchInput.val()&&this.search()}},search:function(){var t=this,n=1;if(this.options.maxElements>0&&e("li.Token",this.tokensContainer).length>=this.options.maxElements)return!1;if("select"==this.options.datas){var o=!1,s=new RegExp(this.searchInput.val().replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),"i");this.dropdownReset(),e("option",this.select).not(":selected, :disabled").each(function(){return n<=t.options.nbDropdownElements?void(s.test(e(this).html())&&(t.dropdownAddItem(e(this).attr("value"),e(this).html()),o=!0,n++)):!1}),o?(e("li:first",this.dropdown).addClass("Hover"),this.dropdownShow()):this.dropdownHide()}else this.debounce(function(){e.ajax({url:t.options.datas,data:t.options.searchParam+"="+t.searchInput.val(),dataType:t.options.dataType,success:function(o){return o&&(t.dropdownReset(),e.each(o,function(e,o){if(!(n<=t.options.nbDropdownElements))return!1;var s=void 0;o[t.options.htmlField]&&(s=o[t.options.htmlField]),t.dropdownAddItem(o[t.options.valueField],o[t.options.textField],s),n++}),e("li",t.dropdown).length)?(e("li:first",t.dropdown).addClass("Hover"),t.dropdownShow(),!0):void t.dropdownHide()},error:function(e,t){console.log("Error : "+t)}})},this.options.debounce)},debounce:function(e,t){var o=this,s=arguments,i=function(){e.apply(o,s),n=null};n&&clearTimeout(n),n=setTimeout(i,t||this.options.debounce)},tokenAdd:function(t,n,o){if(t=this.escape(t),void 0==t||""==t)return this;if((void 0==n||""==n)&&(n=t),void 0==o&&(o=!1),this.options.maxElements>0&&e("li.Token",this.tokensContainer).length>=this.options.maxElements)return this.resetSearchInput(),this;var s=this,i=e("<a />").addClass("Close").html("&#215;").on("click",function(e){e.stopImmediatePropagation(),s.tokenRemove(t)});if(e('option[value="'+t+'"]',this.select).length)e('option[value="'+t+'"]',this.select).attr("selected",!0).prop("selected",!0);else{if(!(this.options.newElements||!this.options.newElements&&e('li[data-value="'+t+'"]',this.dropdown).length>0))return this.resetSearchInput(),this;var a=e("<option />").attr("selected",!0).attr("value",t).attr("data-type","custom").prop("selected",!0).html(n);this.select.append(a)}return e('li.Token[data-value="'+t+'"]',this.tokensContainer).length>0?this:(e("<li />").addClass("Token").attr("data-value",t).append("<span>"+n+"</span>").prepend(i).insertBefore(this.searchToken),o||this.options.onAddToken(t,n,this),this.resetSearchInput(),this.dropdownHide(),this.updateOrder(),this)},tokenRemove:function(t){var n=e('option[value="'+t+'"]',this.select);return"custom"==n.attr("data-type")?n.remove():n.removeAttr("selected").prop("selected",!1),e('li.Token[data-value="'+t+'"]',this.tokensContainer).remove(),this.options.onRemoveToken(t,this),this.resizeSearchInput(),this.dropdownHide(),this.updateOrder(),this},clear:function(){var t=this;return e("li.Token",this.tokensContainer).each(function(){t.tokenRemove(e(this).attr("data-value"))}),this.options.onClear(this),this.dropdownHide(),this},disable:function(){return this.select.prop("disabled",!0),this.searchInput.prop("disabled",!0),this.container.addClass("Disabled"),this.options.sortable&&this.tokensContainer.sortable("disable"),this},enable:function(){return this.select.prop("disabled",!1),this.searchInput.prop("disabled",!1),this.container.removeClass("Disabled"),this.options.sortable&&this.tokensContainer.sortable("enable"),this},remap:function(t){var n=this,o=e("option:selected",this.select);return void 0==t&&(t=!1),this.clear(),o.each(function(){n.tokenAdd(e(this).val(),e(this).html(),t)}),this},toArray:function(){var t=[];return e("option:selected",this.select).each(function(){t.push(e(this).val())}),t},escape:function(e){return String(e).replace(/["]/g,function(){return""})}}),e.fn.tokenize=function(t){void 0==t&&(t={});var n=this.filter("select");return n.length>1?(n.each(function(){s(t,e(this))}),n):s(t,e(this))},e.fn.tokenize.defaults={datas:"select",placeholder:!1,searchParam:"search",searchMaxLength:0,debounce:0,delimiter:",",newElements:!0,autosize:!1,nbDropdownElements:10,displayDropdownOnFocus:!1,maxElements:0,sortable:!1,dataType:"json",valueField:"value",textField:"text",htmlField:"html",onAddToken:function(){},onRemoveToken:function(){},onClear:function(){},onReorder:function(){},onDropdownAddItem:function(){}}}(jQuery,"tokenize");


// richmarker-compiled.js -------------------------------------------------------------------------------------------------------------------------------------------
function w2dc_load_richtext() {
(function(){var b=true,f=false;function g(a){var c=a||{};this.d=this.c=f;if(a.visible==undefined)a.visible=b;if(a.shadow==undefined)a.shadow="7px -3px 5px rgba(88,88,88,0.7)";if(a.anchor==undefined)a.anchor=i.BOTTOM;this.setValues(c)}g.prototype=new google.maps.OverlayView;window.RichMarker=g;g.prototype.getVisible=function(){return this.get("visible")};g.prototype.getVisible=g.prototype.getVisible;g.prototype.setVisible=function(a){this.set("visible",a)};g.prototype.setVisible=g.prototype.setVisible;
g.prototype.s=function(){if(this.c){this.a.style.display=this.getVisible()?"":"none";this.draw()}};g.prototype.visible_changed=g.prototype.s;g.prototype.setFlat=function(a){this.set("flat",!!a)};g.prototype.setFlat=g.prototype.setFlat;g.prototype.getFlat=function(){return this.get("flat")};g.prototype.getFlat=g.prototype.getFlat;g.prototype.p=function(){return this.get("width")};g.prototype.getWidth=g.prototype.p;g.prototype.o=function(){return this.get("height")};g.prototype.getHeight=g.prototype.o;
g.prototype.setShadow=function(a){this.set("shadow",a);this.g()};g.prototype.setShadow=g.prototype.setShadow;g.prototype.getShadow=function(){return this.get("shadow")};g.prototype.getShadow=g.prototype.getShadow;g.prototype.g=function(){if(this.c)this.a.style.boxShadow=this.a.style.webkitBoxShadow=this.a.style.MozBoxShadow=this.getFlat()?"":this.getShadow()};g.prototype.flat_changed=g.prototype.g;g.prototype.setZIndex=function(a){this.set("zIndex",a)};g.prototype.setZIndex=g.prototype.setZIndex;
g.prototype.getZIndex=function(){return this.get("zIndex")};g.prototype.getZIndex=g.prototype.getZIndex;g.prototype.t=function(){if(this.getZIndex()&&this.c)this.a.style.zIndex=this.getZIndex()};g.prototype.zIndex_changed=g.prototype.t;g.prototype.getDraggable=function(){return this.get("draggable")};g.prototype.getDraggable=g.prototype.getDraggable;g.prototype.setDraggable=function(a){this.set("draggable",!!a)};g.prototype.setDraggable=g.prototype.setDraggable;
g.prototype.k=function(){if(this.c)this.getDraggable()?j(this,this.a):k(this)};g.prototype.draggable_changed=g.prototype.k;g.prototype.getPosition=function(){return this.get("position")};g.prototype.getPosition=g.prototype.getPosition;g.prototype.setPosition=function(a){this.set("position",a)};g.prototype.setPosition=g.prototype.setPosition;g.prototype.q=function(){this.draw()};g.prototype.position_changed=g.prototype.q;g.prototype.l=function(){return this.get("anchor")};g.prototype.getAnchor=g.prototype.l;
g.prototype.r=function(a){this.set("anchor",a)};g.prototype.setAnchor=g.prototype.r;g.prototype.n=function(){this.draw()};g.prototype.anchor_changed=g.prototype.n;function l(a,c){var d=document.createElement("DIV");d.innerHTML=c;if(d.childNodes.length==1)return d.removeChild(d.firstChild);else{for(var e=document.createDocumentFragment();d.firstChild;)e.appendChild(d.firstChild);return e}}function m(a,c){if(c)for(var d;d=c.firstChild;)c.removeChild(d)}
g.prototype.setContent=function(a){this.set("content",a)};g.prototype.setContent=g.prototype.setContent;g.prototype.getContent=function(){return this.get("content")};g.prototype.getContent=g.prototype.getContent;
g.prototype.j=function(){if(this.b){m(this,this.b);var a=this.getContent();if(a){if(typeof a=="string"){a=a.replace(/^\s*([\S\s]*)\b\s*$/,"$1");a=l(this,a)}this.b.appendChild(a);var c=this;a=this.b.getElementsByTagName("IMG");for(var d=0,e;e=a[d];d++){google.maps.event.addDomListener(e,"mousedown",function(h){if(c.getDraggable()){h.preventDefault&&h.preventDefault();h.returnValue=f}});google.maps.event.addDomListener(e,"load",function(){c.draw()})}google.maps.event.trigger(this,"domready")}this.c&&
this.draw()}};g.prototype.content_changed=g.prototype.j;function n(a,c){if(a.c){var d="";if(navigator.userAgent.indexOf("Gecko/")!==-1){if(c=="dragging")d="-moz-grabbing";if(c=="dragready")d="-moz-grab"}else if(c=="dragging"||c=="dragready")d="move";if(c=="draggable")d="pointer";if(a.a.style.cursor!=d)a.a.style.cursor=d}}
function o(a,c){if(a.getDraggable())if(!a.d){a.d=b;var d=a.getMap();a.m=d.get("draggable");d.set("draggable",f);a.h=c.clientX;a.i=c.clientY;n(a,"dragready");a.a.style.MozUserSelect="none";a.a.style.KhtmlUserSelect="none";a.a.style.WebkitUserSelect="none";a.a.unselectable="on";a.a.onselectstart=function(){return f};p(a);google.maps.event.trigger(a,"dragstart")}}
function q(a){if(a.getDraggable())if(a.d){a.d=f;a.getMap().set("draggable",a.m);a.h=a.i=a.m=null;a.a.style.MozUserSelect="";a.a.style.KhtmlUserSelect="";a.a.style.WebkitUserSelect="";a.a.unselectable="off";a.a.onselectstart=function(){};r(a);n(a,"draggable");google.maps.event.trigger(a,"dragend");a.draw()}}
function s(a,c){if(!a.getDraggable()||!a.d)q(a);else{var d=a.h-c.clientX,e=a.i-c.clientY;a.h=c.clientX;a.i=c.clientY;d=parseInt(a.a.style.left,10)-d;e=parseInt(a.a.style.top,10)-e;a.a.style.left=d+"px";a.a.style.top=e+"px";var h=t(a);a.setPosition(a.getProjection().fromDivPixelToLatLng(new google.maps.Point(d-h.width,e-h.height)));n(a,"dragging");google.maps.event.trigger(a,"drag")}}function k(a){if(a.f){google.maps.event.removeListener(a.f);delete a.f}n(a,"")}
function j(a,c){if(c){a.f=google.maps.event.addDomListener(c,"mousedown",function(d){o(a,d)});n(a,"draggable")}}function p(a){if(a.a.setCapture){a.a.setCapture(b);a.e=[google.maps.event.addDomListener(a.a,"mousemove",function(c){s(a,c)},b),google.maps.event.addDomListener(a.a,"mouseup",function(){q(a);a.a.releaseCapture()},b)]}else a.e=[google.maps.event.addDomListener(window,"mousemove",function(c){s(a,c)},b),google.maps.event.addDomListener(window,"mouseup",function(){q(a)},b)]}
function r(a){if(a.e){for(var c=0,d;d=a.e[c];c++)google.maps.event.removeListener(d);a.e.length=0}}
function t(a){var c=a.l();if(typeof c=="object")return c;var d=new google.maps.Size(0,0);if(!a.b)return d;var e=a.b.offsetWidth;a=a.b.offsetHeight;switch(c){case i.TOP:d.width=-e/2;break;case i.TOP_RIGHT:d.width=-e;break;case i.LEFT:d.height=-a/2;break;case i.MIDDLE:d.width=-e/2;d.height=-a/2;break;case i.RIGHT:d.width=-e;d.height=-a/2;break;case i.BOTTOM_LEFT:d.height=-a;break;case i.BOTTOM:d.width=-e/2;d.height=-a;break;case i.BOTTOM_RIGHT:d.width=-e;d.height=-a}return d}
g.prototype.onAdd=function(){if(!this.a){this.a=document.createElement("DIV");this.a.style.position="absolute"}if(this.getZIndex())this.a.style.zIndex=this.getZIndex();this.a.style.display=this.getVisible()?"":"none";if(!this.b){this.b=document.createElement("DIV");this.a.appendChild(this.b);var a=this;google.maps.event.addDomListener(this.b,"click",function(){google.maps.event.trigger(a,"click")});google.maps.event.addDomListener(this.b,"mouseover",function(){google.maps.event.trigger(a,"mouseover")});
google.maps.event.addDomListener(this.b,"mouseout",function(){google.maps.event.trigger(a,"mouseout")})}this.c=b;this.j();this.g();this.k();var c=this.getPanes();c&&c.overlayImage.appendChild(this.a);google.maps.event.trigger(this,"ready")};g.prototype.onAdd=g.prototype.onAdd;
g.prototype.draw=function(){if(!(!this.c||this.d)){var a=this.getProjection();if(a){var c=this.get("position");a=a.fromLatLngToDivPixel(c);c=t(this);this.a.style.top=a.y+c.height+"px";this.a.style.left=a.x+c.width+"px";a=this.b.offsetHeight;c=this.b.offsetWidth;c!=this.get("width")&&this.set("width",c);a!=this.get("height")&&this.set("height",a)}}};g.prototype.draw=g.prototype.draw;g.prototype.onRemove=function(){this.a&&this.a.parentNode&&this.a.parentNode.removeChild(this.a);k(this)};
g.prototype.onRemove=g.prototype.onRemove;var i={TOP_LEFT:1,TOP:2,TOP_RIGHT:3,LEFT:4,MIDDLE:5,RIGHT:6,BOTTOM_LEFT:7,BOTTOM:8,BOTTOM_RIGHT:9};window.RichMarkerPosition=i;
})();
};


/* jquery.nicescroll v3.7.6 InuYaksa - MIT - https://nicescroll.areaaperta.com */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof exports?module.exports=e(require("jquery")):e(jQuery)}(function(e){"use strict";var o=!1,t=!1,r=0,i=2e3,s=0,n=e,l=document,a=window,c=n(a),d=[],u=a.requestAnimationFrame||a.webkitRequestAnimationFrame||a.mozRequestAnimationFrame||!1,h=a.cancelAnimationFrame||a.webkitCancelAnimationFrame||a.mozCancelAnimationFrame||!1;if(u)a.cancelAnimationFrame||(h=function(e){});else{var p=0;u=function(e,o){var t=(new Date).getTime(),r=Math.max(0,16-(t-p)),i=a.setTimeout(function(){e(t+r)},r);return p=t+r,i},h=function(e){a.clearTimeout(e)}}var m=a.MutationObserver||a.WebKitMutationObserver||!1,f=Date.now||function(){return(new Date).getTime()},g={zindex:"auto",cursoropacitymin:0,cursoropacitymax:1,cursorcolor:"#424242",cursorwidth:"6px",cursorborder:"1px solid #fff",cursorborderradius:"5px",scrollspeed:40,mousescrollstep:27,touchbehavior:!1,emulatetouch:!1,hwacceleration:!0,usetransition:!0,boxzoom:!1,dblclickzoom:!0,gesturezoom:!0,grabcursorenabled:!0,autohidemode:!0,background:"",iframeautoresize:!0,cursorminheight:32,preservenativescrolling:!0,railoffset:!1,railhoffset:!1,bouncescroll:!0,spacebarenabled:!0,railpadding:{top:0,right:0,left:0,bottom:0},disableoutline:!0,horizrailenabled:!0,railalign:"right",railvalign:"bottom",enabletranslate3d:!0,enablemousewheel:!0,enablekeyboard:!0,smoothscroll:!0,sensitiverail:!0,enablemouselockapi:!0,cursorfixedheight:!1,directionlockdeadzone:6,hidecursordelay:400,nativeparentscrolling:!0,enablescrollonselection:!0,overflowx:!0,overflowy:!0,cursordragspeed:.3,rtlmode:"auto",cursordragontouch:!1,oneaxismousemode:"auto",scriptpath:function(){var e=l.currentScript||function(){var e=l.getElementsByTagName("script");return!!e.length&&e[e.length-1]}(),o=e?e.src.split("?")[0]:"";return o.split("/").length>0?o.split("/").slice(0,-1).join("/")+"/":""}(),preventmultitouchscrolling:!0,disablemutationobserver:!1,enableobserver:!0,scrollbarid:!1},v=!1,w=function(){if(v)return v;var e=l.createElement("DIV"),o=e.style,t=navigator.userAgent,r=navigator.platform,i={};return i.haspointerlock="pointerLockElement"in l||"webkitPointerLockElement"in l||"mozPointerLockElement"in l,i.isopera="opera"in a,i.isopera12=i.isopera&&"getUserMedia"in navigator,i.isoperamini="[object OperaMini]"===Object.prototype.toString.call(a.operamini),i.isie="all"in l&&"attachEvent"in e&&!i.isopera,i.isieold=i.isie&&!("msInterpolationMode"in o),i.isie7=i.isie&&!i.isieold&&(!("documentMode"in l)||7===l.documentMode),i.isie8=i.isie&&"documentMode"in l&&8===l.documentMode,i.isie9=i.isie&&"performance"in a&&9===l.documentMode,i.isie10=i.isie&&"performance"in a&&10===l.documentMode,i.isie11="msRequestFullscreen"in e&&l.documentMode>=11,i.ismsedge="msCredentials"in a,i.ismozilla="MozAppearance"in o,i.iswebkit=!i.ismsedge&&"WebkitAppearance"in o,i.ischrome=i.iswebkit&&"chrome"in a,i.ischrome38=i.ischrome&&"touchAction"in o,i.ischrome22=!i.ischrome38&&i.ischrome&&i.haspointerlock,i.ischrome26=!i.ischrome38&&i.ischrome&&"transition"in o,i.cantouch="ontouchstart"in l.documentElement||"ontouchstart"in a,i.hasw3ctouch=(a.PointerEvent||!1)&&(navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0),i.hasmstouch=!i.hasw3ctouch&&(a.MSPointerEvent||!1),i.ismac=/^mac$/i.test(r),i.isios=i.cantouch&&/iphone|ipad|ipod/i.test(r),i.isios4=i.isios&&!("seal"in Object),i.isios7=i.isios&&"webkitHidden"in l,i.isios8=i.isios&&"hidden"in l,i.isios10=i.isios&&a.Proxy,i.isandroid=/android/i.test(t),i.haseventlistener="addEventListener"in e,i.trstyle=!1,i.hastransform=!1,i.hastranslate3d=!1,i.transitionstyle=!1,i.hastransition=!1,i.transitionend=!1,i.trstyle="transform",i.hastransform="transform"in o||function(){for(var e=["msTransform","webkitTransform","MozTransform","OTransform"],t=0,r=e.length;t<r;t++)if(void 0!==o[e[t]]){i.trstyle=e[t];break}i.hastransform=!!i.trstyle}(),i.hastransform&&(o[i.trstyle]="translate3d(1px,2px,3px)",i.hastranslate3d=/translate3d/.test(o[i.trstyle])),i.transitionstyle="transition",i.prefixstyle="",i.transitionend="transitionend",i.hastransition="transition"in o||function(){i.transitionend=!1;for(var e=["webkitTransition","msTransition","MozTransition","OTransition","OTransition","KhtmlTransition"],t=["-webkit-","-ms-","-moz-","-o-","-o","-khtml-"],r=["webkitTransitionEnd","msTransitionEnd","transitionend","otransitionend","oTransitionEnd","KhtmlTransitionEnd"],s=0,n=e.length;s<n;s++)if(e[s]in o){i.transitionstyle=e[s],i.prefixstyle=t[s],i.transitionend=r[s];break}i.ischrome26&&(i.prefixstyle=t[1]),i.hastransition=i.transitionstyle}(),i.cursorgrabvalue=function(){var e=["grab","-webkit-grab","-moz-grab"];(i.ischrome&&!i.ischrome38||i.isie)&&(e=[]);for(var t=0,r=e.length;t<r;t++){var s=e[t];if(o.cursor=s,o.cursor==s)return s}return"url(https://cdnjs.cloudflare.com/ajax/libs/slider-pro/1.3.0/css/images/openhand.cur),n-resize"}(),i.hasmousecapture="setCapture"in e,i.hasMutationObserver=!1!==m,e=null,v=i,i},b=function(e,p){function v(){var e=T.doc.css(P.trstyle);return!(!e||"matrix"!=e.substr(0,6))&&e.replace(/^.*\((.*)\)$/g,"$1").replace(/px/g,"").split(/, +/)}function b(){var e=T.win;if("zIndex"in e)return e.zIndex();for(;e.length>0;){if(9==e[0].nodeType)return!1;var o=e.css("zIndex");if(!isNaN(o)&&0!==o)return parseInt(o);e=e.parent()}return!1}function x(e,o,t){var r=e.css(o),i=parseFloat(r);if(isNaN(i)){var s=3==(i=I[r]||0)?t?T.win.outerHeight()-T.win.innerHeight():T.win.outerWidth()-T.win.innerWidth():1;return T.isie8&&i&&(i+=1),s?i:0}return i}function S(e,o,t,r){T._bind(e,o,function(r){var i={original:r=r||a.event,target:r.target||r.srcElement,type:"wheel",deltaMode:"MozMousePixelScroll"==r.type?0:1,deltaX:0,deltaZ:0,preventDefault:function(){return r.preventDefault?r.preventDefault():r.returnValue=!1,!1},stopImmediatePropagation:function(){r.stopImmediatePropagation?r.stopImmediatePropagation():r.cancelBubble=!0}};return"mousewheel"==o?(r.wheelDeltaX&&(i.deltaX=-.025*r.wheelDeltaX),r.wheelDeltaY&&(i.deltaY=-.025*r.wheelDeltaY),!i.deltaY&&!i.deltaX&&(i.deltaY=-.025*r.wheelDelta)):i.deltaY=r.detail,t.call(e,i)},r)}function z(e,o,t,r){T.scrollrunning||(T.newscrolly=T.getScrollTop(),T.newscrollx=T.getScrollLeft(),D=f());var i=f()-D;if(D=f(),i>350?A=1:A+=(2-A)/10,e=e*A|0,o=o*A|0,e){if(r)if(e<0){if(T.getScrollLeft()>=T.page.maxw)return!0}else if(T.getScrollLeft()<=0)return!0;var s=e>0?1:-1;X!==s&&(T.scrollmom&&T.scrollmom.stop(),T.newscrollx=T.getScrollLeft(),X=s),T.lastdeltax-=e}if(o){if(function(){var e=T.getScrollTop();if(o<0){if(e>=T.page.maxh)return!0}else if(e<=0)return!0}()){if(M.nativeparentscrolling&&t&&!T.ispage&&!T.zoomactive)return!0;var n=T.view.h>>1;T.newscrolly<-n?(T.newscrolly=-n,o=-1):T.newscrolly>T.page.maxh+n?(T.newscrolly=T.page.maxh+n,o=1):o=0}var l=o>0?1:-1;B!==l&&(T.scrollmom&&T.scrollmom.stop(),T.newscrolly=T.getScrollTop(),B=l),T.lastdeltay-=o}(o||e)&&T.synched("relativexy",function(){var e=T.lastdeltay+T.newscrolly;T.lastdeltay=0;var o=T.lastdeltax+T.newscrollx;T.lastdeltax=0,T.rail.drag||T.doScrollPos(o,e)})}function k(e,o,t){var r,i;return!(t||!q)||(0===e.deltaMode?(r=-e.deltaX*(M.mousescrollstep/54)|0,i=-e.deltaY*(M.mousescrollstep/54)|0):1===e.deltaMode&&(r=-e.deltaX*M.mousescrollstep*50/80|0,i=-e.deltaY*M.mousescrollstep*50/80|0),o&&M.oneaxismousemode&&0===r&&i&&(r=i,i=0,t&&(r<0?T.getScrollLeft()>=T.page.maxw:T.getScrollLeft()<=0)&&(i=r,r=0)),T.isrtlmode&&(r=-r),z(r,i,t,!0)?void(t&&(q=!0)):(q=!1,e.stopImmediatePropagation(),e.preventDefault()))}var T=this;this.version="3.7.6",this.name="nicescroll",this.me=p;var E=n("body"),M=this.opt={doc:E,win:!1};if(n.extend(M,g),M.snapbackspeed=80,e)for(var L in M)void 0!==e[L]&&(M[L]=e[L]);if(M.disablemutationobserver&&(m=!1),this.doc=M.doc,this.iddoc=this.doc&&this.doc[0]?this.doc[0].id||"":"",this.ispage=/^BODY|HTML/.test(M.win?M.win[0].nodeName:this.doc[0].nodeName),this.haswrapper=!1!==M.win,this.win=M.win||(this.ispage?c:this.doc),this.docscroll=this.ispage&&!this.haswrapper?c:this.win,this.body=E,this.viewport=!1,this.isfixed=!1,this.iframe=!1,this.isiframe="IFRAME"==this.doc[0].nodeName&&"IFRAME"==this.win[0].nodeName,this.istextarea="TEXTAREA"==this.win[0].nodeName,this.forcescreen=!1,this.canshowonmouseevent="scroll"!=M.autohidemode,this.onmousedown=!1,this.onmouseup=!1,this.onmousemove=!1,this.onmousewheel=!1,this.onkeypress=!1,this.ongesturezoom=!1,this.onclick=!1,this.onscrollstart=!1,this.onscrollend=!1,this.onscrollcancel=!1,this.onzoomin=!1,this.onzoomout=!1,this.view=!1,this.page=!1,this.scroll={x:0,y:0},this.scrollratio={x:0,y:0},this.cursorheight=20,this.scrollvaluemax=0,"auto"==M.rtlmode){var C=this.win[0]==a?this.body:this.win,N=C.css("writing-mode")||C.css("-webkit-writing-mode")||C.css("-ms-writing-mode")||C.css("-moz-writing-mode");"horizontal-tb"==N||"lr-tb"==N||""===N?(this.isrtlmode="rtl"==C.css("direction"),this.isvertical=!1):(this.isrtlmode="vertical-rl"==N||"tb"==N||"tb-rl"==N||"rl-tb"==N,this.isvertical="vertical-rl"==N||"tb"==N||"tb-rl"==N)}else this.isrtlmode=!0===M.rtlmode,this.isvertical=!1;if(this.scrollrunning=!1,this.scrollmom=!1,this.observer=!1,this.observerremover=!1,this.observerbody=!1,!1!==M.scrollbarid)this.id=M.scrollbarid;else do{this.id="ascrail"+i++}while(l.getElementById(this.id));this.rail=!1,this.cursor=!1,this.cursorfreezed=!1,this.selectiondrag=!1,this.zoom=!1,this.zoomactive=!1,this.hasfocus=!1,this.hasmousefocus=!1,this.railslocked=!1,this.locked=!1,this.hidden=!1,this.cursoractive=!0,this.wheelprevented=!1,this.overflowx=M.overflowx,this.overflowy=M.overflowy,this.nativescrollingarea=!1,this.checkarea=0,this.events=[],this.saved={},this.delaylist={},this.synclist={},this.lastdeltax=0,this.lastdeltay=0,this.detected=w();var P=n.extend({},this.detected);this.canhwscroll=P.hastransform&&M.hwacceleration,this.ishwscroll=this.canhwscroll&&T.haswrapper,this.isrtlmode?this.isvertical?this.hasreversehr=!(P.iswebkit||P.isie||P.isie11):this.hasreversehr=!(P.iswebkit||P.isie&&!P.isie10&&!P.isie11):this.hasreversehr=!1,this.istouchcapable=!1,P.cantouch||!P.hasw3ctouch&&!P.hasmstouch?!P.cantouch||P.isios||P.isandroid||!P.iswebkit&&!P.ismozilla||(this.istouchcapable=!0):this.istouchcapable=!0,M.enablemouselockapi||(P.hasmousecapture=!1,P.haspointerlock=!1),this.debounced=function(e,o,t){T&&(T.delaylist[e]||!1||(T.delaylist[e]={h:u(function(){T.delaylist[e].fn.call(T),T.delaylist[e]=!1},t)},o.call(T)),T.delaylist[e].fn=o)},this.synched=function(e,o){T.synclist[e]?T.synclist[e]=o:(T.synclist[e]=o,u(function(){T&&(T.synclist[e]&&T.synclist[e].call(T),T.synclist[e]=null)}))},this.unsynched=function(e){T.synclist[e]&&(T.synclist[e]=!1)},this.css=function(e,o){for(var t in o)T.saved.css.push([e,t,e.css(t)]),e.css(t,o[t])},this.scrollTop=function(e){return void 0===e?T.getScrollTop():T.setScrollTop(e)},this.scrollLeft=function(e){return void 0===e?T.getScrollLeft():T.setScrollLeft(e)};var R=function(e,o,t,r,i,s,n){this.st=e,this.ed=o,this.spd=t,this.p1=r||0,this.p2=i||1,this.p3=s||0,this.p4=n||1,this.ts=f(),this.df=o-e};if(R.prototype={B2:function(e){return 3*(1-e)*(1-e)*e},B3:function(e){return 3*(1-e)*e*e},B4:function(e){return e*e*e},getPos:function(){return(f()-this.ts)/this.spd},getNow:function(){var e=(f()-this.ts)/this.spd,o=this.B2(e)+this.B3(e)+this.B4(e);return e>=1?this.ed:this.st+this.df*o|0},update:function(e,o){return this.st=this.getNow(),this.ed=e,this.spd=o,this.ts=f(),this.df=this.ed-this.st,this}},this.ishwscroll){this.doc.translate={x:0,y:0,tx:"0px",ty:"0px"},P.hastranslate3d&&P.isios&&this.doc.css("-webkit-backface-visibility","hidden"),this.getScrollTop=function(e){if(!e){var o=v();if(o)return 16==o.length?-o[13]:-o[5];if(T.timerscroll&&T.timerscroll.bz)return T.timerscroll.bz.getNow()}return T.doc.translate.y},this.getScrollLeft=function(e){if(!e){var o=v();if(o)return 16==o.length?-o[12]:-o[4];if(T.timerscroll&&T.timerscroll.bh)return T.timerscroll.bh.getNow()}return T.doc.translate.x},this.notifyScrollEvent=function(e){var o=l.createEvent("UIEvents");o.initUIEvent("scroll",!1,!1,a,1),o.niceevent=!0,e.dispatchEvent(o)};var _=this.isrtlmode?1:-1;P.hastranslate3d&&M.enabletranslate3d?(this.setScrollTop=function(e,o){T.doc.translate.y=e,T.doc.translate.ty=-1*e+"px",T.doc.css(P.trstyle,"translate3d("+T.doc.translate.tx+","+T.doc.translate.ty+",0)"),o||T.notifyScrollEvent(T.win[0])},this.setScrollLeft=function(e,o){T.doc.translate.x=e,T.doc.translate.tx=e*_+"px",T.doc.css(P.trstyle,"translate3d("+T.doc.translate.tx+","+T.doc.translate.ty+",0)"),o||T.notifyScrollEvent(T.win[0])}):(this.setScrollTop=function(e,o){T.doc.translate.y=e,T.doc.translate.ty=-1*e+"px",T.doc.css(P.trstyle,"translate("+T.doc.translate.tx+","+T.doc.translate.ty+")"),o||T.notifyScrollEvent(T.win[0])},this.setScrollLeft=function(e,o){T.doc.translate.x=e,T.doc.translate.tx=e*_+"px",T.doc.css(P.trstyle,"translate("+T.doc.translate.tx+","+T.doc.translate.ty+")"),o||T.notifyScrollEvent(T.win[0])})}else this.getScrollTop=function(){return T.docscroll.scrollTop()},this.setScrollTop=function(e){T.docscroll.scrollTop(e)},this.getScrollLeft=function(){return T.hasreversehr?T.detected.ismozilla?T.page.maxw-Math.abs(T.docscroll.scrollLeft()):T.page.maxw-T.docscroll.scrollLeft():T.docscroll.scrollLeft()},this.setScrollLeft=function(e){return setTimeout(function(){if(T)return T.hasreversehr&&(e=T.detected.ismozilla?-(T.page.maxw-e):T.page.maxw-e),T.docscroll.scrollLeft(e)},1)};this.getTarget=function(e){return!!e&&(e.target?e.target:!!e.srcElement&&e.srcElement)},this.hasParent=function(e,o){if(!e)return!1;for(var t=e.target||e.srcElement||e||!1;t&&t.id!=o;)t=t.parentNode||!1;return!1!==t};var I={thin:1,medium:3,thick:5};this.getDocumentScrollOffset=function(){return{top:a.pageYOffset||l.documentElement.scrollTop,left:a.pageXOffset||l.documentElement.scrollLeft}},this.getOffset=function(){if(T.isfixed){var e=T.win.offset(),o=T.getDocumentScrollOffset();return e.top-=o.top,e.left-=o.left,e}var t=T.win.offset();if(!T.viewport)return t;var r=T.viewport.offset();return{top:t.top-r.top,left:t.left-r.left}},this.updateScrollBar=function(e){var o,t;if(T.ishwscroll)T.rail.css({height:T.win.innerHeight()-(M.railpadding.top+M.railpadding.bottom)}),T.railh&&T.railh.css({width:T.win.innerWidth()-(M.railpadding.left+M.railpadding.right)});else{var r=T.getOffset();if(o={top:r.top,left:r.left-(M.railpadding.left+M.railpadding.right)},o.top+=x(T.win,"border-top-width",!0),o.left+=T.rail.align?T.win.outerWidth()-x(T.win,"border-right-width")-T.rail.width:x(T.win,"border-left-width"),(t=M.railoffset)&&(t.top&&(o.top+=t.top),t.left&&(o.left+=t.left)),T.railslocked||T.rail.css({top:o.top,left:o.left,height:(e?e.h:T.win.innerHeight())-(M.railpadding.top+M.railpadding.bottom)}),T.zoom&&T.zoom.css({top:o.top+1,left:1==T.rail.align?o.left-20:o.left+T.rail.width+4}),T.railh&&!T.railslocked){o={top:r.top,left:r.left},(t=M.railhoffset)&&(t.top&&(o.top+=t.top),t.left&&(o.left+=t.left));var i=T.railh.align?o.top+x(T.win,"border-top-width",!0)+T.win.innerHeight()-T.railh.height:o.top+x(T.win,"border-top-width",!0),s=o.left+x(T.win,"border-left-width");T.railh.css({top:i-(M.railpadding.top+M.railpadding.bottom),left:s,width:T.railh.width})}}},this.doRailClick=function(e,o,t){var r,i,s,n;T.railslocked||(T.cancelEvent(e),"pageY"in e||(e.pageX=e.clientX+l.documentElement.scrollLeft,e.pageY=e.clientY+l.documentElement.scrollTop),o?(r=t?T.doScrollLeft:T.doScrollTop,s=t?(e.pageX-T.railh.offset().left-T.cursorwidth/2)*T.scrollratio.x:(e.pageY-T.rail.offset().top-T.cursorheight/2)*T.scrollratio.y,T.unsynched("relativexy"),r(0|s)):(r=t?T.doScrollLeftBy:T.doScrollBy,s=t?T.scroll.x:T.scroll.y,n=t?e.pageX-T.railh.offset().left:e.pageY-T.rail.offset().top,i=t?T.view.w:T.view.h,r(s>=n?i:-i)))},T.newscrolly=T.newscrollx=0,T.hasanimationframe="requestAnimationFrame"in a,T.hascancelanimationframe="cancelAnimationFrame"in a,T.hasborderbox=!1,this.init=function(){if(T.saved.css=[],P.isoperamini)return!0;if(P.isandroid&&!("hidden"in l))return!0;M.emulatetouch=M.emulatetouch||M.touchbehavior,T.hasborderbox=a.getComputedStyle&&"border-box"===a.getComputedStyle(l.body)["box-sizing"];var e={"overflow-y":"hidden"};if((P.isie11||P.isie10)&&(e["-ms-overflow-style"]="none"),T.ishwscroll&&(this.doc.css(P.transitionstyle,P.prefixstyle+"transform 0ms ease-out"),P.transitionend&&T.bind(T.doc,P.transitionend,T.onScrollTransitionEnd,!1)),T.zindex="auto",T.ispage||"auto"!=M.zindex?T.zindex=M.zindex:T.zindex=b()||"auto",!T.ispage&&"auto"!=T.zindex&&T.zindex>s&&(s=T.zindex),T.isie&&0===T.zindex&&"auto"==M.zindex&&(T.zindex="auto"),!T.ispage||!P.isieold){var i=T.docscroll;T.ispage&&(i=T.haswrapper?T.win:T.doc),T.css(i,e),T.ispage&&(P.isie11||P.isie)&&T.css(n("html"),e),!P.isios||T.ispage||T.haswrapper||T.css(E,{"-webkit-overflow-scrolling":"touch"});var d=n(l.createElement("div"));d.css({position:"relative",top:0,float:"right",width:M.cursorwidth,height:0,"background-color":M.cursorcolor,border:M.cursorborder,"background-clip":"padding-box","-webkit-border-radius":M.cursorborderradius,"-moz-border-radius":M.cursorborderradius,"border-radius":M.cursorborderradius}),d.addClass("nicescroll-cursors"),T.cursor=d;var u=n(l.createElement("div"));u.attr("id",T.id),u.addClass("nicescroll-rails nicescroll-rails-vr");var h,p,f=["left","right","top","bottom"];for(var g in f)p=f[g],(h=M.railpadding[p]||0)&&u.css("padding-"+p,h+"px");u.append(d),u.width=Math.max(parseFloat(M.cursorwidth),d.outerWidth()),u.css({width:u.width+"px",zIndex:T.zindex,background:M.background,cursor:"default"}),u.visibility=!0,u.scrollable=!0,u.align="left"==M.railalign?0:1,T.rail=u,T.rail.drag=!1;var v=!1;!M.boxzoom||T.ispage||P.isieold||(v=l.createElement("div"),T.bind(v,"click",T.doZoom),T.bind(v,"mouseenter",function(){T.zoom.css("opacity",M.cursoropacitymax)}),T.bind(v,"mouseleave",function(){T.zoom.css("opacity",M.cursoropacitymin)}),T.zoom=n(v),T.zoom.css({cursor:"pointer",zIndex:T.zindex,backgroundImage:"url("+M.scriptpath+"zoomico.png)",height:18,width:18,backgroundPosition:"0 0"}),M.dblclickzoom&&T.bind(T.win,"dblclick",T.doZoom),P.cantouch&&M.gesturezoom&&(T.ongesturezoom=function(e){return e.scale>1.5&&T.doZoomIn(e),e.scale<.8&&T.doZoomOut(e),T.cancelEvent(e)},T.bind(T.win,"gestureend",T.ongesturezoom))),T.railh=!1;var w;if(M.horizrailenabled&&(T.css(i,{overflowX:"hidden"}),(d=n(l.createElement("div"))).css({position:"absolute",top:0,height:M.cursorwidth,width:0,backgroundColor:M.cursorcolor,border:M.cursorborder,backgroundClip:"padding-box","-webkit-border-radius":M.cursorborderradius,"-moz-border-radius":M.cursorborderradius,"border-radius":M.cursorborderradius}),P.isieold&&d.css("overflow","hidden"),d.addClass("nicescroll-cursors"),T.cursorh=d,(w=n(l.createElement("div"))).attr("id",T.id+"-hr"),w.addClass("nicescroll-rails nicescroll-rails-hr"),w.height=Math.max(parseFloat(M.cursorwidth),d.outerHeight()),w.css({height:w.height+"px",zIndex:T.zindex,background:M.background}),w.append(d),w.visibility=!0,w.scrollable=!0,w.align="top"==M.railvalign?0:1,T.railh=w,T.railh.drag=!1),T.ispage)u.css({position:"fixed",top:0,height:"100%"}),u.css(u.align?{right:0}:{left:0}),T.body.append(u),T.railh&&(w.css({position:"fixed",left:0,width:"100%"}),w.css(w.align?{bottom:0}:{top:0}),T.body.append(w));else{if(T.ishwscroll){"static"==T.win.css("position")&&T.css(T.win,{position:"relative"});var x="HTML"==T.win[0].nodeName?T.body:T.win;n(x).scrollTop(0).scrollLeft(0),T.zoom&&(T.zoom.css({position:"absolute",top:1,right:0,"margin-right":u.width+4}),x.append(T.zoom)),u.css({position:"absolute",top:0}),u.css(u.align?{right:0}:{left:0}),x.append(u),w&&(w.css({position:"absolute",left:0,bottom:0}),w.css(w.align?{bottom:0}:{top:0}),x.append(w))}else{T.isfixed="fixed"==T.win.css("position");var S=T.isfixed?"fixed":"absolute";T.isfixed||(T.viewport=T.getViewport(T.win[0])),T.viewport&&(T.body=T.viewport,/fixed|absolute/.test(T.viewport.css("position"))||T.css(T.viewport,{position:"relative"})),u.css({position:S}),T.zoom&&T.zoom.css({position:S}),T.updateScrollBar(),T.body.append(u),T.zoom&&T.body.append(T.zoom),T.railh&&(w.css({position:S}),T.body.append(w))}P.isios&&T.css(T.win,{"-webkit-tap-highlight-color":"rgba(0,0,0,0)","-webkit-touch-callout":"none"}),M.disableoutline&&(P.isie&&T.win.attr("hideFocus","true"),P.iswebkit&&T.win.css("outline","none"))}if(!1===M.autohidemode?(T.autohidedom=!1,T.rail.css({opacity:M.cursoropacitymax}),T.railh&&T.railh.css({opacity:M.cursoropacitymax})):!0===M.autohidemode||"leave"===M.autohidemode?(T.autohidedom=n().add(T.rail),P.isie8&&(T.autohidedom=T.autohidedom.add(T.cursor)),T.railh&&(T.autohidedom=T.autohidedom.add(T.railh)),T.railh&&P.isie8&&(T.autohidedom=T.autohidedom.add(T.cursorh))):"scroll"==M.autohidemode?(T.autohidedom=n().add(T.rail),T.railh&&(T.autohidedom=T.autohidedom.add(T.railh))):"cursor"==M.autohidemode?(T.autohidedom=n().add(T.cursor),T.railh&&(T.autohidedom=T.autohidedom.add(T.cursorh))):"hidden"==M.autohidemode&&(T.autohidedom=!1,T.hide(),T.railslocked=!1),P.cantouch||T.istouchcapable||M.emulatetouch||P.hasmstouch){T.scrollmom=new y(T);T.ontouchstart=function(e){if(T.locked)return!1;if(e.pointerType&&("mouse"===e.pointerType||e.pointerType===e.MSPOINTER_TYPE_MOUSE))return!1;if(T.hasmoving=!1,T.scrollmom.timer&&(T.triggerScrollEnd(),T.scrollmom.stop()),!T.railslocked){var o=T.getTarget(e);if(o&&/INPUT/i.test(o.nodeName)&&/range/i.test(o.type))return T.stopPropagation(e);var t="mousedown"===e.type;if(!("clientX"in e)&&"changedTouches"in e&&(e.clientX=e.changedTouches[0].clientX,e.clientY=e.changedTouches[0].clientY),T.forcescreen){var r=e;(e={original:e.original?e.original:e}).clientX=r.screenX,e.clientY=r.screenY}if(T.rail.drag={x:e.clientX,y:e.clientY,sx:T.scroll.x,sy:T.scroll.y,st:T.getScrollTop(),sl:T.getScrollLeft(),pt:2,dl:!1,tg:o},T.ispage||!M.directionlockdeadzone)T.rail.drag.dl="f";else{var i={w:c.width(),h:c.height()},s=T.getContentSize(),l=s.h-i.h,a=s.w-i.w;T.rail.scrollable&&!T.railh.scrollable?T.rail.drag.ck=l>0&&"v":!T.rail.scrollable&&T.railh.scrollable?T.rail.drag.ck=a>0&&"h":T.rail.drag.ck=!1}if(M.emulatetouch&&T.isiframe&&P.isie){var d=T.win.position();T.rail.drag.x+=d.left,T.rail.drag.y+=d.top}if(T.hasmoving=!1,T.lastmouseup=!1,T.scrollmom.reset(e.clientX,e.clientY),o&&t){if(!/INPUT|SELECT|BUTTON|TEXTAREA/i.test(o.nodeName))return P.hasmousecapture&&o.setCapture(),M.emulatetouch?(o.onclick&&!o._onclick&&(o._onclick=o.onclick,o.onclick=function(e){if(T.hasmoving)return!1;o._onclick.call(this,e)}),T.cancelEvent(e)):T.stopPropagation(e);/SUBMIT|CANCEL|BUTTON/i.test(n(o).attr("type"))&&(T.preventclick={tg:o,click:!1})}}},T.ontouchend=function(e){if(!T.rail.drag)return!0;if(2==T.rail.drag.pt){if(e.pointerType&&("mouse"===e.pointerType||e.pointerType===e.MSPOINTER_TYPE_MOUSE))return!1;T.rail.drag=!1;var o="mouseup"===e.type;if(T.hasmoving&&(T.scrollmom.doMomentum(),T.lastmouseup=!0,T.hideCursor(),P.hasmousecapture&&l.releaseCapture(),o))return T.cancelEvent(e)}else if(1==T.rail.drag.pt)return T.onmouseup(e)};var z=M.emulatetouch&&T.isiframe&&!P.hasmousecapture,k=.3*M.directionlockdeadzone|0;T.ontouchmove=function(e,o){if(!T.rail.drag)return!0;if(e.targetTouches&&M.preventmultitouchscrolling&&e.targetTouches.length>1)return!0;if(e.pointerType&&("mouse"===e.pointerType||e.pointerType===e.MSPOINTER_TYPE_MOUSE))return!0;if(2==T.rail.drag.pt){"changedTouches"in e&&(e.clientX=e.changedTouches[0].clientX,e.clientY=e.changedTouches[0].clientY);var t,r;if(r=t=0,z&&!o){var i=T.win.position();r=-i.left,t=-i.top}var s=e.clientY+t,n=s-T.rail.drag.y,a=e.clientX+r,c=a-T.rail.drag.x,d=T.rail.drag.st-n;if(T.ishwscroll&&M.bouncescroll)d<0?d=Math.round(d/2):d>T.page.maxh&&(d=T.page.maxh+Math.round((d-T.page.maxh)/2));else if(d<0?(d=0,s=0):d>T.page.maxh&&(d=T.page.maxh,s=0),0===s&&!T.hasmoving)return T.ispage||(T.rail.drag=!1),!0;var u=T.getScrollLeft();if(T.railh&&T.railh.scrollable&&(u=T.isrtlmode?c-T.rail.drag.sl:T.rail.drag.sl-c,T.ishwscroll&&M.bouncescroll?u<0?u=Math.round(u/2):u>T.page.maxw&&(u=T.page.maxw+Math.round((u-T.page.maxw)/2)):(u<0&&(u=0,a=0),u>T.page.maxw&&(u=T.page.maxw,a=0))),!T.hasmoving){if(T.rail.drag.y===e.clientY&&T.rail.drag.x===e.clientX)return T.cancelEvent(e);var h=Math.abs(n),p=Math.abs(c),m=M.directionlockdeadzone;if(T.rail.drag.ck?"v"==T.rail.drag.ck?p>m&&h<=k?T.rail.drag=!1:h>m&&(T.rail.drag.dl="v"):"h"==T.rail.drag.ck&&(h>m&&p<=k?T.rail.drag=!1:p>m&&(T.rail.drag.dl="h")):h>m&&p>m?T.rail.drag.dl="f":h>m?T.rail.drag.dl=p>k?"f":"v":p>m&&(T.rail.drag.dl=h>k?"f":"h"),!T.rail.drag.dl)return T.cancelEvent(e);T.triggerScrollStart(e.clientX,e.clientY,0,0,0),T.hasmoving=!0}return T.preventclick&&!T.preventclick.click&&(T.preventclick.click=T.preventclick.tg.onclick||!1,T.preventclick.tg.onclick=T.onpreventclick),T.rail.drag.dl&&("v"==T.rail.drag.dl?u=T.rail.drag.sl:"h"==T.rail.drag.dl&&(d=T.rail.drag.st)),T.synched("touchmove",function(){T.rail.drag&&2==T.rail.drag.pt&&(T.prepareTransition&&T.resetTransition(),T.rail.scrollable&&T.setScrollTop(d),T.scrollmom.update(a,s),T.railh&&T.railh.scrollable?(T.setScrollLeft(u),T.showCursor(d,u)):T.showCursor(d),P.isie10&&l.selection.clear())}),T.cancelEvent(e)}return 1==T.rail.drag.pt?T.onmousemove(e):void 0},T.ontouchstartCursor=function(e,o){if(!T.rail.drag||3==T.rail.drag.pt){if(T.locked)return T.cancelEvent(e);T.cancelScroll(),T.rail.drag={x:e.touches[0].clientX,y:e.touches[0].clientY,sx:T.scroll.x,sy:T.scroll.y,pt:3,hr:!!o};var t=T.getTarget(e);return!T.ispage&&P.hasmousecapture&&t.setCapture(),T.isiframe&&!P.hasmousecapture&&(T.saved.csspointerevents=T.doc.css("pointer-events"),T.css(T.doc,{"pointer-events":"none"})),T.cancelEvent(e)}},T.ontouchendCursor=function(e){if(T.rail.drag){if(P.hasmousecapture&&l.releaseCapture(),T.isiframe&&!P.hasmousecapture&&T.doc.css("pointer-events",T.saved.csspointerevents),3!=T.rail.drag.pt)return;return T.rail.drag=!1,T.cancelEvent(e)}},T.ontouchmoveCursor=function(e){if(T.rail.drag){if(3!=T.rail.drag.pt)return;if(T.cursorfreezed=!0,T.rail.drag.hr){T.scroll.x=T.rail.drag.sx+(e.touches[0].clientX-T.rail.drag.x),T.scroll.x<0&&(T.scroll.x=0);var o=T.scrollvaluemaxw;T.scroll.x>o&&(T.scroll.x=o)}else{T.scroll.y=T.rail.drag.sy+(e.touches[0].clientY-T.rail.drag.y),T.scroll.y<0&&(T.scroll.y=0);var t=T.scrollvaluemax;T.scroll.y>t&&(T.scroll.y=t)}return T.synched("touchmove",function(){T.rail.drag&&3==T.rail.drag.pt&&(T.showCursor(),T.rail.drag.hr?T.doScrollLeft(Math.round(T.scroll.x*T.scrollratio.x),M.cursordragspeed):T.doScrollTop(Math.round(T.scroll.y*T.scrollratio.y),M.cursordragspeed))}),T.cancelEvent(e)}}}if(T.onmousedown=function(e,o){if(!T.rail.drag||1==T.rail.drag.pt){if(T.railslocked)return T.cancelEvent(e);T.cancelScroll(),T.rail.drag={x:e.clientX,y:e.clientY,sx:T.scroll.x,sy:T.scroll.y,pt:1,hr:o||!1};var t=T.getTarget(e);return P.hasmousecapture&&t.setCapture(),T.isiframe&&!P.hasmousecapture&&(T.saved.csspointerevents=T.doc.css("pointer-events"),T.css(T.doc,{"pointer-events":"none"})),T.hasmoving=!1,T.cancelEvent(e)}},T.onmouseup=function(e){if(T.rail.drag)return 1!=T.rail.drag.pt||(P.hasmousecapture&&l.releaseCapture(),T.isiframe&&!P.hasmousecapture&&T.doc.css("pointer-events",T.saved.csspointerevents),T.rail.drag=!1,T.cursorfreezed=!1,T.hasmoving&&T.triggerScrollEnd(),T.cancelEvent(e))},T.onmousemove=function(e){if(T.rail.drag){if(1!==T.rail.drag.pt)return;if(P.ischrome&&0===e.which)return T.onmouseup(e);if(T.cursorfreezed=!0,T.hasmoving||T.triggerScrollStart(e.clientX,e.clientY,0,0,0),T.hasmoving=!0,T.rail.drag.hr){T.scroll.x=T.rail.drag.sx+(e.clientX-T.rail.drag.x),T.scroll.x<0&&(T.scroll.x=0);var o=T.scrollvaluemaxw;T.scroll.x>o&&(T.scroll.x=o)}else{T.scroll.y=T.rail.drag.sy+(e.clientY-T.rail.drag.y),T.scroll.y<0&&(T.scroll.y=0);var t=T.scrollvaluemax;T.scroll.y>t&&(T.scroll.y=t)}return T.synched("mousemove",function(){T.cursorfreezed&&(T.showCursor(),T.rail.drag.hr?T.scrollLeft(Math.round(T.scroll.x*T.scrollratio.x)):T.scrollTop(Math.round(T.scroll.y*T.scrollratio.y)))}),T.cancelEvent(e)}T.checkarea=0},P.cantouch||M.emulatetouch)T.onpreventclick=function(e){if(T.preventclick)return T.preventclick.tg.onclick=T.preventclick.click,T.preventclick=!1,T.cancelEvent(e)},T.onclick=!P.isios&&function(e){return!T.lastmouseup||(T.lastmouseup=!1,T.cancelEvent(e))},M.grabcursorenabled&&P.cursorgrabvalue&&(T.css(T.ispage?T.doc:T.win,{cursor:P.cursorgrabvalue}),T.css(T.rail,{cursor:P.cursorgrabvalue}));else{var L=function(e){if(T.selectiondrag){if(e){var o=T.win.outerHeight(),t=e.pageY-T.selectiondrag.top;t>0&&t<o&&(t=0),t>=o&&(t-=o),T.selectiondrag.df=t}if(0!==T.selectiondrag.df){var r=-2*T.selectiondrag.df/6|0;T.doScrollBy(r),T.debounced("doselectionscroll",function(){L()},50)}}};T.hasTextSelected="getSelection"in l?function(){return l.getSelection().rangeCount>0}:"selection"in l?function(){return"None"!=l.selection.type}:function(){return!1},T.onselectionstart=function(e){T.ispage||(T.selectiondrag=T.win.offset())},T.onselectionend=function(e){T.selectiondrag=!1},T.onselectiondrag=function(e){T.selectiondrag&&T.hasTextSelected()&&T.debounced("selectionscroll",function(){L(e)},250)}}if(P.hasw3ctouch?(T.css(T.ispage?n("html"):T.win,{"touch-action":"none"}),T.css(T.rail,{"touch-action":"none"}),T.css(T.cursor,{"touch-action":"none"}),T.bind(T.win,"pointerdown",T.ontouchstart),T.bind(l,"pointerup",T.ontouchend),T.delegate(l,"pointermove",T.ontouchmove)):P.hasmstouch?(T.css(T.ispage?n("html"):T.win,{"-ms-touch-action":"none"}),T.css(T.rail,{"-ms-touch-action":"none"}),T.css(T.cursor,{"-ms-touch-action":"none"}),T.bind(T.win,"MSPointerDown",T.ontouchstart),T.bind(l,"MSPointerUp",T.ontouchend),T.delegate(l,"MSPointerMove",T.ontouchmove),T.bind(T.cursor,"MSGestureHold",function(e){e.preventDefault()}),T.bind(T.cursor,"contextmenu",function(e){e.preventDefault()})):P.cantouch&&(T.bind(T.win,"touchstart",T.ontouchstart,!1,!0),T.bind(l,"touchend",T.ontouchend,!1,!0),T.bind(l,"touchcancel",T.ontouchend,!1,!0),T.delegate(l,"touchmove",T.ontouchmove,!1,!0)),M.emulatetouch&&(T.bind(T.win,"mousedown",T.ontouchstart,!1,!0),T.bind(l,"mouseup",T.ontouchend,!1,!0),T.bind(l,"mousemove",T.ontouchmove,!1,!0)),(M.cursordragontouch||!P.cantouch&&!M.emulatetouch)&&(T.rail.css({cursor:"default"}),T.railh&&T.railh.css({cursor:"default"}),T.jqbind(T.rail,"mouseenter",function(){if(!T.ispage&&!T.win.is(":visible"))return!1;T.canshowonmouseevent&&T.showCursor(),T.rail.active=!0}),T.jqbind(T.rail,"mouseleave",function(){T.rail.active=!1,T.rail.drag||T.hideCursor()}),M.sensitiverail&&(T.bind(T.rail,"click",function(e){T.doRailClick(e,!1,!1)}),T.bind(T.rail,"dblclick",function(e){T.doRailClick(e,!0,!1)}),T.bind(T.cursor,"click",function(e){T.cancelEvent(e)}),T.bind(T.cursor,"dblclick",function(e){T.cancelEvent(e)})),T.railh&&(T.jqbind(T.railh,"mouseenter",function(){if(!T.ispage&&!T.win.is(":visible"))return!1;T.canshowonmouseevent&&T.showCursor(),T.rail.active=!0}),T.jqbind(T.railh,"mouseleave",function(){T.rail.active=!1,T.rail.drag||T.hideCursor()}),M.sensitiverail&&(T.bind(T.railh,"click",function(e){T.doRailClick(e,!1,!0)}),T.bind(T.railh,"dblclick",function(e){T.doRailClick(e,!0,!0)}),T.bind(T.cursorh,"click",function(e){T.cancelEvent(e)}),T.bind(T.cursorh,"dblclick",function(e){T.cancelEvent(e)})))),M.cursordragontouch&&(this.istouchcapable||P.cantouch)&&(T.bind(T.cursor,"touchstart",T.ontouchstartCursor),T.bind(T.cursor,"touchmove",T.ontouchmoveCursor),T.bind(T.cursor,"touchend",T.ontouchendCursor),T.cursorh&&T.bind(T.cursorh,"touchstart",function(e){T.ontouchstartCursor(e,!0)}),T.cursorh&&T.bind(T.cursorh,"touchmove",T.ontouchmoveCursor),T.cursorh&&T.bind(T.cursorh,"touchend",T.ontouchendCursor)),M.emulatetouch||P.isandroid||P.isios?(T.bind(P.hasmousecapture?T.win:l,"mouseup",T.ontouchend),T.onclick&&T.bind(l,"click",T.onclick),M.cursordragontouch?(T.bind(T.cursor,"mousedown",T.onmousedown),T.bind(T.cursor,"mouseup",T.onmouseup),T.cursorh&&T.bind(T.cursorh,"mousedown",function(e){T.onmousedown(e,!0)}),T.cursorh&&T.bind(T.cursorh,"mouseup",T.onmouseup)):(T.bind(T.rail,"mousedown",function(e){e.preventDefault()}),T.railh&&T.bind(T.railh,"mousedown",function(e){e.preventDefault()}))):(T.bind(P.hasmousecapture?T.win:l,"mouseup",T.onmouseup),T.bind(l,"mousemove",T.onmousemove),T.onclick&&T.bind(l,"click",T.onclick),T.bind(T.cursor,"mousedown",T.onmousedown),T.bind(T.cursor,"mouseup",T.onmouseup),T.railh&&(T.bind(T.cursorh,"mousedown",function(e){T.onmousedown(e,!0)}),T.bind(T.cursorh,"mouseup",T.onmouseup)),!T.ispage&&M.enablescrollonselection&&(T.bind(T.win[0],"mousedown",T.onselectionstart),T.bind(l,"mouseup",T.onselectionend),T.bind(T.cursor,"mouseup",T.onselectionend),T.cursorh&&T.bind(T.cursorh,"mouseup",T.onselectionend),T.bind(l,"mousemove",T.onselectiondrag)),T.zoom&&(T.jqbind(T.zoom,"mouseenter",function(){T.canshowonmouseevent&&T.showCursor(),T.rail.active=!0}),T.jqbind(T.zoom,"mouseleave",function(){T.rail.active=!1,T.rail.drag||T.hideCursor()}))),M.enablemousewheel&&(T.isiframe||T.mousewheel(P.isie&&T.ispage?l:T.win,T.onmousewheel),T.mousewheel(T.rail,T.onmousewheel),T.railh&&T.mousewheel(T.railh,T.onmousewheelhr)),T.ispage||P.cantouch||/HTML|^BODY/.test(T.win[0].nodeName)||(T.win.attr("tabindex")||T.win.attr({tabindex:++r}),T.bind(T.win,"focus",function(e){o=T.getTarget(e).id||T.getTarget(e)||!1,T.hasfocus=!0,T.canshowonmouseevent&&T.noticeCursor()}),T.bind(T.win,"blur",function(e){o=!1,T.hasfocus=!1}),T.bind(T.win,"mouseenter",function(e){t=T.getTarget(e).id||T.getTarget(e)||!1,T.hasmousefocus=!0,T.canshowonmouseevent&&T.noticeCursor()}),T.bind(T.win,"mouseleave",function(e){t=!1,T.hasmousefocus=!1,T.rail.drag||T.hideCursor()})),T.onkeypress=function(e){if(T.railslocked&&0===T.page.maxh)return!0;e=e||a.event;var r=T.getTarget(e);if(r&&/INPUT|TEXTAREA|SELECT|OPTION/.test(r.nodeName)&&(!(r.getAttribute("type")||r.type||!1)||!/submit|button|cancel/i.tp))return!0;if(n(r).attr("contenteditable"))return!0;if(T.hasfocus||T.hasmousefocus&&!o||T.ispage&&!o&&!t){var i=e.keyCode;if(T.railslocked&&27!=i)return T.cancelEvent(e);var s=e.ctrlKey||!1,l=e.shiftKey||!1,c=!1;switch(i){case 38:case 63233:T.doScrollBy(72),c=!0;break;case 40:case 63235:T.doScrollBy(-72),c=!0;break;case 37:case 63232:T.railh&&(s?T.doScrollLeft(0):T.doScrollLeftBy(72),c=!0);break;case 39:case 63234:T.railh&&(s?T.doScrollLeft(T.page.maxw):T.doScrollLeftBy(-72),c=!0);break;case 33:case 63276:T.doScrollBy(T.view.h),c=!0;break;case 34:case 63277:T.doScrollBy(-T.view.h),c=!0;break;case 36:case 63273:T.railh&&s?T.doScrollPos(0,0):T.doScrollTo(0),c=!0;break;case 35:case 63275:T.railh&&s?T.doScrollPos(T.page.maxw,T.page.maxh):T.doScrollTo(T.page.maxh),c=!0;break;case 32:M.spacebarenabled&&(l?T.doScrollBy(T.view.h):T.doScrollBy(-T.view.h),c=!0);break;case 27:T.zoomactive&&(T.doZoom(),c=!0)}if(c)return T.cancelEvent(e)}},M.enablekeyboard&&T.bind(l,P.isopera&&!P.isopera12?"keypress":"keydown",T.onkeypress),T.bind(l,"keydown",function(e){(e.ctrlKey||!1)&&(T.wheelprevented=!0)}),T.bind(l,"keyup",function(e){e.ctrlKey||!1||(T.wheelprevented=!1)}),T.bind(a,"blur",function(e){T.wheelprevented=!1}),T.bind(a,"resize",T.onscreenresize),T.bind(a,"orientationchange",T.onscreenresize),T.bind(a,"load",T.lazyResize),P.ischrome&&!T.ispage&&!T.haswrapper){var C=T.win.attr("style"),N=parseFloat(T.win.css("width"))+1;T.win.css("width",N),T.synched("chromefix",function(){T.win.attr("style",C)})}if(T.onAttributeChange=function(e){T.lazyResize(T.isieold?250:30)},M.enableobserver&&(T.isie11||!1===m||(T.observerbody=new m(function(e){if(e.forEach(function(e){if("attributes"==e.type)return E.hasClass("modal-open")&&E.hasClass("modal-dialog")&&!n.contains(n(".modal-dialog")[0],T.doc[0])?T.hide():T.show()}),T.me.clientWidth!=T.page.width||T.me.clientHeight!=T.page.height)return T.lazyResize(30)}),T.observerbody.observe(l.body,{childList:!0,subtree:!0,characterData:!1,attributes:!0,attributeFilter:["class"]})),!T.ispage&&!T.haswrapper)){var R=T.win[0];!1!==m?(T.observer=new m(function(e){e.forEach(T.onAttributeChange)}),T.observer.observe(R,{childList:!0,characterData:!1,attributes:!0,subtree:!1}),T.observerremover=new m(function(e){e.forEach(function(e){if(e.removedNodes.length>0)for(var o in e.removedNodes)if(T&&e.removedNodes[o]===R)return T.remove()})}),T.observerremover.observe(R.parentNode,{childList:!0,characterData:!1,attributes:!1,subtree:!1})):(T.bind(R,P.isie&&!P.isie9?"propertychange":"DOMAttrModified",T.onAttributeChange),P.isie9&&R.attachEvent("onpropertychange",T.onAttributeChange),T.bind(R,"DOMNodeRemoved",function(e){e.target===R&&T.remove()}))}!T.ispage&&M.boxzoom&&T.bind(a,"resize",T.resizeZoom),T.istextarea&&(T.bind(T.win,"keydown",T.lazyResize),T.bind(T.win,"mouseup",T.lazyResize)),T.lazyResize(30)}if("IFRAME"==this.doc[0].nodeName){var _=function(){T.iframexd=!1;var o;try{(o="contentDocument"in this?this.contentDocument:this.contentWindow._doc).domain}catch(e){T.iframexd=!0,o=!1}if(T.iframexd)return"console"in a&&console.log("NiceScroll error: policy restriced iframe"),!0;if(T.forcescreen=!0,T.isiframe&&(T.iframe={doc:n(o),html:T.doc.contents().find("html")[0],body:T.doc.contents().find("body")[0]},T.getContentSize=function(){return{w:Math.max(T.iframe.html.scrollWidth,T.iframe.body.scrollWidth),h:Math.max(T.iframe.html.scrollHeight,T.iframe.body.scrollHeight)}},T.docscroll=n(T.iframe.body)),!P.isios&&M.iframeautoresize&&!T.isiframe){T.win.scrollTop(0),T.doc.height("");var t=Math.max(o.getElementsByTagName("html")[0].scrollHeight,o.body.scrollHeight);T.doc.height(t)}T.lazyResize(30),T.css(n(T.iframe.body),e),P.isios&&T.haswrapper&&T.css(n(o.body),{"-webkit-transform":"translate3d(0,0,0)"}),"contentWindow"in this?T.bind(this.contentWindow,"scroll",T.onscroll):T.bind(o,"scroll",T.onscroll),M.enablemousewheel&&T.mousewheel(o,T.onmousewheel),M.enablekeyboard&&T.bind(o,P.isopera?"keypress":"keydown",T.onkeypress),P.cantouch?(T.bind(o,"touchstart",T.ontouchstart),T.bind(o,"touchmove",T.ontouchmove)):M.emulatetouch&&(T.bind(o,"mousedown",T.ontouchstart),T.bind(o,"mousemove",function(e){return T.ontouchmove(e,!0)}),M.grabcursorenabled&&P.cursorgrabvalue&&T.css(n(o.body),{cursor:P.cursorgrabvalue})),T.bind(o,"mouseup",T.ontouchend),T.zoom&&(M.dblclickzoom&&T.bind(o,"dblclick",T.doZoom),T.ongesturezoom&&T.bind(o,"gestureend",T.ongesturezoom))};this.doc[0].readyState&&"complete"===this.doc[0].readyState&&setTimeout(function(){_.call(T.doc[0],!1)},500),T.bind(this.doc,"load",_)}},this.showCursor=function(e,o){if(T.cursortimeout&&(clearTimeout(T.cursortimeout),T.cursortimeout=0),T.rail){if(T.autohidedom&&(T.autohidedom.stop().css({opacity:M.cursoropacitymax}),T.cursoractive=!0),T.rail.drag&&1==T.rail.drag.pt||(void 0!==e&&!1!==e&&(T.scroll.y=e/T.scrollratio.y|0),void 0!==o&&(T.scroll.x=o/T.scrollratio.x|0)),T.cursor.css({height:T.cursorheight,top:T.scroll.y}),T.cursorh){var t=T.hasreversehr?T.scrollvaluemaxw-T.scroll.x:T.scroll.x;T.cursorh.css({width:T.cursorwidth,left:!T.rail.align&&T.rail.visibility?t+T.rail.width:t}),T.cursoractive=!0}T.zoom&&T.zoom.stop().css({opacity:M.cursoropacitymax})}},this.hideCursor=function(e){T.cursortimeout||T.rail&&T.autohidedom&&(T.hasmousefocus&&"leave"===M.autohidemode||(T.cursortimeout=setTimeout(function(){T.rail.active&&T.showonmouseevent||(T.autohidedom.stop().animate({opacity:M.cursoropacitymin}),T.zoom&&T.zoom.stop().animate({opacity:M.cursoropacitymin}),T.cursoractive=!1),T.cursortimeout=0},e||M.hidecursordelay)))},this.noticeCursor=function(e,o,t){T.showCursor(o,t),T.rail.active||T.hideCursor(e)},this.getContentSize=T.ispage?function(){return{w:Math.max(l.body.scrollWidth,l.documentElement.scrollWidth),h:Math.max(l.body.scrollHeight,l.documentElement.scrollHeight)}}:T.haswrapper?function(){return{w:T.doc[0].offsetWidth,h:T.doc[0].offsetHeight}}:function(){return{w:T.docscroll[0].scrollWidth,h:T.docscroll[0].scrollHeight}},this.onResize=function(e,o){if(!T||!T.win)return!1;var t=T.page.maxh,r=T.page.maxw,i=T.view.h,s=T.view.w;if(T.view={w:T.ispage?T.win.width():T.win[0].clientWidth,h:T.ispage?T.win.height():T.win[0].clientHeight},T.page=o||T.getContentSize(),T.page.maxh=Math.max(0,T.page.h-T.view.h),T.page.maxw=Math.max(0,T.page.w-T.view.w),T.page.maxh==t&&T.page.maxw==r&&T.view.w==s&&T.view.h==i){if(T.ispage)return T;var n=T.win.offset();if(T.lastposition){var l=T.lastposition;if(l.top==n.top&&l.left==n.left)return T}T.lastposition=n}return 0===T.page.maxh?(T.hideRail(),T.scrollvaluemax=0,T.scroll.y=0,T.scrollratio.y=0,T.cursorheight=0,T.setScrollTop(0),T.rail&&(T.rail.scrollable=!1)):(T.page.maxh-=M.railpadding.top+M.railpadding.bottom,T.rail.scrollable=!0),0===T.page.maxw?(T.hideRailHr(),T.scrollvaluemaxw=0,T.scroll.x=0,T.scrollratio.x=0,T.cursorwidth=0,T.setScrollLeft(0),T.railh&&(T.railh.scrollable=!1)):(T.page.maxw-=M.railpadding.left+M.railpadding.right,T.railh&&(T.railh.scrollable=M.horizrailenabled)),T.railslocked=T.locked||0===T.page.maxh&&0===T.page.maxw,T.railslocked?(T.ispage||T.updateScrollBar(T.view),!1):(T.hidden||(T.rail.visibility||T.showRail(),T.railh&&!T.railh.visibility&&T.showRailHr()),T.istextarea&&T.win.css("resize")&&"none"!=T.win.css("resize")&&(T.view.h-=20),T.cursorheight=Math.min(T.view.h,Math.round(T.view.h*(T.view.h/T.page.h))),T.cursorheight=M.cursorfixedheight?M.cursorfixedheight:Math.max(M.cursorminheight,T.cursorheight),T.cursorwidth=Math.min(T.view.w,Math.round(T.view.w*(T.view.w/T.page.w))),T.cursorwidth=M.cursorfixedheight?M.cursorfixedheight:Math.max(M.cursorminheight,T.cursorwidth),T.scrollvaluemax=T.view.h-T.cursorheight-(M.railpadding.top+M.railpadding.bottom),T.hasborderbox||(T.scrollvaluemax-=T.cursor[0].offsetHeight-T.cursor[0].clientHeight),T.railh&&(T.railh.width=T.page.maxh>0?T.view.w-T.rail.width:T.view.w,T.scrollvaluemaxw=T.railh.width-T.cursorwidth-(M.railpadding.left+M.railpadding.right)),T.ispage||T.updateScrollBar(T.view),T.scrollratio={x:T.page.maxw/T.scrollvaluemaxw,y:T.page.maxh/T.scrollvaluemax},T.getScrollTop()>T.page.maxh?T.doScrollTop(T.page.maxh):(T.scroll.y=T.getScrollTop()/T.scrollratio.y|0,T.scroll.x=T.getScrollLeft()/T.scrollratio.x|0,T.cursoractive&&T.noticeCursor()),T.scroll.y&&0===T.getScrollTop()&&T.doScrollTo(T.scroll.y*T.scrollratio.y|0),T)},this.resize=T.onResize;var O=0;this.onscreenresize=function(e){clearTimeout(O);var o=!T.ispage&&!T.haswrapper;o&&T.hideRails(),O=setTimeout(function(){T&&(o&&T.showRails(),T.resize()),O=0},120)},this.lazyResize=function(e){return clearTimeout(O),e=isNaN(e)?240:e,O=setTimeout(function(){T&&T.resize(),O=0},e),T},this.jqbind=function(e,o,t){T.events.push({e:e,n:o,f:t,q:!0}),n(e).on(o,t)},this.mousewheel=function(e,o,t){var r="jquery"in e?e[0]:e;if("onwheel"in l.createElement("div"))T._bind(r,"wheel",o,t||!1);else{var i=void 0!==l.onmousewheel?"mousewheel":"DOMMouseScroll";S(r,i,o,t||!1),"DOMMouseScroll"==i&&S(r,"MozMousePixelScroll",o,t||!1)}};var Y=!1;if(P.haseventlistener){try{var H=Object.defineProperty({},"passive",{get:function(){Y=!0}});a.addEventListener("test",null,H)}catch(e){}this.stopPropagation=function(e){return!!e&&((e=e.original?e.original:e).stopPropagation(),!1)},this.cancelEvent=function(e){return e.cancelable&&e.preventDefault(),e.stopImmediatePropagation(),e.preventManipulation&&e.preventManipulation(),!1}}else Event.prototype.preventDefault=function(){this.returnValue=!1},Event.prototype.stopPropagation=function(){this.cancelBubble=!0},a.constructor.prototype.addEventListener=l.constructor.prototype.addEventListener=Element.prototype.addEventListener=function(e,o,t){this.attachEvent("on"+e,o)},a.constructor.prototype.removeEventListener=l.constructor.prototype.removeEventListener=Element.prototype.removeEventListener=function(e,o,t){this.detachEvent("on"+e,o)},this.cancelEvent=function(e){return(e=e||a.event)&&(e.cancelBubble=!0,e.cancel=!0,e.returnValue=!1),!1},this.stopPropagation=function(e){return(e=e||a.event)&&(e.cancelBubble=!0),!1};this.delegate=function(e,o,t,r,i){var s=d[o]||!1;s||(s={a:[],l:[],f:function(e){for(var o=s.l,t=!1,r=o.length-1;r>=0;r--)if(!1===(t=o[r].call(e.target,e)))return!1;return t}},T.bind(e,o,s.f,r,i),d[o]=s),T.ispage?(s.a=[T.id].concat(s.a),s.l=[t].concat(s.l)):(s.a.push(T.id),s.l.push(t))},this.undelegate=function(e,o,t,r,i){var s=d[o]||!1;if(s&&s.l)for(var n=0,l=s.l.length;n<l;n++)s.a[n]===T.id&&(s.a.splice(n),s.l.splice(n),0===s.a.length&&(T._unbind(e,o,s.l.f),d[o]=null))},this.bind=function(e,o,t,r,i){var s="jquery"in e?e[0]:e;T._bind(s,o,t,r||!1,i||!1)},this._bind=function(e,o,t,r,i){T.events.push({e:e,n:o,f:t,b:r,q:!1}),Y&&i?e.addEventListener(o,t,{passive:!1,capture:r}):e.addEventListener(o,t,r||!1)},this._unbind=function(e,o,t,r){d[o]?T.undelegate(e,o,t,r):e.removeEventListener(o,t,r)},this.unbindAll=function(){for(var e=0;e<T.events.length;e++){var o=T.events[e];o.q?o.e.unbind(o.n,o.f):T._unbind(o.e,o.n,o.f,o.b)}},this.showRails=function(){return T.showRail().showRailHr()},this.showRail=function(){return 0===T.page.maxh||!T.ispage&&"none"==T.win.css("display")||(T.rail.visibility=!0,T.rail.css("display","block")),T},this.showRailHr=function(){return T.railh&&(0===T.page.maxw||!T.ispage&&"none"==T.win.css("display")||(T.railh.visibility=!0,T.railh.css("display","block"))),T},this.hideRails=function(){return T.hideRail().hideRailHr()},this.hideRail=function(){return T.rail.visibility=!1,T.rail.css("display","none"),T},this.hideRailHr=function(){return T.railh&&(T.railh.visibility=!1,T.railh.css("display","none")),T},this.show=function(){return T.hidden=!1,T.railslocked=!1,T.showRails()},this.hide=function(){return T.hidden=!0,T.railslocked=!0,T.hideRails()},this.toggle=function(){return T.hidden?T.show():T.hide()},this.remove=function(){T.stop(),T.cursortimeout&&clearTimeout(T.cursortimeout);for(var e in T.delaylist)T.delaylist[e]&&h(T.delaylist[e].h);T.doZoomOut(),T.unbindAll(),P.isie9&&T.win[0].detachEvent("onpropertychange",T.onAttributeChange),!1!==T.observer&&T.observer.disconnect(),!1!==T.observerremover&&T.observerremover.disconnect(),!1!==T.observerbody&&T.observerbody.disconnect(),T.events=null,T.cursor&&T.cursor.remove(),T.cursorh&&T.cursorh.remove(),T.rail&&T.rail.remove(),T.railh&&T.railh.remove(),T.zoom&&T.zoom.remove();for(var o=0;o<T.saved.css.length;o++){var t=T.saved.css[o];t[0].css(t[1],void 0===t[2]?"":t[2])}T.saved=!1,T.me.data("__nicescroll","");var r=n.nicescroll;r.each(function(e){if(this&&this.id===T.id){delete r[e];for(var o=++e;o<r.length;o++,e++)r[e]=r[o];--r.length&&delete r[r.length]}});for(var i in T)T[i]=null,delete T[i];T=null},this.scrollstart=function(e){return this.onscrollstart=e,T},this.scrollend=function(e){return this.onscrollend=e,T},this.scrollcancel=function(e){return this.onscrollcancel=e,T},this.zoomin=function(e){return this.onzoomin=e,T},this.zoomout=function(e){return this.onzoomout=e,T},this.isScrollable=function(e){var o=e.target?e.target:e;if("OPTION"==o.nodeName)return!0;for(;o&&1==o.nodeType&&o!==this.me[0]&&!/^BODY|HTML/.test(o.nodeName);){var t=n(o),r=t.css("overflowY")||t.css("overflowX")||t.css("overflow")||"";if(/scroll|auto/.test(r))return o.clientHeight!=o.scrollHeight;o=!!o.parentNode&&o.parentNode}return!1},this.getViewport=function(e){for(var o=!(!e||!e.parentNode)&&e.parentNode;o&&1==o.nodeType&&!/^BODY|HTML/.test(o.nodeName);){var t=n(o);if(/fixed|absolute/.test(t.css("position")))return t;var r=t.css("overflowY")||t.css("overflowX")||t.css("overflow")||"";if(/scroll|auto/.test(r)&&o.clientHeight!=o.scrollHeight)return t;if(t.getNiceScroll().length>0)return t;o=!!o.parentNode&&o.parentNode}return!1},this.triggerScrollStart=function(e,o,t,r,i){if(T.onscrollstart){var s={type:"scrollstart",current:{x:e,y:o},request:{x:t,y:r},end:{x:T.newscrollx,y:T.newscrolly},speed:i};T.onscrollstart.call(T,s)}},this.triggerScrollEnd=function(){if(T.onscrollend){var e=T.getScrollLeft(),o=T.getScrollTop(),t={type:"scrollend",current:{x:e,y:o},end:{x:e,y:o}};T.onscrollend.call(T,t)}};var B=0,X=0,D=0,A=1,q=!1;if(this.onmousewheel=function(e){if(T.wheelprevented||T.locked)return!1;if(T.railslocked)return T.debounced("checkunlock",T.resize,250),!1;if(T.rail.drag)return T.cancelEvent(e);if("auto"===M.oneaxismousemode&&0!==e.deltaX&&(M.oneaxismousemode=!1),M.oneaxismousemode&&0===e.deltaX&&!T.rail.scrollable)return!T.railh||!T.railh.scrollable||T.onmousewheelhr(e);var o=f(),t=!1;if(M.preservenativescrolling&&T.checkarea+600<o&&(T.nativescrollingarea=T.isScrollable(e),t=!0),T.checkarea=o,T.nativescrollingarea)return!0;var r=k(e,!1,t);return r&&(T.checkarea=0),r},this.onmousewheelhr=function(e){if(!T.wheelprevented){if(T.railslocked||!T.railh.scrollable)return!0;if(T.rail.drag)return T.cancelEvent(e);var o=f(),t=!1;return M.preservenativescrolling&&T.checkarea+600<o&&(T.nativescrollingarea=T.isScrollable(e),t=!0),T.checkarea=o,!!T.nativescrollingarea||(T.railslocked?T.cancelEvent(e):k(e,!0,t))}},this.stop=function(){return T.cancelScroll(),T.scrollmon&&T.scrollmon.stop(),T.cursorfreezed=!1,T.scroll.y=Math.round(T.getScrollTop()*(1/T.scrollratio.y)),T.noticeCursor(),T},this.getTransitionSpeed=function(e){return 80+e/72*M.scrollspeed|0},M.smoothscroll)if(T.ishwscroll&&P.hastransition&&M.usetransition&&M.smoothscroll){var j="";this.resetTransition=function(){j="",T.doc.css(P.prefixstyle+"transition-duration","0ms")},this.prepareTransition=function(e,o){var t=o?e:T.getTransitionSpeed(e),r=t+"ms";return j!==r&&(j=r,T.doc.css(P.prefixstyle+"transition-duration",r)),t},this.doScrollLeft=function(e,o){var t=T.scrollrunning?T.newscrolly:T.getScrollTop();T.doScrollPos(e,t,o)},this.doScrollTop=function(e,o){var t=T.scrollrunning?T.newscrollx:T.getScrollLeft();T.doScrollPos(t,e,o)},this.cursorupdate={running:!1,start:function(){var e=this;if(!e.running){e.running=!0;var o=function(){e.running&&u(o),T.showCursor(T.getScrollTop(),T.getScrollLeft()),T.notifyScrollEvent(T.win[0])};u(o)}},stop:function(){this.running=!1}},this.doScrollPos=function(e,o,t){var r=T.getScrollTop(),i=T.getScrollLeft();if(((T.newscrolly-r)*(o-r)<0||(T.newscrollx-i)*(e-i)<0)&&T.cancelScroll(),M.bouncescroll?(o<0?o=o/2|0:o>T.page.maxh&&(o=T.page.maxh+(o-T.page.maxh)/2|0),e<0?e=e/2|0:e>T.page.maxw&&(e=T.page.maxw+(e-T.page.maxw)/2|0)):(o<0?o=0:o>T.page.maxh&&(o=T.page.maxh),e<0?e=0:e>T.page.maxw&&(e=T.page.maxw)),T.scrollrunning&&e==T.newscrollx&&o==T.newscrolly)return!1;T.newscrolly=o,T.newscrollx=e;var s=T.getScrollTop(),n=T.getScrollLeft(),l={};l.x=e-n,l.y=o-s;var a=0|Math.sqrt(l.x*l.x+l.y*l.y),c=T.prepareTransition(a);T.scrollrunning||(T.scrollrunning=!0,T.triggerScrollStart(n,s,e,o,c),T.cursorupdate.start()),T.scrollendtrapped=!0,P.transitionend||(T.scrollendtrapped&&clearTimeout(T.scrollendtrapped),T.scrollendtrapped=setTimeout(T.onScrollTransitionEnd,c)),T.setScrollTop(T.newscrolly),T.setScrollLeft(T.newscrollx)},this.cancelScroll=function(){if(!T.scrollendtrapped)return!0;var e=T.getScrollTop(),o=T.getScrollLeft();return T.scrollrunning=!1,P.transitionend||clearTimeout(P.transitionend),T.scrollendtrapped=!1,T.resetTransition(),T.setScrollTop(e),T.railh&&T.setScrollLeft(o),T.timerscroll&&T.timerscroll.tm&&clearInterval(T.timerscroll.tm),T.timerscroll=!1,T.cursorfreezed=!1,T.cursorupdate.stop(),T.showCursor(e,o),T},this.onScrollTransitionEnd=function(){if(T.scrollendtrapped){var e=T.getScrollTop(),o=T.getScrollLeft();if(e<0?e=0:e>T.page.maxh&&(e=T.page.maxh),o<0?o=0:o>T.page.maxw&&(o=T.page.maxw),e!=T.newscrolly||o!=T.newscrollx)return T.doScrollPos(o,e,M.snapbackspeed);T.scrollrunning&&T.triggerScrollEnd(),T.scrollrunning=!1,T.scrollendtrapped=!1,T.resetTransition(),T.timerscroll=!1,T.setScrollTop(e),T.railh&&T.setScrollLeft(o),T.cursorupdate.stop(),T.noticeCursor(!1,e,o),T.cursorfreezed=!1}}}else this.doScrollLeft=function(e,o){var t=T.scrollrunning?T.newscrolly:T.getScrollTop();T.doScrollPos(e,t,o)},this.doScrollTop=function(e,o){var t=T.scrollrunning?T.newscrollx:T.getScrollLeft();T.doScrollPos(t,e,o)},this.doScrollPos=function(e,o,t){var r=T.getScrollTop(),i=T.getScrollLeft();((T.newscrolly-r)*(o-r)<0||(T.newscrollx-i)*(e-i)<0)&&T.cancelScroll();var s=!1;if(T.bouncescroll&&T.rail.visibility||(o<0?(o=0,s=!0):o>T.page.maxh&&(o=T.page.maxh,s=!0)),T.bouncescroll&&T.railh.visibility||(e<0?(e=0,s=!0):e>T.page.maxw&&(e=T.page.maxw,s=!0)),T.scrollrunning&&T.newscrolly===o&&T.newscrollx===e)return!0;T.newscrolly=o,T.newscrollx=e,T.dst={},T.dst.x=e-i,T.dst.y=o-r,T.dst.px=i,T.dst.py=r;var n=0|Math.sqrt(T.dst.x*T.dst.x+T.dst.y*T.dst.y),l=T.getTransitionSpeed(n);T.bzscroll={};var a=s?1:.58;T.bzscroll.x=new R(i,T.newscrollx,l,0,0,a,1),T.bzscroll.y=new R(r,T.newscrolly,l,0,0,a,1);f();var c=function(){if(T.scrollrunning){var e=T.bzscroll.y.getPos();T.setScrollLeft(T.bzscroll.x.getNow()),T.setScrollTop(T.bzscroll.y.getNow()),e<=1?T.timer=u(c):(T.scrollrunning=!1,T.timer=0,T.triggerScrollEnd())}};T.scrollrunning||(T.triggerScrollStart(i,r,e,o,l),T.scrollrunning=!0,T.timer=u(c))},this.cancelScroll=function(){return T.timer&&h(T.timer),T.timer=0,T.bzscroll=!1,T.scrollrunning=!1,T};else this.doScrollLeft=function(e,o){var t=T.getScrollTop();T.doScrollPos(e,t,o)},this.doScrollTop=function(e,o){var t=T.getScrollLeft();T.doScrollPos(t,e,o)},this.doScrollPos=function(e,o,t){var r=e>T.page.maxw?T.page.maxw:e;r<0&&(r=0);var i=o>T.page.maxh?T.page.maxh:o;i<0&&(i=0),T.synched("scroll",function(){T.setScrollTop(i),T.setScrollLeft(r)})},this.cancelScroll=function(){};this.doScrollBy=function(e,o){z(0,e)},this.doScrollLeftBy=function(e,o){z(e,0)},this.doScrollTo=function(e,o){var t=o?Math.round(e*T.scrollratio.y):e;t<0?t=0:t>T.page.maxh&&(t=T.page.maxh),T.cursorfreezed=!1,T.doScrollTop(e)},this.checkContentSize=function(){var e=T.getContentSize();e.h==T.page.h&&e.w==T.page.w||T.resize(!1,e)},T.onscroll=function(e){T.rail.drag||T.cursorfreezed||T.synched("scroll",function(){T.scroll.y=Math.round(T.getScrollTop()/T.scrollratio.y),T.railh&&(T.scroll.x=Math.round(T.getScrollLeft()/T.scrollratio.x)),T.noticeCursor()})},T.bind(T.docscroll,"scroll",T.onscroll),this.doZoomIn=function(e){if(!T.zoomactive){T.zoomactive=!0,T.zoomrestore={style:{}};var o=["position","top","left","zIndex","backgroundColor","marginTop","marginBottom","marginLeft","marginRight"],t=T.win[0].style;for(var r in o){var i=o[r];T.zoomrestore.style[i]=void 0!==t[i]?t[i]:""}T.zoomrestore.style.width=T.win.css("width"),T.zoomrestore.style.height=T.win.css("height"),T.zoomrestore.padding={w:T.win.outerWidth()-T.win.width(),h:T.win.outerHeight()-T.win.height()},P.isios4&&(T.zoomrestore.scrollTop=c.scrollTop(),c.scrollTop(0)),T.win.css({position:P.isios4?"absolute":"fixed",top:0,left:0,zIndex:s+100,margin:0});var n=T.win.css("backgroundColor");return(""===n||/transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(n))&&T.win.css("backgroundColor","#fff"),T.rail.css({zIndex:s+101}),T.zoom.css({zIndex:s+102}),T.zoom.css("backgroundPosition","0 -18px"),T.resizeZoom(),T.onzoomin&&T.onzoomin.call(T),T.cancelEvent(e)}},this.doZoomOut=function(e){if(T.zoomactive)return T.zoomactive=!1,T.win.css("margin",""),T.win.css(T.zoomrestore.style),P.isios4&&c.scrollTop(T.zoomrestore.scrollTop),T.rail.css({"z-index":T.zindex}),T.zoom.css({"z-index":T.zindex}),T.zoomrestore=!1,T.zoom.css("backgroundPosition","0 0"),T.onResize(),T.onzoomout&&T.onzoomout.call(T),T.cancelEvent(e)},this.doZoom=function(e){return T.zoomactive?T.doZoomOut(e):T.doZoomIn(e)},this.resizeZoom=function(){if(T.zoomactive){var e=T.getScrollTop();T.win.css({width:c.width()-T.zoomrestore.padding.w+"px",height:c.height()-T.zoomrestore.padding.h+"px"}),T.onResize(),T.setScrollTop(Math.min(T.page.maxh,e))}},this.init(),n.nicescroll.push(this)},y=function(e){var o=this;this.nc=e,this.lastx=0,this.lasty=0,this.speedx=0,this.speedy=0,this.lasttime=0,this.steptime=0,this.snapx=!1,this.snapy=!1,this.demulx=0,this.demuly=0,this.lastscrollx=-1,this.lastscrolly=-1,this.chkx=0,this.chky=0,this.timer=0,this.reset=function(e,t){o.stop(),o.steptime=0,o.lasttime=f(),o.speedx=0,o.speedy=0,o.lastx=e,o.lasty=t,o.lastscrollx=-1,o.lastscrolly=-1},this.update=function(e,t){var r=f();o.steptime=r-o.lasttime,o.lasttime=r;var i=t-o.lasty,s=e-o.lastx,n=o.nc.getScrollTop()+i,l=o.nc.getScrollLeft()+s;o.snapx=l<0||l>o.nc.page.maxw,o.snapy=n<0||n>o.nc.page.maxh,o.speedx=s,o.speedy=i,o.lastx=e,o.lasty=t},this.stop=function(){o.nc.unsynched("domomentum2d"),o.timer&&clearTimeout(o.timer),o.timer=0,o.lastscrollx=-1,o.lastscrolly=-1},this.doSnapy=function(e,t){var r=!1;t<0?(t=0,r=!0):t>o.nc.page.maxh&&(t=o.nc.page.maxh,r=!0),e<0?(e=0,r=!0):e>o.nc.page.maxw&&(e=o.nc.page.maxw,r=!0),r?o.nc.doScrollPos(e,t,o.nc.opt.snapbackspeed):o.nc.triggerScrollEnd()},this.doMomentum=function(e){var t=f(),r=e?t+e:o.lasttime,i=o.nc.getScrollLeft(),s=o.nc.getScrollTop(),n=o.nc.page.maxh,l=o.nc.page.maxw;o.speedx=l>0?Math.min(60,o.speedx):0,o.speedy=n>0?Math.min(60,o.speedy):0;var a=r&&t-r<=60;(s<0||s>n||i<0||i>l)&&(a=!1);var c=!(!o.speedy||!a)&&o.speedy,d=!(!o.speedx||!a)&&o.speedx;if(c||d){var u=Math.max(16,o.steptime);if(u>50){var h=u/50;o.speedx*=h,o.speedy*=h,u=50}o.demulxy=0,o.lastscrollx=o.nc.getScrollLeft(),o.chkx=o.lastscrollx,o.lastscrolly=o.nc.getScrollTop(),o.chky=o.lastscrolly;var p=o.lastscrollx,m=o.lastscrolly,g=function(){var e=f()-t>600?.04:.02;o.speedx&&(p=Math.floor(o.lastscrollx-o.speedx*(1-o.demulxy)),o.lastscrollx=p,(p<0||p>l)&&(e=.1)),o.speedy&&(m=Math.floor(o.lastscrolly-o.speedy*(1-o.demulxy)),o.lastscrolly=m,(m<0||m>n)&&(e=.1)),o.demulxy=Math.min(1,o.demulxy+e),o.nc.synched("domomentum2d",function(){if(o.speedx){o.nc.getScrollLeft();o.chkx=p,o.nc.setScrollLeft(p)}if(o.speedy){o.nc.getScrollTop();o.chky=m,o.nc.setScrollTop(m)}o.timer||(o.nc.hideCursor(),o.doSnapy(p,m))}),o.demulxy<1?o.timer=setTimeout(g,u):(o.stop(),o.nc.hideCursor(),o.doSnapy(p,m))};g()}else o.doSnapy(o.nc.getScrollLeft(),o.nc.getScrollTop())}},x=e.fn.scrollTop;e.cssHooks.pageYOffset={get:function(e,o,t){var r=n.data(e,"__nicescroll")||!1;return r&&r.ishwscroll?r.getScrollTop():x.call(e)},set:function(e,o){var t=n.data(e,"__nicescroll")||!1;return t&&t.ishwscroll?t.setScrollTop(parseInt(o)):x.call(e,o),this}},e.fn.scrollTop=function(e){if(void 0===e){var o=!!this[0]&&(n.data(this[0],"__nicescroll")||!1);return o&&o.ishwscroll?o.getScrollTop():x.call(this)}return this.each(function(){var o=n.data(this,"__nicescroll")||!1;o&&o.ishwscroll?o.setScrollTop(parseInt(e)):x.call(n(this),e)})};var S=e.fn.scrollLeft;n.cssHooks.pageXOffset={get:function(e,o,t){var r=n.data(e,"__nicescroll")||!1;return r&&r.ishwscroll?r.getScrollLeft():S.call(e)},set:function(e,o){var t=n.data(e,"__nicescroll")||!1;return t&&t.ishwscroll?t.setScrollLeft(parseInt(o)):S.call(e,o),this}},e.fn.scrollLeft=function(e){if(void 0===e){var o=!!this[0]&&(n.data(this[0],"__nicescroll")||!1);return o&&o.ishwscroll?o.getScrollLeft():S.call(this)}return this.each(function(){var o=n.data(this,"__nicescroll")||!1;o&&o.ishwscroll?o.setScrollLeft(parseInt(e)):S.call(n(this),e)})};var z=function(e){var o=this;if(this.length=0,this.name="nicescrollarray",this.each=function(e){return n.each(o,e),o},this.push=function(e){o[o.length]=e,o.length++},this.eq=function(e){return o[e]},e)for(var t=0;t<e.length;t++){var r=n.data(e[t],"__nicescroll")||!1;r&&(this[this.length]=r,this.length++)}return this};!function(e,o,t){for(var r=0,i=o.length;r<i;r++)t(e,o[r])}(z.prototype,["show","hide","toggle","onResize","resize","remove","stop","doScrollPos"],function(e,o){e[o]=function(){var e=arguments;return this.each(function(){this[o].apply(this,e)})}}),e.fn.getNiceScroll=function(e){return void 0===e?new z(this):this[e]&&n.data(this[e],"__nicescroll")||!1},(e.expr.pseudos||e.expr[":"]).nicescroll=function(e){return void 0!==n.data(e,"__nicescroll")},n.fn.niceScroll=function(e,o){void 0!==o||"object"!=typeof e||"jquery"in e||(o=e,e=!1);var t=new z;return this.each(function(){var r=n(this),i=n.extend({},o);if(e){var s=n(e);i.doc=s.length>1?n(e,r):s,i.win=r}!("doc"in i)||"win"in i||(i.win=r);var l=r.data("__nicescroll")||!1;l||(i.doc=i.doc||r,l=new b(i,r),r.data("__nicescroll",l)),t.push(l)}),1===t.length?t[0]:t},a.NiceScroll={getjQuery:function(){return e}},n.nicescroll||(n.nicescroll=new z,n.nicescroll.options=g)});