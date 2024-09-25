<template>
  <div class="flex">
    <q-card>
      <q-img :src="imageData.imageSrc" v-bind="$attrs" />
      <q-file
        counter
        v-model="fileProxy"
        accept="image/*"
        max-file-size="1048576"
        label="Pick one file"
        filled
        style="width: 350px"
        v-bind="$attrs"
        @rejected="onRejected"
        ><template v-slot:prepend> <q-icon name="attach_file" /> </template>
        <template v-slot:hint> Max total upload size (1MB) </template>
      </q-file>
    </q-card>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useQuasar } from 'quasar'
export default {
  name: 'InputSingleFile',
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
      fileProxy,
      onRejected
    }
  }
}
</script>

<style scoped></style>
