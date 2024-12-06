<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md">
      <q-btn flat size="xl" icon="mdi-arrow-left-bold" @click="$router.go(-1)" />
      <div v-if="urlImage?.includes('video')">
        <q-video :src="urlImage" style="height: 500px" />
      </div>
      <q-img v-else :src="urlImage" width="100%" alt="Aorta" />
      <q-btn flat size="xl" icon="mdi-arrow-left-bold" @click="$router.go(-1)" />
    </q-page>
  </transition>
</template>

<script>
import { useActionStore } from 'stores/actions-store.js'

import { computed, toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useMeta } from 'quasar'
export default {
  name: 'PressPage',
  props: {
    idPress: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const { idPress } = toRefs(props)
    const actionsStore = useActionStore()
    const { filterExhibitionsDraft } = storeToRefs(actionsStore)
    const { getExhibitions } = actionsStore
    const [exId, pressId] = idPress.value.split('-')
    if (!filterExhibitionsDraft.value.length) getExhibitions()
    const urlImage = computed(
      () =>
        filterExhibitionsDraft.value
          .find((item) => item.id === +exId)
          ?.press.find((el) => el.id === +pressId).urlWork
    )
    useMeta(() => {
      return {
        title: 'Aorta Social Art Gallery',
        titleTemplate: (title) => `${title} | Press`
      }
    })
    return {
      urlImage
    }
  }
}
</script>

<style scoped></style>
