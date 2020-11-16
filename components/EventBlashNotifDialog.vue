<template>
  <div>
    <v-dialog :value="open" max-width="528">
      <v-card class="text-center">
        <v-card-title>
          <span class="col pl-10">Kirim {{ modalType }}</span>
          <v-btn icon @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div>
            Apakah anda akan mengirimkan notifikasi {{ modalType }} kepada
          </div>
          <div v-if="items.length > 0">
            <strong>{{ items.length }} Peserta Terpilih?</strong>
          </div>
          <div v-else><strong>Semua Peserta?</strong></div>
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
            class="ml-2 px-2"
            @click="sendNotif(items.length, modalType)"
          >
            Ya
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
    items: {
      type: Array,
      default: () => []
    },
    modalType: {
      type: String,
      default: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    sendNotif(length, type) {
      const data = {}
      data.length = length
      data.type = type
      this.$emit('send', data)
    }
  }
}
</script>
