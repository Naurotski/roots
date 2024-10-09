<template>
  <q-btn flat no-caps :label="$t('settings.SetNewPhoto')" @click="dialog = true" />
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
        @click="saveImage"
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
      <avatar-selector :portrait-data="imageData" @updateTranslate="(val) => (translate = val)" />
      <q-file
        v-model="fileProxy"
        :class="{ 'absolute-bottom': $q.screen.xs }"
        counter
        max-file-size="6291456"
        bg-color="grey"
        label-color="white"
        accept="image/*"
        :label="$t('settings.SetNewPhoto')"
        filled
        style="z-index: 99; width: 100%"
        @rejected="onRejected"
        ><template v-slot:prepend> <q-icon name="attach_file" color="white" /> </template>
        <template v-slot:hint> Max total upload size (6MB) </template>
      </q-file>
    </q-card>
  </q-dialog>
  <!--  max-file-size="6291456"-->
</template>
<script>
import { ref, toRefs, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from 'stores/user-store'
import AvatarSelector from 'components/user/AvatarSelector.vue'
import { compressImage } from 'src/composables/compressImage'
import { storeToRefs } from 'pinia'

export default {
  name: 'SetNewPhoto',
  components: { AvatarSelector },
  props: {
    portraitUrl: {
      type: String,
      default: () =>
        'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2FbackgroundGray.jpg?alt=media&token=298dcf1f-0545-4375-ab89-915d5e6afcbb'
    }
  },
  setup(props) {
    const dialog = ref(false)
    const $q = useQuasar()
    const { portraitUrl } = toRefs(props)
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    console.log(userData.value)
    const { updateUser, uploadImageToStorage } = userStore
    const translate = ref({ translateX: 0, translateY: 0 })
    const fileProxy = ref(null)
    const imageData = ref({})

    watch(
      fileProxy,
      (value) => {
        if (value) {
          const image = new Image()
          image.src = URL.createObjectURL(value)
          image.onload = () => {
            console.log('width - ', image.width, 'height - ', image.height, value.type)
            imageData.value.imageSrc = image.src
            imageData.value.width = image.width
            imageData.value.height = image.height
            imageData.value.type = value.type
          }
        }
      },
      { deep: true }
    )
    watch(
      portraitUrl,
      (val) => {
        imageData.value.imageSrc = val
        imageData.value.width = 0
        imageData.value.height = 0
        imageData.value.type = ''
      },
      { immediate: true }
    )

    const saveImage = async () => {
      console.log('saveImage')
      const canvasDataUrl = await compressImage({
        imgSrc: imageData.value.imageSrc,
        imgType: imageData.value.type,
        ...translate.value
      })
      const url = await uploadImageToStorage({
        path: `users/${userData.value.userId}/portrait.${imageData.value.type.split('/')[1]}`,
        url: canvasDataUrl,
        stringEncodingType: 'data_url',
        contentType: imageData.value.type
      })
      await updateUser({
        path: `users/${userData.value.userId}`,
        payload: { portraitUrl: url }
      })
      dialog.value = false
    }
    const onRejected = (rejectedEntries) => {
      $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    }
    return {
      dialog,
      fileProxy,
      translate,
      imageData,
      saveImage,
      onRejected
    }
  }
}
</script>
<style scoped></style>
