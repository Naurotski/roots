<template>
  <div class="text-body1 cursor-pointer" @click="activator = true">
    {{ name }}
  </div>
  <q-dialog full-width v-model="activator">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-video v-if="url.includes('video')" :src="url" style="height: 400px" />
        <q-img v-else :src="url" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'ImageDialog',
  props: {
    url: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  setup() {
    const activator = ref(false)
    return {
      activator
    }
  }
}
</script>

<style scoped></style>
