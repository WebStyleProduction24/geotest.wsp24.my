		<div class="w2dc-content w2dc-favourites-page">
			<?php w2dc_renderMessages(); ?>

			<?php $frontpanel_buttons = new w2dc_frontpanel_buttons(); ?>
			<?php $frontpanel_buttons->display(); ?>
			
			<?php if ($frontend_controller->getPageTitle()): ?>
			<header class="w2dc-page-header">
				<?php if (!get_option('w2dc_overwrite_page_title')): ?>
				<h2>
					<?php echo $frontend_controller->getPageTitle(); ?>
				</h2>
				<?php endif; ?>

				<?php if ($frontend_controller->breadcrumbs): ?>
				<ol class="w2dc-breadcrumbs">
					<?php echo $frontend_controller->getBreadCrumbs(); ?>
				</ol>
				<?php endif; ?>
			</header>
			<?php endif; ?>

			<?php w2dc_renderTemplate('frontend/listings_block.tpl.php', array('frontend_controller' => $frontend_controller)); ?>
		</div>