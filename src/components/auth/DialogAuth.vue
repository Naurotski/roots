<template>
  <q-dialog v-model="dialog">
    <q-card class="container" @click="onPan" style="width: 600px; height: 600px; overflow: hidden">
      <log-in
        class="block-1 bg-grey"
        :style="contentStyle"
        style="width: 100%"
        @closeDialog="dialog = false"
      />
      <registration-user
        class="block-2 bg-green"
        :style="actionsStyle"
        style="width: 100%"
        @closeDialog="dialog = false"
      />
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, toRefs } from 'vue'
import LogIn from 'components/auth/LogIn.vue'
import RegistrationUser from 'components/auth/RegistrationUser.vue'
export default {
  name: 'DialogAuth',
  components: {
    LogIn,
    RegistrationUser
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const switched = ref(false)
    const { modelValue } = toRefs(props)
    const dialog = computed({
      get() {
        return modelValue.value
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    const contentStyle = computed(() => {
      return {
        transform: `translateX(${switched.value ? -100 : 0}%)`
      }
    })
    const actionsStyle = computed(() => {
      return {
        transform: `translateX(${switched.value ? 0 : 100}%)`
      }
    })
    const onPan = () => {
      switched.value = !switched.value
    }
    return {
      switched,
      dialog,
      contentStyle,
      actionsStyle,
      onPan
    }
  }
}
</script>

<style lang="sass" scoped>
//.container
//  position: relative
//  overflow: hidden
.block-1
  transition: transform 0.3s ease
.block-2
  position: absolute
  top: 0
  transition: transform 0.3s ease
</style>
