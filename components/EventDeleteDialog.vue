<template>
  <div>
    <v-dialog :value="open" max-width="528">
      <v-card class="text-center">
        <v-card-title>
          <span class="col pl-10">Hapus Kegiatan coyy</span>
        </v-card-title>
        <v-card-text>
          <div>
            {{ confirmDeleteMsg + record.id }}
          </div>
          <strong> {{ record.name }} </strong>.
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
          <v-btn color="error" class="ml-2 px-2" @click="remove(record.id)">
            Ya
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { CONFIRM_DELETE } from '@/utilities/constant'
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
      confirmDeleteMsg: CONFIRM_DELETE
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    remove(data) {
      this.$emit('remove', data)
    }
  }
}
</script>
