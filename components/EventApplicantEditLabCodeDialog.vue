<template>
  <v-dialog :value="open" persistent max-width="400">
    <validation-observer
      ref="codeLabResult"
      v-slot="{ handleSubmit }"
      tag="div"
    >
      <v-form @submit.prevent="handleSubmit(save)">
        <v-card class="text-center">
          <v-card-title>
            <span class="col">Set Kode Sampel Lab</span>
          </v-card-title>
          <v-card-text class="pb-0">
            <pkbr-input
              v-model="codeSample"
              label="Kode Sampel Lab"
              name="Kode Sampel Lab"
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
            <v-btn color="primary" class="ml-2 px-2" type="submit">
              Simpan
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </validation-observer>
  </v-dialog>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },

    recordId: {
      type: Number,
      default: null
    },

    labCodeSample: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      lab_code_sample: null
    }
  },

  computed: {
    codeSample: {
      get() {
        return this.labCodeSample
      },
      set(value) {
        this.lab_code_sample = value
      }
    }
  },

  watch: {
    open(val) {
      if (!val) {
        this.lab_code_sample = null
        this.$refs.codeLabResult.reset()
      }
    }
  },

  methods: {
    save() {
      this.$emit('save', {
        rdt_invitation_id: this.recordId,
        lab_code_sample: this.lab_code_sample
      })
    },

    close() {
      this.$emit('close')
    }
  }
}
</script>
