<template>
  <div class="row justify-center">
    <div class="flex flex-center column">
      <q-avatar color="grey-4" size="150px">
        <img v-if="user.portraitUrl" :src="user.portraitUrl" alt="photo" />
        <span v-else>{{ user.firstName.charAt(0).toUpperCase() }}</span>
      </q-avatar>
      <set-new-photo :portrait-url="user.portraitUrl" />
      <div class="text-h6 text-bold">
        {{ userData.firstName || userData.displayName }} {{ userData.lastName }}
      </div>
    </div>
  </div>
  <form v-if="userData.providerId === 'password'" class="row justify-center">
    <q-input
      ref="email"
      v-model="user.email"
      clearable
      square
      outlined
      class="col-12 col-sm-4"
      label="Email"
      type="email"
      lazy-rules
      autocomplete="email"
      :rules="[(val) => isValidEmailAddress(val) || 'Please enter a valid email address.']"
    >
      <template v-slot:append>
        <q-btn
          v-if="userData.email !== user.email"
          @click="submitForm"
          color="green"
          fab-mini
          dense
          flat
          :label="$t('common.change')"
        />
      </template>
    </q-input>
  </form>
  <div v-else class="text-body2">{{ user.email }}</div>

  <pre>user - {{ user }}</pre>
  <pre>userData - {{ userData }}</pre>
</template>

<script>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useUserStore } from 'stores/user-store'
import SetNewPhoto from 'components/user/SetNewPhoto.vue'
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress'

export default {
  name: 'UserSettings',
  components: {
    SetNewPhoto
  },
  setup() {
    const $q = useQuasar()
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const { updateUserEmail, reauthenticate, setUserData } = userStore
    const email = ref(null)
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
        user.value.firstName = value.firstName || value.displayName || ''
        user.value.lastName = value.lastName || ''
        user.value.email = value.email || ''
        user.value.address = value.address || ''
        user.value.city = value.city || ''
        user.value.country = { ...value.country } || null
        user.value.postalCode = value.postalCode || ''
        user.value.phone = value.phone || ''
        user.value.taxId = value.taxId
        user.value.portraitUrl = value.portraitUrl || value.displayPhotoURL
      },
      { deep: true, immediate: true }
    )
    const submitForm = async () => {
      email.value.validate()
      if (!email.value.hasError) {
        await updateUserEmail(user.value.email)
          .then(() => {
            console.log('==============================')
            setUserData({ email: user.value.email })
          })
          .catch((error) => {
            console.log(error)
            console.log(error.message.match(/\((.*?)\)/)[1])
            if (error.message.match(/\((.*?)\)/)[1] === 'auth/requires-recent-login') {
              $q.dialog({
                prompt: {
                  model: '',
                  type: 'password',
                  'lazy-rules': true,
                  label: 'Password',
                  dense: true,
                  outlined: true,
                  'stack-label': true,
                  autocomplete: 'current-password',
                  rules: [(val) => val.length >= 6 || 'Please enter at least 6 characters.'],
                  isValid: (val) => val.length >= 6
                },
                position: $q.screen.xs ? 'top' : 'standard',
                cancel: true,
                persistent: true,
                style: 'border-radius: 25px'
              }).onOk((data) => {
                console.log('>>>> OK, received', data)
                reauthenticate(data).then(
                  async () =>
                    await updateUserEmail(user.value.email)
                      .then(() => {
                        setUserData({ email: user.value.email })
                      })
                      .catch(() => (user.value.email = userData.value.email))
                )
              })
            } else {
              user.value.email = userData.value.email
            }
          })
      }
    }
    return {
      userData,
      email,
      user,
      isValidEmailAddress,
      submitForm
    }
  }
}
</script>
<style scoped></style>
