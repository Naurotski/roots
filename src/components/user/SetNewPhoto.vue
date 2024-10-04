<template>
  <q-btn flat no-caps label="Set New Photo" @click="dialog = true" />
  <q-dialog
    v-model="dialog"
    backdrop-filter="blur(4px)"
    :maximized="$q.screen.xs"
    :transition-show="$q.screen.xs ? 'slide-up' : 'fade'"
    :transition-hide="$q.screen.xs ? 'slide-down' : 'fade'"
  >
    <q-card class="flex flex-center" style="max-width: 500px">
      <q-btn
        color="green"
        class="absolute-top-right z-max"
        icon="check"
        flat
        round
        dense
        v-close-popup
      />
      <q-btn
        color="red"
        class="absolute-top-left z-max"
        icon="close"
        flat
        round
        dense
        v-close-popup
      />

      <avatar-selector :portrait-data="imageData" />
      <q-file
        :class="{ 'absolute-bottom': $q.screen.xs }"
        dark
        bg-color="primary"
        label-color="white"
        v-model="fileProxy"
        accept="image/*"
        label="Upload the portrait of the artist"
        filled
        style="z-index: 99; width: 100%"
        @rejected="onRejected"
        ><template v-slot:prepend> <q-icon name="attach_file" color="white" /> </template>
        <!--        <template v-slot:hint> Max total upload size (1MB) </template>-->
      </q-file>
    </q-card>
  </q-dialog>
  <!--  max-file-size="1048576"-->
</template>
<script>
import { computed, ref, toRefs } from 'vue'
import { useQuasar } from 'quasar'
import AvatarSelector from 'components/user/AvatarSelector.vue'
import { compressImage } from 'src/composables/compressImage'

export default {
  name: 'SetNewPhoto',
  components: { AvatarSelector },
  props: {
    imageData: {
      type: Object,
      default: () => ({
        imageSrc:
          'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2FbackgroundGray.jpg?alt=media&token=298dcf1f-0545-4375-ab89-915d5e6afcbb'
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
        if (value) {
          const image = new Image()
          image.src = URL.createObjectURL(value)
          image.onload = async () => {
            const result = await compressImage(image, value.type, image.src)
            emit('update:imageData', {
              imageSrc: image.src,
              imSrc: result
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
