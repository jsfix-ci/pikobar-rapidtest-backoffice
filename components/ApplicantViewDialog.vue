<template>
  <div>
    <v-dialog :value="open" persistent max-width="900">
      <v-card>
        <v-card-title>
          <span class="headline">Lihat Peserta</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="registrationCode"
                  label="Nomor Pendaftaran"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="name"
                  label="Nama Peserta"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="birthDate"
                  label="Tanggal Lahir"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="phoneNumber"
                  label="Nomor Telepon"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="address"
                  label="Alamat Domisili"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-if="cityName"
                  v-model="cityName"
                  label="Kota/Kabupaten"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-if="districtName"
                  v-model="districtName"
                  label="Kecamatan"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-if="villageName"
                  v-model="villageName"
                  label="Desa/Kelurahan"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="occupationType"
                  label="Jenis Pekerjaan"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="occupationName"
                  label="Nama Profesi"
                  filled
                  readonly
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="workplaceName"
                  label="Tempat Bekerja"
                  filled
                  readonly
                />
              </v-col>
              <v-col
                v-if="detailType === 'applicant' && invitations.length > 0"
                cols="12"
              >
                <h3>Riwayat Undangan / Hasil Tes</h3>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Nama Kegiatan</th>
                        <th class="text-left">Tanggal Kegiatan</th>
                        <th class="text-left">Checkin</th>
                        <th class="text-left">Jenis Tes</th>
                        <th class="text-left">Tanggal Hasil Tes</th>
                        <th class="text-left">Hasil Tes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="invitation in invitations"
                        :key="invitation.id"
                      >
                        <td>
                          {{
                            invitation.event ? invitation.event.event_name : '-'
                          }}
                        </td>
                        <td>
                          {{
                            invitation.event
                              ? $dateFns.format(
                                  new Date(invitation.event.start_at),
                                  'dd MMMM yyyy'
                                )
                              : '-'
                          }}
                        </td>
                        <td>
                          {{
                            invitation.attended_at
                              ? $dateFns.format(
                                  new Date(invitation.attended_at),
                                  'dd MMMM yyyy HH:mm'
                                )
                              : '-'
                          }}
                        </td>
                        <td>
                          {{
                            invitation.test_type ? invitation.test_type : '-'
                          }}
                        </td>
                        <td>
                          {{
                            invitation.result_at
                              ? $dateFns.format(
                                  new Date(invitation.result_at),
                                  'dd MMMM yyyy'
                                )
                              : '-'
                          }}
                        </td>
                        <td>
                          {{
                            invitation.lab_result_type
                              ? invitation.lab_result_type
                              : '-'
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="close">
            Keluar
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

    recordId: {
      type: Number,
      default: null
    },

    detailType: {
      type: String,
      default: 'applicant'
    }
  },

  data() {
    return {
      registrationCode: null,
      name: null,
      address: null,
      cityName: null,
      districtName: null,
      villageName: null,
      occupationType: null,
      occupationName: null,
      workplaceName: null,
      phoneNumber: null,
      birthDate: null,
      invitations: []
    }
  },

  watch: {
    recordId(value) {
      if (value) {
        this.fetchRecord()
      }
    }
  },

  methods: {
    async fetchRecord() {
      const id = this.recordId
      let data = null
      if (this.detailType === 'invitation') {
        await this.$axios.$get(`/rdt/invitation/${id}`).then((response) => {
          data = response.data.applicant
        })
      } else {
        await this.$axios.$get(`/rdt/applicants/${id}`).then((response) => {
          data = response.data
        })
      }

      this.registrationCode = data.registration_code
      this.name = data.name
      this.address = data.address
      this.cityName = data.city ? data.city.name : null
      this.districtName = data.district ? data.district.name : null
      this.villageName = data.village ? data.village.name : null
      this.occupationType = data.occupation_type
      this.occupationName = data.occupation_name
      this.workplaceName = data.workplace_name
      this.phoneNumber = data.phone_number
      this.birthDate = data.birth_date
      this.invitations = data.invitations
    },

    async save() {
      const id = this.recordId

      try {
        await this.$axios.$put(`/rdt/applicants/${id}`, {
          name: this.name
        })

        this.$emit('save')
      } catch (e) {
        //
      }
    },

    close() {
      this.$emit('close')
    }
  }
}
</script>
