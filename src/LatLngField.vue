<template>
  <kirby-field :label="label" v-if="visible">
    lat: {{lat}}, lng: {{lng}}
  </kirby-field>
</template>

<script>
export default {
  template: true,
  props: {
    value: Array,
    label: String,
    visible: {
      type: Boolean,
      default: true,
    }
  },
  watch: {
    value(value) {
      this.lat = parseFloat(value[0])
      this.lng = parseFloat(value[1])
    },
  },
  data() {
    return {
      lat: 0,
      lng: 0,
    }
  },

}
</script>

<style lang="stylus" scoped>

</style>



