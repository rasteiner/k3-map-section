<?php 

Kirby::plugin('rasteiner/kn-map-section', [
	'sections' => [
		'map' => [
			'props' => [
				'storage' => function($storage = []) {
					return $storage;
				},
				'height' => function($height = 'medium') {
					return $height;
				}
			],
			'computed' => [
				'config' => function() {
					return option('rasteiner.MapSection');
				}
			],
		]
	]
]);