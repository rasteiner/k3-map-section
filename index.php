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
	],
    'fields' => [
        'latlng' => [

        ],
        'geocoded' => [
            'props' => [
                'apikey' => function() {
                    return kirby()->option('rasteiner/kn-map-section/apikey');
                },
                'value' => function($value = '') {
                    return Yaml::decode($value);
                }
            ]
        ]
    ]
]);