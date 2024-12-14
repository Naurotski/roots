<template>
  <span class="text-justify" style="white-space: pre-line">{{ description }}</span>
  <span
    style="cursor: pointer; color: #0d47a1"
    v-if="itemDescription.length >= 250 && !show"
    @click="show = !show"
  >
    {{ $t('common.more') }}</span
  ><span
    style="cursor: pointer; color: #0d47a1"
    v-if="itemDescription.length >= 250 && show"
    @click="show = !show"
  >
    &#8679;</span
  >
</template>

<script>
import { computed, ref, toRefs } from 'vue'

export default {
  name: 'DescriptionForCard',
  props: {
    itemDescription: {
      type: String,
      default: () => ''
    }
  },
  setup(props) {
    const { itemDescription } = toRefs(props)
    const show = ref(false)
    const description = computed(() => {
      if (itemDescription.value.length < 250 || show.value) {
        return itemDescription.value
      } else {
        return `${itemDescription.value.substring(0, 250)}...`
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
