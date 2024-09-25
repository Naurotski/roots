<template>
  <q-btn flat no-caps label="Set New Photo" @click="dialog = true" />
  <q-dialog
    v-model="dialog"
    backdrop-filter="blur(4px)"
    :maximized="$q.screen.xs"
    :transition-show="$q.screen.xs ? 'slide-up' : 'fade'"
    :transition-hide="$q.screen.xs ? 'slide-down' : 'fade'"
  >
    <q-card>
      <q-btn color="green" class="absolute-top-right z-max" icon="check" flat round dense v-close-popup />
      <q-btn color="red" class="absolute-top-left z-max" icon="close" flat round dense v-close-popup />
      <div style="height: 100%">
        <div />
        <avatar-selector :portrait-data="imageData" />
        <!--          <q-img :src="imageData.imageSrc" v-bind="$attrs" />-->
        <q-file
          dark
          counter
          bg-color="primary"
          label-color="white"
          v-model="fileProxy"
          accept="image/*"
          label="Upload the portrait of the artist"
          filled
          style="z-index: 99"
          :style="$q.screen.xs ? 'width: 100%' : 'width: 400px'"
          @rejected="onRejected"
          ><template v-slot:prepend> <q-icon name="attach_file" color="white" /> </template>
          <template v-slot:hint> Max total upload size (1MB) </template>
        </q-file>
      </div>
    </q-card>
  </q-dialog>
  <!--  max-file-size="1048576"-->
</template>
<script>
import { computed, ref, toRefs } from 'vue'
import { useQuasar } from 'quasar'
import AvatarSelector from 'components/user/AvatarSelector.vue'
export default {
  name: 'SetNewPhoto',
  components: { AvatarSelector },
  props: {
    imageData: {
      type: Object,
      default: () => ({
        imageSrc: ''
      })
    },
    modelValue: {
      type: Object
    }
  },
  emits: ['update:modelValue', 'update:imageData'],
  setup(props, { emit }) {
    const dialog = ref(false)
    const $q = useQuasar()
    const { modelValue } = toRefs(props)
    const fileProxy = computed({
      get() {
        return modelValue.value
      },
      set(value) {
        emit('update:modelValue', value)
        console.log('value', value)
        if (value) {
          const image = new Image()
          image.src = URL.createObjectURL(value)
          image.onload = () => {
            console.log(image.height)
            console.log(image.width)
            console.log(image.src)
            console.log(image.width / image.height)
            emit('update:imageData', {
              imageSrc: image.src,
              aspectRatio: (image.width / image.height).toFixed(2)
            })
          }
        }
      }
    })
    const onRejected = (rejectedEntries) => {
      $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    }
    return {
      dialog,
      fileProxy,
      onRejected
    }
  }
}
</script>
<style scoped></style>
