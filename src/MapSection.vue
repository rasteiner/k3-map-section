<script>
  import {getCoordsAs, parseToCoords} from './CoordSystem.js'
  import MapsLoader from './MapsLoader.js'

  const loadApi = MapsLoader()
  window.lol = 0

  export default {
    props: {
      parent: String,
      name: String,
      error: String,
    },
    
    async mounted() {
      
      //const data = await this.$api.section(this.parent, this.name)
      const data = await this.$api.get(`${this.parent}/${this.name}`);

      if(data.error) {
        this.error = data.error
      } else {
        this.storage.index = {};
        for(let key in data.storage) {
          this.storage[key] = data.storage[key];
          this.storage.index[data.storage[key]] = key
        }
        this.height = data.height
        await loadApi(data.apikey)
        
        this.map = new google.maps.Map(this.$refs.mapcontainer, {
          zoom: this.zoom || 2,
          center: this.center,
        })
        if(this.storage.markers) {
          this.renderMarkers()
        }
        if(this.storage.center) {
          this.map.addListener('dragend', () => {
            this.center = {
              lat: parseFloat(this.map.getCenter().lat()),
              lng: parseFloat(this.map.getCenter().lng()),
            }
            this.sendCenter()
          })
        }

        if(this.storage.zoom) {
          this.map.addListener('zoom_changed', () => {
            if(this.map.ignoreZoom) return

            this.map.ignoreZoom = true
            this.zoom = parseInt(this.map.getZoom())
            this.center = {
              lat: parseFloat(this.map.getCenter().lat()),
              lng: parseFloat(this.map.getCenter().lng()),
            }
            this.sendCenter()
            this.sendZoom()

            setTimeout(() => {
              this.map.ignoreZoom = false
            }, 0);
          })
        }
      }

    },

    methods: {
      sendCenter() {
        let targetType = this.$mapsection.typeof(this.storage.center)
        if(Array.isArray(targetType)) {
          targetType = targetType[0]
        }
        this.$mapsection.pushValue(this.storage.center, getCoordsAs(this.center, targetType));
      },
      sendZoom() {
        const targetType = this.$mapsection.typeof(this.storage.zoom)
        if(targetType === String 
          || targetType === Number 
          || Array.isArray(targetType) && (targetType.includes(String) || targetType.includes(Number))
        ) {
          this.$mapsection.pushValue(this.storage.zoom, this.zoom);
        } else {
          throw `Could not end zoom level to target "${this.storage.zoom}" beacause unsupported type (${targetType})`
        }
      },
      sendMarkers() {
        this.$mapsection.pushValue(this.storage.markers, this.markers);
      },
      removeMarkers() {
        if(this.map && this.map.allMarkers) {
          while(this.map.allMarkers.length) {
            this.map.allMarkers[0].setMap(null)
            this.map.allMarkers.splice(0,1)
          }
        }
      },
      renderMarkers() {
        this.removeMarkers()
        if(this.map && this.markers && this.markers.length) {
          this.map.allMarkers = [];
          this.markers.forEach((m) => {
            if(m.coords) {
              const gm = new google.maps.Marker({
                map: this.map,
                position: parseToCoords(m.coords),
                title: m.title,
                draggable: true,
              })
              gm.addListener('dragend', () => {
                m.coords.lat = gm.getPosition().lat()
                m.coords.lng = gm.getPosition().lng()
                this.sendMarkers()
              })
              this.map.allMarkers.push(gm);
            }
          })

        }
      },
      notify(field, value) {
        const target = this.storage.index[field];
        try {
          switch(target) {
            case 'center':
              this.center = parseToCoords(value)
              if(this.map) {
                this.map.setCenter(this.center)
              }
            break;
        
            case 'zoom':
              this.zoom = parseInt(value)
              if(this.map) {
                this.map.setZoom(this.zoom || 2)
              }
            break;

            case 'markers':
              if(Array.isArray(value)) {
                this.markers = value;
                this.renderMarkers()
              } else {
                console.warn('Unacceptable value for markers')
              }
            break;
          }
        } catch(e) {
          console.error(e)
        }
        
      }
    },
    computed: {
      classes: function() {
        return {
          'small': this.height === 'small',
          'medium': this.height === 'medium',
          'large': this.height === 'large',
          'huge': this.height === 'huge',
          'mapsection-container': true
        }
      }
    },
    data() {
      return {
        storage: {
          index: {}
        },
        links: {},
        isMapSection: true,
        center: {
          lat: 25,
          lng: 25
        },
        zoom: 2,
        map: null,
        height: 'medium'
      }
    }
  }
</script>

<template>
  <div>
    <div ref="mapcontainer" :class="classes"></div>
  </div>
</template>

<style lang="stylus" scoped>
  .mapsection-container 
    &.small 
      height: 16rem
    &.medium 
      height: 24rem
    &.large
      height: 32rem
    &.huge
      height: 40rem
    
</style>
