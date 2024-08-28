<template>
  <h2>YourAccountPage</h2>
  <pre>userData - {{ userData }}</pre>
</template>

<script>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store.js'
import { useUserStore } from 'stores/user-store.js'

export default {
  name: 'YourAccountPage',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    watch(loggedIn, (val) => {
      if (!val) router.replace('/')
    })
    return {
      userData
    }
  }
}
</script>

<style scoped></style>
