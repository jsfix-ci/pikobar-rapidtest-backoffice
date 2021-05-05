<template>
  <validation-provider
    v-slot="{ errors }"
    :name="name"
    :rules="rules"
    tag="div"
  >
    <component
      :is="componentType"
      v-model="tempValue"
      :error-messages="errors"
      :placeholder="placeholder"
      :type="type"
      :rows="rows"
      :clearable="clearable"
      outlined
      dense
    >
      <template v-slot:label>
        {{ label }}
        <span v-if="isRequired" class="red--text">*</span>
      </template>
      <template v-slot:append-outer>
        <slot name="append-outer" />
      </template>
    </component>
  </validation-provider>
</template>

<script>
import VTextField from 'vuetify/es5/components/VTextField'
import VTextarea from 'vuetify/es5/components/VTextarea'
import VFileInput from 'vuetify/es5/components/VFileInput'

export default {
  components: {
    VTextField,
    VTextarea,
    VFileInput
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [String, File],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    rules: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    rows: {
      type: Number,
      default: 3
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tempValue: this.value
    }
  },
  computed: {
    componentType() {
      let type = VTextField
      if (this.type === 'file') {
        type = VFileInput
      } else if (this.type === 'text-area') {
        type = VTextarea
      }
      return type
    },
    isRequired() {
      return !!this.label && this.rules.split('|').includes('required')
    }
  },
  watch: {
    value(val) {
      this.tempValue = val
    },
    tempValue(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    isNumber(e) {
      if (this.type === 'number') {
        const charCode = e.which ? e.which : e.keyCode
        if (
          charCode > 31 &&
          (charCode < 48 || charCode > 57) &&
          charCode !== 46
        ) {
          e.preventDefault()
        }
      }
      return true
    }
  }
}
</script>
