<?php if ($content_field->value): ?>
<div class="w2dc-field w2dc-field-output-block w2dc-field-output-block-<?php echo $content_field->type; ?> w2dc-field-output-block-<?php echo $content_field->id; ?>">
	<?php if ($content_field->icon_image || !$content_field->is_hide_name): ?>
	<span class="w2dc-field-caption <?php if ($content_field->is_phone): ?>w2dc-field-phone-caption<?php endif; ?>">
		<?php if ($content_field->icon_image): ?>
		<span class="w2dc-field-icon w2dc-fa w2dc-fa-lg <?php echo $content_field->icon_image; ?>"></span>
		<?php endif; ?>
		<?php if (!$content_field->is_hide_name): ?>
		<span class="w2dc-field-name"><?php echo $content_field->name?>:</span>
		<?php endif; ?>
	</span>
	<?php endif; ?>
	<span class="w2dc-field-content <?php if ($content_field->is_phone): ?>w2dc-field-phone-content<?php endif; ?>">
		<?php if ($content_field->is_phone): ?>
		<meta itemprop="telephone" content="<?php echo $content_field->value; ?>" />
		<a href="tel:<?php echo $content_field->value; ?>"><?php echo antispambot($content_field->value); ?></a>
		<?php else: ?>
		<?php echo $content_field->value; ?>
		<?php endif; ?>
	</span>
</div>
<?php endif; ?>