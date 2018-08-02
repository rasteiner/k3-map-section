import Coordinator from './Coordinator.js'
import MapSection from './MapSection.vue'


panel.plugin('rasteiner/kn-map-section', {
  use: [
    Coordinator
  ],
  sections: {
    map: MapSection
  }
})
