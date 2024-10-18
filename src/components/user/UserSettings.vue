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
  <input-universal
    ref="inputUniversal"
    v-if="userData.providerId === 'password'"
    v-model="user.email"
    :original-text="userData.email"
    type-rules="email"
    @onSubmit="submitEmail"
  />
  <div v-else class="text-body2 text-center">{{ user.email }}</div>
  <form-user-data v-model="user" @submitForm="submitForm" :deep-equal="deepEqual">
    <template #btn>
      <q-btn
        :disable="deepEqual"
        class="q-mx-md"
        color="grey"
        @click="cancelForm"
        :label="$t('common.cancel')"
      />
    </template>
  </form-user-data>
  <div class="text-center">
    <q-btn
      v-if="userData.providerId === 'password'"
      :class="{ 'full-width': $q.screen.xs }"
      label="sendPassword"
      @click="sendPassword"
    />
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'stores/user-store'
import SetNewPhoto from 'components/user/SetNewPhoto.vue'
import InputUniversal from 'components/user/InputUniversal.vue'
import FormUserData from 'components/shared/FormUserData.vue'
import { deepComparisonObjects } from 'src/composables/deepComparisonObjects'

export default {
  name: 'UserSettings',
  components: {
    SetNewPhoto,
    FormUserData,
    InputUniversal
  },
  setup() {
    const $q = useQuasar()
    const { t } = useI18n()
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const { updateUserEmail, reauthenticate, setUserData, updateUser, sendPasswordReset } =
      userStore
    const fab1 = ref(false)
    const inputUniversal = ref(null)
    const user = ref({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      country: null,
      postalCode: '',
      phone: '',
      taxId: '',
      portraitData: {}
    })
    const deepEqual = computed(() => {
      // eslint-disable-next-line no-unused-vars
      const { email, portraitData, portraitUrl, ...obj1 } = user.value
      const obj2 = {
        firstName: userData.value.firstName || userData.value.displayName || '',
        lastName: userData.value.lastName || '',
        address: userData.value.address || '',
        city: userData.value.city || '',
        country: userData.value.country ? { ...userData.value.country } : null,
        postalCode: userData.value.postalCode || '',
        phone: userData.value.phone || '',
        taxId: userData.value.taxId || ''
      }
      return deepComparisonObjects(obj1, obj2)
    })
    watch(
      userData,
      (value) => {
        if (value.userId) {
          user.value.firstName = value.firstName || value.displayName || ''
          user.value.lastName = value.lastName || ''
          user.value.email = value.email || ''
          user.value.address = value.address || ''
          user.value.city = value.city || ''
          user.value.country = value.country ? { ...value.country } : null
          user.value.postalCode = value.postalCode || ''
          user.value.phone = value.phone || ''
          user.value.taxId = value.taxId || ''
          user.value.portraitUrl = value.portraitUrl || value.displayPhotoURL
        }
      },
      { deep: true, immediate: true }
    )
    const submitEmail = async () => {
      inputUniversal.value.inputText.validate()
      if (!inputUniversal.value.inputText.hasError) {
        await updateUserEmail(user.value.email)
          .then(() => {
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
    const submitForm = () => {
      if (!deepEqual.value) {
        console.log('onSubmit - ')
        // eslint-disable-next-line no-unused-vars
        const { email, portraitData, portraitUrl, ...localObj } = user.value
        updateUser({
          path: `users/${userData.value.userId}`,
          payload: localObj
        }).then(() => {
          $q.notify({
            message: t('common.saved'),
            color: 'grey'
          })
        })
      }
    }
    const cancelForm = () => {
      user.value.firstName = userData.value.firstName || userData.value.displayName || ''
      user.value.lastName = userData.value.lastName || ''
      user.value.address = userData.value.address || ''
      user.value.city = userData.value.city || ''
      user.value.country = userData.value.country ? { ...userData.value.country } : null
      user.value.postalCode = userData.value.postalCode || ''
      user.value.phone = userData.value.phone || ''
      user.value.taxId = userData.value.taxId || ''
    }
    const sendPassword = () => {
      console.log('sendPassword')
      sendPasswordReset().finally(() => {
        $q.notify({
          color: 'grey',
          timeout: 10000,
          message: t('auth.sendPasswordReset'),
          actions: [{ label: 'Ok', flat: true, color: 'white' }]
        })
      })
    }
    return {
      fab1,
      userData,
      inputUniversal,
      user,
      deepEqual,
      submitEmail,
      submitForm,
      cancelForm,
      sendPassword
    }
  }
}
</script>
<style scoped></style>
