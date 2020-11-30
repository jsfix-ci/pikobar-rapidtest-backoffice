<template>
  <div>
    <v-dialog :value="open" max-width="528">
      <v-card class="text-center">
        <v-card-title class="text-left">
          <v-icon style="color: #b71b1c; font-size: 2rem;">mdi-alert</v-icon>
          <span class="col" style="color: #b71b1c;">Perhatian</span>
          <v-btn icon @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div>
            <v-checkbox
              v-model="isChecklist"
              label="Saya yakin untuk melakukan reset data Checkin dan Kode Sampel pada peserta ini."
              color="primary"
              hide-details
            ></v-checkbox>
          </div>
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
            class="mr-2 px-2"
            :disabled="!isChecklist"
            @click="save"
          >
            Simpan
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    record: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isChecklist: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    save() {
      this.$emit('save', this.record)
      this.isChecklist = false
    }
  }
}
</script>
