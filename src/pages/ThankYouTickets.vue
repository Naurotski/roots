<template>
  <q-page class="flex flex-center q-pa-lg">
    <q-card class="q-pa-lg bg-grey-10 text-white" style="max-width: 600px; width: 100%">
      <q-card-section class="text-center">
        <div class="text-h5 q-mt-md">{{ $t('success.heading') }}</div>
        <div class="text-subtitle1 q-mt-sm">{{ $t('success.subheading') }}</div>
        <q-card-section v-if="action" class="row justify-center">
          <div>
            <img :src="action.urlImage" style="max-height: 100px" alt="photo" />
          </div>
          <div class="q-ml-lg text-left">
            <div>
              {{ action.name }}
            </div>
            <div>
              {{ date }}
            </div>
            <div>
              {{ time }}
            </div>
          </div>
        </q-card-section>
      </q-card-section>
      <q-separator spaced />
      <q-card-section class="text-center">
        <p>{{ $t('success.confirmationSent') }}</p>
        <p>
          {{ $t('success.checkSpam') }}
          <br />
          {{ $t('success.contact') }}:
          <a href="mailto:aorta.gallery@gmail.com" class="text-negative">aorta.gallery@gmail.com</a>
        </p>
      </q-card-section>
      <q-card-actions class="q-px-xl">
        <q-btn
          text-color="negative"
          :label="$t('success.backToSite')"
          to="/"
          outline
          rounded
          no-caps
          class="full-width"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { useRoute } from 'vue-router'
import { useActionStore } from 'stores/actions-store'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
export default {
  name: 'ThankYouTickets',
  setup() {
    const route = useRoute()
    const actionsStore = useActionStore()
    const { filterExhibitionsDraft } = storeToRefs(actionsStore)
    const { getExhibitions } = actionsStore
    if (!filterExhibitionsDraft.value.length) getExhibitions()
    const actionId = ref(route.query.actionId) || '—'
    const date = route.query.date || '—'
    const time = route.query.time || '—'
    const action = computed(() =>
      filterExhibitionsDraft.value.find((item) => item.id === +actionId.value)
    )
    console.log(action.value)
    console.log(actionId.value)
    return {
      action,
      filterExhibitionsDraft,
      actionId,
      date,
      time
    }
  }
}
</script>

<style scoped></style>
