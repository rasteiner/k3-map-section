import Coordinator from './Coordinator.js'

import GeocodedField from './GeocodedField.vue'
//import LatLngField from './LatLngField.vue' - not ready
import MapSection from './MapSection.vue'


panel.plugin('rasteiner/kn-map-section', {
  'use': [
    Coordinator
  ],
  'fields': {
    'geocoded': GeocodedField,
    //'latlng': LatLngField
  },
  'sections': {
    'map': MapSection
  }
})
