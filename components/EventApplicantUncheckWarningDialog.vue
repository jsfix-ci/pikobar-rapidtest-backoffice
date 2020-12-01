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
          <div class="text-left">
            Data yang Anda pilih belum melakukan checkin dan belum memiliki Kode
            Sampel
          </div>
        </v-card-text>
        <v-card-actions class="pb-6 justify-center">
          <v-btn color="primary" class="mr-2 px-2" @click="close">
            Mengerti
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
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
