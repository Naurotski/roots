<template>
  <q-item exact clickable :to="{ name: link.title }">
    <q-item-section v-if="link.icon" avatar>
      <q-icon :name="link.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ link.title }}</q-item-label>
      <q-item-label caption>{{ link.caption }}</q-item-label>
    </q-item-section>
  </q-item>
  <q-separator inset />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    link: {
      type: Object,
      required: true
    }
  }
})
</script>
