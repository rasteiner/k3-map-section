let mapSection = null;

const store = {
  $receivers: {},
  registerField(field) {
    if(this.$receivers[field.mapsection] !== undefined) return;

    this.$receivers[field.mapsection] = (value) => {
      field.$emit('input', value);
    }

    this.$receivers[field.mapsection].valueType = field.constructor.options.props.value.type

    field.$watch('value', (value) => {
      this.emitValue(field.mapsection, value)
    })

    this.emitValue(field.mapsection, field.value)

  },
  unregisterField(field) {
    delete this.$receivers[field.mapsection]
  },
  pushValue(field, value) {
    if (this.$receivers[field] && !this.$receivers[field].pushing) {
      this.$receivers[field].pushing = true;
      this.$receivers[field](value);
      setTimeout(() => {
        this.$receivers[field].pushing = false;
      }, 0)
    }
  },
  emitValue(field, value) {
    if(mapSection) {
      if (this.$receivers[field] && !this.$receivers[field].pushing) {
        mapSection.notify(field, value)
      }
    }
  },
  typeof(field) {
    if (this.$receivers[field]) {
      return this.$receivers[field].valueType
    }
  }
}


export default {
  install(Vue, options) {
    Vue.mixin({
      props: {
        mapsection: String,
      },
      created() {
        if (this.isMapSection) {
          this.$mapsection = store
          mapSection = this
        }
      },
      beforeMount() {
        if (this.mapsection && this.value !== undefined) {
          this.mapsection_registered = true
          store.registerField(this)
        }
      },
      beforeDestroy() {
        if(this.mapsection_registered) {
          store.unregisterField(this)
        }
      }
    })
  }
}
