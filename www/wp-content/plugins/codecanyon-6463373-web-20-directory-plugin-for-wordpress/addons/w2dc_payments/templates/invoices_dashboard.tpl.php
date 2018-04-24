	<?php if ($frontend_controller->invoices): ?>
		<table class="w2dc-table w2dc-table-striped w2dc-dashboard-invoices">
			<tr>
				<th class="w2dc-td-invoice-title"><?php _e('Invoice', 'W2DC'); ?></th>
				<th class="w2dc-td-invoice-item"><?php _e('Item', 'W2DC'); ?></th>
				<th class="w2dc-td-invoice-price"><?php _e('Price', 'W2DC'); ?></th>
				<th class="w2dc-td-invoice-payment"><?php _e('Payment', 'W2DC'); ?></th>
				<th class="w2dc-td-invoice-date"><?php _e('Creation date', 'W2DC'); ?></th>
			</tr>
		<?php while ($frontend_controller->invoices_query->have_posts()): ?>
			<?php $frontend_controller->invoices_query->the_post(); ?>
			<?php $invoice = $frontend_controller->invoices[get_the_ID()]; ?>
			<tr>
				<td class="w2dc-td-invoice-title">
					<?php
					if (w2dc_current_user_can_edit_listing($invoice->post->ID))
						echo '<a href="' . w2dc_get_edit_invoice_link($invoice->post->ID) . '">' . $invoice->post->post_title . '</a>';
					else
						echo $invoice->post->post_title;
					?>
				</td>
				<td class="w2dc-td-invoice-item"><?php if (is_object($invoice->item_object)) echo $invoice->item_object->getItemLink(); ?></td>
				<td class="w2dc-td-invoice-price"><?php echo $invoice->price(); ?></td>
				<td class="w2dc-td-invoice-payment">
					<?php
					if ($invoice->status == 'unpaid') {
						echo '<span class="w2dc-badge w2dc-invoice-status-unpaid">' . __('unpaid', 'W2DC') . '</span>';
						if (w2dc_current_user_can_edit_listing($invoice->post->ID))
							echo '<br /><a href="' . w2dc_get_edit_invoice_link($invoice->post->ID) . '">' . __('pay invoice', 'W2DC') . '</a>';
					} elseif ($invoice->status == 'paid') {
						echo '<span class="w2dc-badge w2dc-invoice-status-paid">' . __('paid', 'W2DC') . '</span>';
						if ($invoice->gateway)
							echo '<br /><b>' . gatewayName($invoice->gateway) . '</b>';
					} elseif ($invoice->status == 'pending') {
						echo '<span class="w2dc-badge w2dc-invoice-status-pending">' . __('pending', 'W2DC') . '</span>';
						if ($invoice->gateway)
							echo '<br /><b>' . gatewayName($invoice->gateway) . '</b>';
					}
					?>
				</td>
				<td class="w2dc-td-invoice-date"><?php echo date_i18n(get_option('date_format') . ' ' . get_option('time_format'), strtotime($invoice->post->post_date)); ?></td>
			</tr>
		<?php endwhile; ?>
		</table>
		<?php w2dc_renderPaginator($frontend_controller->invoices_query, '', false); ?>
	<?php endif; ?>