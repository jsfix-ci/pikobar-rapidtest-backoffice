<template>
  <EventForm :form-data="getCurrent" form-type="edit" @onStore="doStore" />
</template>

<script>
import { mapGetters } from 'vuex'
import { lowerCase } from 'lodash'
import { EVENT_SUCCESS_UPDATE } from '@/utilities/constant'
import EventForm from '@/components/EventForm'

export default {
  middleware: 'auth',
  components: {
    EventForm
  },
  computed: {
    ...mapGetters('events', ['getCurrent'])
  },

  created() {
    this.$store.dispatch('breadcrumbs/setItems', [
      {
        disabled: false,
        text: 'Kegiatan',
        to: '/events'
      },
      {
        disabled: true,
        text: 'Edit Kegiatan'
      }
    ])
  },

  mounted() {
    if (this.$route.params.eventId) {
      this.$store.dispatch('events/getCurrent', this.$route.params.eventId)
    } else {
      this.$router.replace('/events')
    }
  },
  methods: {
    async doStore(payload) {
      try {
        await this.$store.dispatch('events/edit', payload)
        this.$toast.show({
          message: EVENT_SUCCESS_UPDATE,
          type: 'success'
        })
        this.$router.push(`/events?status=${lowerCase(payload.status)}`)
      } catch (error) {
        this.$toast.show({ message: error.message, type: 'error' })
      }
    }
  }
}
</script>
