<template>
  <q-page>
    <set-new-photo
      class="justify-center"
      v-model:imageData="user.portraitData"
      v-model="user.imagePortrait"
    />
  </q-page>
</template>

<script>
import { ref, watchEffect } from 'vue'
import { useUserStore } from 'stores/user-store'
import SetNewPhoto from 'components/user/SetNewPhoto.vue'
import { storeToRefs } from 'pinia'
export default {
  name: 'UserSettings',
  components: {
    SetNewPhoto
  },
  props: {
    name: {
      type: String,
      required: true
    }
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
      portraitData: null,
      imagePortrait: null
    })

    watchEffect(() => {
      user.value.firstName = userData.value.firstName || ''
      user.value.lastName = userData.value.lastName || ''
      user.value.email = userData.value.email || ''
      user.value.address = userData.value.address || ''
      user.value.city = userData.value.city || ''
      user.value.country = { ...userData.value.country } || null
      user.value.postalCode = userData.value.postalCode || ''
      user.value.phone = userData.value.phone || ''
      user.value.taxId = userData.value.taxId
      user.value.portraitData = userData.value.portraitData
    })
    return {
      userData,
      user
    }
  }
}
</script>
<style scoped></style>
