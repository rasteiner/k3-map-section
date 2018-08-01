<template>
  <map-component 
    v-if="config"
    :center="center"
    :zoom="zoom"
    :markers="markers"

    @update:center="updateCenter"
    @update:zoom="updateZoom"
    @update:markers="updateMarkers"

    :config="config"
    :style="{height: remheight}" />
</template>

<script>

import { parseToCoords } from "./CoordSystem.js";
import googleMapComponent from './providers/google/GoogleMap.vue'

export default {
  components: {
    mapComponent: window.MapSectionComponent || googleMapComponent
  },
  props: {
    parent: String,
    name: String,
    error: String,
  },
  data() {
    return {
      config: null,
      storage: {},
      height: 'medium',
      center: {
        lat: 8,
        lng: 32
      },
      zoom: undefined,
      markers: [],
    }
  },
  created() {
    this.$api
      .get(this.parent + "/sections/" + this.name)
      .then(response => {
        this.config = response.config
        this.height = response.height
        this.storage = response.storage
      })
    this.$mapsection.registerMap(this)
  },
  destroyed() {
    this.$mapsection.unregisterMap(this)
  },
  computed: {
    remheight() {
      switch(this.height) {
        case 'small': return '16rem'
        case 'medium': return '24rem'
        case 'large': return '32rem'
        case 'huge': return '40rem'
        default: return this.height
      }
    }
  },

  methods: {
    setValue(fieldname, value) {
      if(Array.isArray(value) && value.length == 0  || !value) return

      try {
        for (let datapoint in this.storage) {
          if (this.storage[datapoint] === fieldname) {
            switch(datapoint) {
              case 'center':
                this.center = parseToCoords(value)
                break
              case 'zoom': 
                let newZoom = parseFloat(value)
                if(isNaN(newZoom)) {
                  console.warn('could not adapt field to zoom datapoint, not a number: ', value)
                } else {
                  this.zoom = newZoom
                }
                
                break
              case 'markers':
                if(!Array.isArray(value)) {
                  console.warn('could not adapt field to markers datapoint, not an array: ', value)
                  break
                }
                this.markers = value.map(m => ({
                  ...m,
                  coords: parseToCoords(m.coords)
                }))
                break
              default:
                this[datapoint] = value
                break
            }
          }
        }
      } catch (e) {
        console.warn(e)
      }
      
    },
    updateCenter(center) {
      if(this.storage.center) {
        this.$mapsection.updateFields('center', this.storage.center, center)
      }
    },
    updateZoom(zoom) {
      if(this.storage.zoom) {
        this.$mapsection.updateFields('zoom', this.storage.zoom, zoom)
      }
    },
    updateMarkers(markers) {
      if(this.storage.markers) {
        this.$mapsection.updateFields('markers', this.storage.markers, markers)
      }
    },
  }
}
</script>