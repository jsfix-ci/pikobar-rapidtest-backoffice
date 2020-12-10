<template>
  <div>
    <v-dialog :value="open" max-width="528">
      <validation-observer
        v-slot="{ valid, handleSubmit }"
        ref="observerImport"
        tag="div"
      >
        <form ref="importForm" @submit.prevent="handleSubmit(doImport)">
          <v-card class="text-center">
            <v-card-title>
              <span class="col">Import Hasil Test</span>
            </v-card-title>
            <v-card-text class="pb-0">
              <div>
                Untuk Import data hasil test, anda harus memakai format Excel
                (.xls).
              </div>
              <pkbr-input
                v-model="importFile"
                label="Import Hasil Test"
                type="file"
                class="mt-4"
                name="file"
                rules="required"
              />
            </v-card-text>
            <v-card-actions class="pb-6 justify-center">
              <v-btn
                color="grey darken-1"
                outlined
                class="mr-2 px-2"
                @click="close"
              >
                Batal
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!valid"
                class="ml-2 px-2"
                type="submit"
              >
                Upload
              </v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </validation-observer>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      importFile: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    doImport() {
      this.$emit('doImport', this.importFile)
    }
  }
}
</script>
