<template>
  <validation-provider v-slot="{ errors }" :name="name" :rules="rules">
    <v-autocomplete
      v-model="tempValue"
      :error-messages="errors"
      :placeholder="placeholder"
      :items="list"
      :item-text="itemText"
      :item-value="itemValue"
      outlined
      dense
    >
      <template v-slot:label>
        {{ label }}
        <span v-if="isRequired" class="red--text">*</span>
      </template>
    </v-autocomplete>
  </validation-provider>
</template>

<script>
import { isObject } from 'lodash'

export default {
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
      type: [String, Number],
      default: null
    },
    itemText: {
      type: String,
      default: 'text'
    },
    itemValue: {
      type: String,
      default: 'value'
    },
    placeholder: {
      type: String,
      default: ''
    },
    rules: {
      type: String,
      default: ''
    },
    allowNull: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => []
    },
    hideDetails: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempValue: this.value
    }
  },
  computed: {
    isRequired() {
      return !!this.label && this.rules.split('|').includes('required')
    },
    list() {
      if (this.placeholder) {
        const firstItem = {}
        firstItem[this.itemValue] = null
        firstItem[this.itemText] = this.placeholder
        firstItem.disabled = !this.allowNull
        return [firstItem, ...this.items]
      }
      return [...this.items]
    }
  },
  watch: {
    value(val) {
      this.tempValue = val
    },
    tempValue(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  },
  mounted() {
    this.checkItemChild()
  },
  methods: {
    checkItemChild() {
      if (!isObject(this.list[0])) {
        this.list = this.list.map((value, i) => ({ text: value, value }))
      }
    }
  }
}
</script>
