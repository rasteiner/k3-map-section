<template>
  <div class="mapscontainer" ref="container"></div>
</template>

<script>
import MapsLoader from './MapsLoader.js'

export default {
  props: {
    center: Object,
    zoom: {
      type: Number,
      default: 2
    },
    markers: Array,
    config: Object
  },
  data() {
    return {
      map: null,
      mapListeners: [],
      localMarkers: [],
    }
  },
  async mounted() {
    await MapsLoader(this.config.key)

    this.map = new google.maps.Map(this.$refs.container, {
      zoom: this.zoom,
      center: this.center,
    })
    this.mapListeners.push(this.map.addListener('center_changed', this.onCenterChanged))
    this.mapListeners.push(this.map.addListener('zoom_changed', this.onZoomChanged))
    this.renderMarkers(this.markers)
  },
  destroyed() {
    this.mapListeners.forEach(function(listener) {
      listener.remove()
    });
    this.mapListeners = []
  },
  watch: {
    zoom(value) {
      if(this.map) this.map.setZoom(parseFloat(value))
    },
    center(value) {
      if(this.map) this.map.setCenter(value)
    },
    markers:{
      deep: true,
      handler(markers) {
        if(this.map) this.renderMarkers(markers)
      }
    }
  },
  methods: {
    renderMarkers(markers) {
      this.localMarkers.forEach(m => m.gm.setMap(null))

      this.localMarkers = markers.map(m => {
        const gm = new google.maps.Marker({
          position: m.coords,
          map: this.map,
          title: m.title,
          draggable: true,
        })

        gm.addListener('position_changed', this.onMarkersChanged)

        return {
          gm,
          m
        }
      })
    },
    onCenterChanged() {
      this.$emit('update:center', {
        lat: this.map.getCenter().lat(),
        lng: this.map.getCenter().lng(),
      })
    },
    onZoomChanged() {
      this.$emit('update:zoom', this.map.getZoom())
    },
    onMarkersChanged() {
      this.$emit('update:markers', this.localMarkers.map(m => ({
        ...m.m,
        coords: {
          lat: m.gm.getPosition().lat(),
          lng: m.gm.getPosition().lng()
        }
      })))
    }
  }
}
</script>
