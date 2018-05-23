<script>
import MapsLoader from './MapsLoader.js'

const loadApi = MapsLoader()

function geocode(address) {
  const coder = new google.maps.Geocoder()

  return new Promise((resolve, reject) => {
    coder.geocode({address}, (results, status) => {
      if(status === 'OK') {
        resolve({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        })
      } else {
        reject(status)
      }
    })
  })
}

export default {

  template: true,
  props: {
    value: Object,
    label: String,
    apikey: String,
    visible: {
      type: Boolean,
      default: true,
    }
  },
  async created() {
    await loadApi(this.apikey)
    this.ready = true
  },
  watch: {
    value(value) {
      this.lat = parseFloat(value.lat)
      this.lng = parseFloat(value.lng)
      this.query = value.query
    },
  },
  data() {
    const data = {
      ready: false,
    };
    if(this.value) {
      data.lat = this.value.lat || 25
      data.lng = this.value.lng || 25
      data.query = this.value.query || ''
    } else {
      data.lat = 25
      data.lng = 25
      data.query = ''
    }
    return data
  },
  computed: {
    coordinates: function() {
      return `${this.lat}:${this.lng}`
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    emit() {
      this.$emit('input', {
        lat: this.lat,
        lng: this.lng,
        query: this.query
      })
    },
    async search() {
      this.ready = false
      try {
        const coords = await geocode(this.query);
        this.lat = coords.lat
        this.lng = coords.lng
        this.emit()
      } catch(e) {
        console.info('Geocode failed:', e)
      }      
      this.ready = true
    },
  },

}
</script>

<template>
  <kirby-field :label="label" :help="coordinates">
    <kirby-input 
      :id="_uid"
      ref="input"
      v-model="query"
      type="text"
      theme="field"
      placeholder="Search">

      <template slot="icon">
        <kirby-button :disabled="!ready" icon="search" class="kirby-input-icon-button" @click="search" />
      </template>
    </kirby-input>

  </kirby-field>
</template>

<style lang="stylus" scoped>

</style>