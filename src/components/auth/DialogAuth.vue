<template>
  <q-dialog
    v-model="dialog"
    backdrop-filter="blur(4px)"
    :maximized="$q.screen.xs"
    :transition-show="$q.screen.xs ? 'slide-up' : 'fade'"
    :transition-hide="$q.screen.xs ? 'slide-down' : 'fade'"
    @hide="switched = false"
  >
    <q-card
      class="container"
      style="width: 600px; overflow: hidden; border-radius: 25px"
      :style="$q.screen.xs ? 'height: 100%' : 'height: 600px'"
    >
      <log-in
        class="block-1 q-pa-lg"
        :style="contentStyle"
        style="width: 100%"
        @closeDialog="dialog = false"
        @switch="switched = true"
      />
      <registration-user
        class="block-2 q-pa-lg"
        :style="actionsStyle"
        style="width: 100%"
        @closeDialog="dialog = false"
        @switch="switched = false"
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
    return {
      switched,
      dialog,
      contentStyle,
      actionsStyle
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
