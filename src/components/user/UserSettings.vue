<template>
  <q-page>
    <q-avatar color="grey-4" size="200px">
      <img v-if="user.portraitUrl" :src="user.portraitUrl" alt="photo" />
      <span v-else>{{ user.firstName.charAt(0).toUpperCase() }}</span>
    </q-avatar>
    <div>
      <set-new-photo :portrait-url="user.portraitUrl" />
    </div>
    <pre>userData - {{ userData }}</pre>
    <pre>user - {{ user }}</pre>
  </q-page>
</template>

<script>
import { ref, watch } from 'vue'
import { useUserStore } from 'stores/user-store'
import SetNewPhoto from 'components/user/SetNewPhoto.vue'
import { storeToRefs } from 'pinia'
export default {
  name: 'UserSettings',
  components: {
    SetNewPhoto
  },
  setup() {
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const user = ref({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      country: null,
      postalCode: '',
      phone: '',
      taxId: null,
      portraitData: {}
    })
    watch(
      userData,
      (value) => {
        user.value.firstName = value.firstName || ''
        user.value.lastName = value.lastName || ''
        user.value.email = value.email || ''
        user.value.address = value.address || ''
        user.value.city = value.city || ''
        user.value.country = { ...value.country } || null
        user.value.postalCode = value.postalCode || ''
        user.value.phone = value.phone || ''
        user.value.taxId = value.taxId
        user.value.portraitUrl = value.portraitUrl
      },
      { deep: true, immediate: true }
    )
    return {
      userData,
      user
    }
  }
}
</script>
<style scoped></style>
