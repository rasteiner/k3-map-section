<?php 

namespace Kirby\Cms;

use \Yaml;


class BlueprintMapSection extends BlueprintSection {
    protected $storage;
    protected $height;

    public function setStorage($value = []) {
        $this->storage = $value;
    }

    public function setHeight($height = 'medium') {
        $this->height = $height;
    }

    public function toArray():array {
        return [
            'config' => kirby()->option('rasteiner.MapSection'),
            'height' => $this->height,
            'storage' => $this->storage
        ];
    }

    public function errors():array {
        return [];
    }
}

\Kirby::plugin('rasteiner/kn-map-section', [
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