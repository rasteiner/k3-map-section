# Kirby 3 map section plugin
A Kirby 3 plugin to manipulate and store map related information.

## Installation
Download and copy folder to /site/plugins/mapsection

You need a google API browser key with access to the Maps Javascript API. 
Then you need to set that in your **config.php** file, like this:
```php
<?php

return [
  //...
  'rasteiner.MapSection' => [
    'key' => 'YOUR API KEY HERE',
  ],
  //...
];
``` 

## Quickstart (TL;DR)
After installing the plugin, scroll down to the ["Complete blueprint example"](#complete-blueprint-example) to see an example. 

## Usage
The section itself only shows a map. It does not store any data. 

### Creating the section

```yaml
sections:
  mymap:
    type: map
    height: medium # | small | medium | large | huge
```

### Saving data
The data for the map can optionally be stored in other fields that are on the same page. This allows for a greater flexibility in your blueprint setup (you choose what data you need to save).

To enable this you need to link the map section to fields, this can be done with the `storage` option:

```yaml
sections:
  mymap:
    type: map
    storage:
      center: arbitraryname

  myfields:
    type: fields
    fields:
      arbitraryname:
        type: text
        label: Map Center
```
This tells the map section that you want to store the center position in the field `arbitraryname`

The center coordinates need to be stored in a field that accepts text, arrays or objects as values. This means you can store them in text fields, hidden fields or future compatible fields that store the coordinates as objects.

You can do the same with the zoom level. Storable in text, hidden, range or number fields. 

```yaml
sections:
  mymap:
    type: map
    storage:
      zoom: myzoomlevel

  myfields:
    type: fields
    fields:
      myzoomlevel:
        type: range
        min: 0
        max: 22
        step: 1
```

At last you can also store markers in a structure field (or any future field that accepts arrays as values). 
Each structure item needs to have at least a `coords` field. 
The field name `title` is also recognized as marker title (should work with any type that saves as text).

```yaml
sections:
  mymap:
    type: map
    storage:
      markers: arbitrarymarkersname

  myfields:
    type: fields
    fields:
      arbitrarymarkersname:
        type: structure
        label: Markers
        mapsection: qux
        fields:
          coords:
            type: text
            label: Position
          title:
            type: text
            label: Title
          otherfields:
            type: textarea
            label: Description
```

### Complete blueprint example

```yaml
columns:
  - width: 1/2
    sections:
      mymap:
        type: map
        height: huge
        storage:
          center: arbitraryname
          zoom: arbitraryzoomname
          markers: arbitrarymarkersname

  - width: 1/2
    sections:
      myfields:
        type: fields
        fields:
          arbitraryname:
            type: text
            label: Map Center
          arbitraryzoomname:
            type: text
            label: Zoom
            min: 0
            max: 22
            step: 1
          arbitrarymarkersname:
            type: structure
            label: Markers
            fields:
              coords:
                type: text
                label: Position
              title:
                type: text
                label: Title
              otherfields:
                type: textarea
                label: Description
```

## Other Map Providers

It's technically possible to register other map providers (like OpenStreetMap, Azure Maps, etc...) in plugins.
Compatible plugins will be listed here. 
