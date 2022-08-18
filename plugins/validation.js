import Vue from 'vue'
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  setInteractionMode
} from 'vee-validate'
import { required, email, max } from 'vee-validate/dist/rules'
import { messages } from 'vee-validate/dist/locale/id.json'

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

setInteractionMode('eager')

extend('required', {
  ...required,
  message: messages.required
})

extend('email', {
  ...email,
  message: messages.email
})

extend('phone_number', {
  validate: (value) => {
    return value.match(/^0{1}8{1}[0-9]{9,11}$/g)
  },
  message: 'Format Nomor Telepon tidak benar'
})

extend('time_range', {
  validate: (value) => {
    return /^[0-2]\d:[0-5]\d-[0-2]\d:[0-5]\d$/.test(value)
  },
  message: 'Format Jam tidak benar'
})

extend('nik', {
  validate: (value) => {
    const allowedPrefix = [
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '21',
      '31',
      '32',
      '33',
      '34',
      '35',
      '36',
      '51',
      '52',
      '53',
      '61',
      '62',
      '63',
      '64',
      '65',
      '71',
      '72',
      '73',
      '74',
      '75',
      '76',
      '81',
      '82',
      '91',
      '92'
    ]

    const prefix = value.substring(0, 2)

    return (
      allowedPrefix.includes(prefix) &&
      value.match(/^[1-9]{1}[0-9]{11}(?!0{4})[0-9]{4}$/g)
    )
  },
  message: 'Format NIK tidak benar'
})

extend('passport', {
  validate: (value) => {
    return value.match(/^[A-Z0-9]{7,9}$/)
  },
  message: 'Format Passport tidak benar'
})

extend('max', {
  ...max,
  message: (_, values) => `${values._field_} maksimal ${values.length} karakter`
})
