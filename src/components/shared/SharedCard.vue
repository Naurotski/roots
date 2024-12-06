<template>
  <q-toolbar>
    <q-toolbar-title style="white-space: pre-line" class="text-h5">{{
      dataCard.name
    }}</q-toolbar-title>
  </q-toolbar>
  <div class="col-12 col-sm-3">
    <q-card square flat class="q-pr-sm-xl">
      <q-img :src="dataCard.url" :alt="dataCard.name" :ratio="1" />
      <slot name="underPicture" />
    </q-card>
  </div>
  <div class="col-12 col-sm-8 relative-position" v-bind="$attrs">
    <p class="text-justify text-body1" style="white-space: pre-line">
      {{ description }}
      <span
        style="cursor: pointer; color: #0d47a1"
        v-if="dataCard.description?.length >= 700 && !show"
        @click="show = !show"
        >{{ $t('common.more') }}</span
      ><span
        style="cursor: pointer; color: #0d47a1"
        v-if="dataCard.description?.length >= 700 && show"
        @click="show = !show"
      >
        <br />&#8679;</span
      >
    </p>
    <slot name="press" />
    <slot name="button" />
  </div>
</template>

<script>
import { computed, ref, toRefs } from 'vue'
export default {
  name: 'SharedCard',
  props: {
    dataCard: {
      type: Object,
      require: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    const show = ref(false)
    const { dataCard } = toRefs(props)
    const description = computed(() => {
      if (dataCard.value.description?.length < 700 || show.value) {
        return dataCard.value.description
      } else {
        return `${dataCard.value.description?.substring(0, 700)}...`
      }
    })
    return {
      show,
      description
    }
  }
}
</script>

<style scoped></style>
