<template>
  <v-checkbox v-model="tempValue" :color="color" :label="label"></v-checkbox>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempValue: this.value
    }
  },
  watch: {
    value(val) {
      this.tempValue = val
    },
    tempValue(val) {
      this.$emit('input', val)
    }
  }
}
</script>
