# Kirby 3 map section plugin
A Kirby 3 plugin to manipulate and store map related information.

## Installation
Download and copy folder to /site/plugins/mapsection

You need a google API browser key with access to the Maps Javascript API and the Geolocation service. 
Then you need to set that in your **config.php** file, like this:
```php
<?php

return [
  //...
  'rasteiner/kn-map-section/apikey' => 'YOUR API KEY HERE',
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
      center: foo

  myfields:
    type: fields
    fields:
      arbitraryname:
        type: text
        label: Map Center
        mapsection: foo
```
This tells the map section that you want to store the center position in the field `arbitraryname`. Notice the keyword `mapsection` in the field, its value must be unique in the blueprint and the same as the value in `storage`. 

The center coordinates need to be stored in a field that accepts text, arrays or objects as values. This means you can store them in text fields, hidden fields or the *geocoded* field (which is included in this plugin).

You can do the same with the zoom level. Storable in text, hidden, range or number fields. 

```yaml
sections:
  mymap:
    type: map
    storage:
      center: foo
      zoom: bar

  myfields:
    type: fields
    fields:
      arbitraryname:
        type: text
        label: Map Center
        mapsection: foo
      myzoomlevel:
        type: range
        min: 0
        max: 22
        step: 1
        mapsection: bar
```

At last you can also store markers in a structure field (or any future field that accepts arrays as values). 
Each structure item needs to have at least a `coords` field. The `geocoded` field is recommended. 
The field name `title` is also recognized as marker title (should work with any type that saves as text).


### Complete blueprint example

```yaml
columns:
  - 1/2: mymap
  - 1/2: myfields

sections:
  mymap:
    type: map
    height: huge
    storage:
      center: foo
      zoom: bar
      markers: qux

  myfields:
    type: fields
    fields:
      arbitraryname:
        type: geocoded
        label: Map Center
        mapsection: foo
      arbitraryzoomname:
        type: range
        label: Zoom
        min: 0
        max: 22
        step: 1
        mapsection: bar
      arbitrarymarkersname:
        type: structure
        label: Markers
        mapsection: qux
        fields:
          coords:
            type: geocoded
            label: Position
          title:
            type: text
            label: Title
          otherfields:
            type: textarea
            label: Description
```

## The geocoded field

The included geocoded field is a textfield that stores coordinates and a query text. It also has the ability to geocode the query text into coordinates (click the magnifying glass). 
