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

//replace fields section

Vue.component('k-fields-section', {
  extends: original,
  created() {
    this.$mapsection.registerFields(this)
  },
  destroyed() {
    this.$mapsection.unregisterFields(this)
  },
  methods: {
    input(values) {
      this.values = values
      original.options.methods.input.call(this, values)
      this.$mapsection.updateMaps(values)
    }
  },
  watch: {
    values(newValues) {
      this.$mapsection.updateMaps(newValues)
    }
  }
})