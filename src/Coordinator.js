import { getCoordsAs, parseToCoords } from "./CoordSystem.js";


export default function(Vue) {
  Vue.prototype.$mapsection = new Vue({
    data() {
      return {
        fields: [],
        maps: [],
        updatingMaps: false,
        updatingFields: false,
      }
    },
    methods: {
      getAcceptedType(field) {
        let component = Vue.options.components['kirby-' + field.type + '-field']
        if (!component) {
          console.warn('Mapsection could not update form: Unknown field type "' + this.fields[k].type + '"')
          return null
        }

        return component.options.props.value.type
      },
      updateFields(datapoint, fieldname, value) {
        if(this.updatingMaps) return 
        
        this.updatingFields = true

        //update fields
        this.fields.forEach((section) => {
          if(fieldname in section.fields) {            
            let type = this.getAcceptedType(section.fields[fieldname])
            if (!type) {
              return
            }

            switch(datapoint) {
              case 'center':
                section.values[fieldname] = getCoordsAs(value, type)
                break
              case 'markers':
                //is this field structure like?
                let fields = section.fields[fieldname].fields
                if(fields && fields.coords) { //transform coordinates bases on the sub field
                  section.values[fieldname] = value.map((item) => {
                    item = Object.assign({}, item)
                    if (item.coords) {
                      let subtype = this.getAcceptedType(fields.coords)
                      if(!subtype) {                        
                        return
                      }
                      item.coords = getCoordsAs(item.coords, subtype)
                    }
                    return item
                  })

                } else { //if not, just send it raw data ¯\_(ツ)_/¯
                  section.values[fieldname] = value
                }
                break
              default:
                section.values[fieldname] = value
                break            
            }

            section.input(section.values)
          }
        })

        this.$nextTick(() => this.updatingFields = false)
      },
      updateMaps(values) {
        if(this.updatingFields) return 
        
        this.updatingMaps = true
        
        this.maps.forEach((map) => {
          for(let fieldname in values) {
            let value = values[fieldname]
            map.setValue(fieldname, value)
          }
        })

        this.$nextTick(() => this.updatingMaps = false)
      },

      registerMap(map) {
        this.maps.push(map)
      },
      unregisterMap(map) {
        const index = this.fields.indexOf(map);
        if (index !== -1) {
          this.maps.splice(index, 1);
        }
      },
      registerFields(section) {
        this.fields.push(section)
      },
      unregisterFields(section) {
        const index = this.fields.indexOf(section);
        if (index !== -1) {
          this.fields.splice(index, 1);
        }
      }
    }

  })

  //replace fields section
  const original = Vue.options.components["kirby-fields-section"]
  Vue.component('kirby-fields-section', {
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
}