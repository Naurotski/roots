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
        @switch="switched = true"
      />
      <registration-user
        class="block-2 q-pa-lg"
        :style="actionsStyle"
        style="width: 100%"
        @switch="switched = false"
      />
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store.js'
import { useStripeStore } from 'stores/stripe-store.js'
import LogIn from 'components/auth/LogIn.vue'
import RegistrationUser from 'components/auth/RegistrationUser.vue'

export default {
  name: 'DialogAuth',
  components: {
    LogIn,
    RegistrationUser
  },
  setup() {
    const switched = ref(false)
    const authStore = useAuthStore()
    const { loginDialog } = storeToRefs(authStore)
    const { showLoginDialog } = authStore
    const stripeStore = useStripeStore()
    const { shippingDetails } = storeToRefs(stripeStore)
    const dialog = computed({
      get() {
        return loginDialog.value
      },
      set(val) {
        showLoginDialog(val)
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
    watch(shippingDetails, (val) => {
      if (val.email) switched.value = true
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
