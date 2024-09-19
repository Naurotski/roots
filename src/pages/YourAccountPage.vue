<template>
  <h2>YourAccountPage</h2>
  <pre>userData - {{ userData }}</pre>
  <pre>shippingDetails - {{ shippingDetails }}</pre>
</template>

<script>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store.js'
import { useUserStore } from 'stores/user-store.js'
import { useStripeStore } from 'stores/stripe-store.js'

export default {
  name: 'YourAccountPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const stripeStore = useStripeStore()
    const { deliveryData } = storeToRefs(stripeStore)
    watch(loggedIn, (val) => {
      if (!val) router.replace('/')
    })
    return {
      userData,
      deliveryData
    }
  }
}
</script>

<style scoped></style>
