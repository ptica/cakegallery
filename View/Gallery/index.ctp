<?php echo $this->Gallery->button('product', 2) ?>

<?php echo $this->Gallery->new_gallery_button(); ?>

<div class="row">
	<div class="col-md-12">
		<h3>Galleries</h3>

		<div class="row">
			<?php foreach ($galleries as $gallery) { ?>
				<a
					href="<?php echo $this->Html->url(array('controller' => 'albums', 'action' => 'upload', 'plugin' => 'gallery', 'gallery_id' => $gallery['Album']['id'])) ?>">
					<div class="col-sm-6 col-md-3">
						<div class="thumbnail">
							<img src="<?php echo $gallery['Picture'][0]['styles']['medium'] ?>" alt="...">

							<div class="caption">
								<h3><?php echo $gallery['Album']['title'] ?></h3>
							</div>
						</div>
					</div>
				</a>
			<?php } ?>
		</div>
	</div>
</div>