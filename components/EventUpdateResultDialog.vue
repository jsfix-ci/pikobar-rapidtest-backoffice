<template>
  <div>
    <v-dialog :value="open" max-width="528">
      <v-card class="text-center">
        <v-card-title>
          <span class="col pl-10">Perhatian!</span>
        </v-card-title>
        <v-card-text>
          <div>
            Apakah Anda akan mengubah hasil test peserta bernama
            <strong>
              {{ record ? record.applicant.name : '-' }}
            </strong>
            <span>
              Menjadi
            </span>
            <strong>
              {{ payload ? checkResultLabel(payload).toUpperCase() : payload }}
            </strong>
            <span>
              ?
            </span>
          </div>
        </v-card-text>
        <v-card-actions class="pb-6 justify-center">
          <v-btn
            color="grey darken-1"
            outlined
            class="mr-2 px-2"
            @click="close"
          >
            Tidak
          </v-btn>
          <v-btn
            color="error"
            class="ml-2 px-2"
            @click="setTestResult(record.id, payload)"
          >
            Ya
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { TEST_RESULT_OPTIONS } from '@/utilities/constant'
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    record: {
      type: Object,
      default: null
    },
    payload: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      testResultOptions: TEST_RESULT_OPTIONS
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    setTestResult(id, payload) {
      const data = {}
      data.id = id
      data.payload = payload
      this.$emit('update', data)
    },
    checkResultLabel(payload) {
      let testResultLabel = null
      const testResultFilter = this.testResultOptions.filter(
        (item) => item.value === payload
      )
      testResultFilter.forEach((element) => {
        testResultLabel = element.label
      })
      return testResultLabel
    }
  }
}
</script>
