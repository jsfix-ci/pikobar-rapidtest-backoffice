<template>
  <v-menu
    ref="datePicker"
    v-model="showCalendar"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
    allow-overflow
    absolute
  >
    <template v-slot:activator="{ on, attrs }">
      <validation-provider v-slot="{ errors }" :name="name" :rules="rules">
        <v-text-field
          v-model.lazy="tempValueFormated"
          :placeholder="placeholder"
          :error-messages="errors"
          persistent-hint
          clearable
          outlined
          dense
          v-bind="attrs"
          v-on="{ ...on, blur: doBlur }"
        >
          <template v-slot:label>
            {{ label }}
            <span v-if="isRequired" class="red--text">*</span>
          </template></v-text-field
        >
      </validation-provider>
    </template>
    <v-date-picker :min="minDate" no-title @input="doCalendarClick" />
  </v-menu>
</template>

<script>
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
    placeholder: {
      type: String,
      default: ''
    },
    rules: {
      type: String,
      default: ''
    },
    minDate: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      showCalendar: false,
      tempValue: this.value,
      tempValueFormated: this.formatDate(this.value)
    }
  },
  computed: {
    isRequired() {
      return !!this.label && this.rules.split('|').includes('required')
    }
  },
  watch: {
    value(val) {
      this.tempValue = val
    },
    tempValue(val) {
      this.tempValueFormated = this.formatDate(val)
      this.$emit('input', val)
      this.$emit('change', val)
    }
  },
  methods: {
    doBlur() {
      this.tempValue = this.parseDate(this.tempValueFormated)
    },
    doCalendarClick(val) {
      this.tempValue = this.$dateFns.format(val, "yyyy-MM-dd'T'HH:mm:ssxxx")
      this.showCalendar = false
    },
    formatDate(date) {
      if (!date) return null
      return this.$dateFns.format(new Date(date), 'dd-MM-yyyy')
    },
    parseDate(date) {
      if (!date) return null
      const [tgl, bln, thn] = date.split('-')
      return this.$dateFns.format(
        new Date(thn, bln - 1, tgl),
        "yyyy-MM-dd'T'HH:mm:ssxxx"
      )
    }
  }
}
</script>
