<template>
  <span class="text-justify" style="white-space: pre-line">{{ description }}</span>
  <span
    style="cursor: pointer; color: #0d47a1"
    v-if="itemDescription.length >= number && !show"
    @click="show = !show"
  >
    {{ $t('common.more') }}</span
  ><span
    class="text-bold"
    style="cursor: pointer; color: #0d47a1"
    v-if="itemDescription.length >= number && show"
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
    },
    number: {
      tupe: Number,
      default: () => 250
    }
  },
  setup(props) {
    const { itemDescription, number } = toRefs(props)
    const show = ref(false)
    const description = computed(() => {
      if (itemDescription.value.length < number.value || show.value) {
        return itemDescription.value
      } else {
        return `${itemDescription.value.substring(0, number.value)}...`
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
