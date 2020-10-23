<template>
  <v-dialog v-model="open" hide-overlay persistent max-width="750">
    <v-card>
      <v-card-title class="text-center">
        <span class="col pl-10">Peringatan!</span>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="text-center">
          <p>
            Berikut ini adalah data peserta yang akan diintegrasikan ke aplikasi
            Labkesda.
          </p>
          <p>
            Data yang diintegrasikan adalah data yang sudah memiliki kode
            sampel.
          </p>
        </div>
        <div>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Nomor Pendaftaran
                  </th>
                  <th class="text-left">
                    Nama
                  </th>
                  <th class="text-left">
                    Kode Sampel
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in items" :key="data.id">
                  <td>{{ data.applicant.registration_code }}</td>
                  <td>{{ data.applicant.name }}</td>
                  <td>{{ data.lab_code_sample }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-card-text>
      <v-card-actions class="pb-6 justify-center">
        <v-btn color="grey darken-1" outlined class="mr-2 px-2" @click="close">
          Batal
        </v-btn>
        <v-btn color="primary" class="ml-2 px-2" @click="send">
          Kirim
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      default: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    send() {
      this.$emit('send')
    }
  }
}
</script>
