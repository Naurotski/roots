<template>
  <div>
    <q-card-section class="row">
      <div class="text-h5">{{ $t('auth.logInAorta') }}</div>
      <q-space />
      <q-btn icon="close" flat round dense @click="closeDialog" />
    </q-card-section>
    <q-card-section class="q-gutter-y-sm">
      <auth-providers-buttons>
        <template #apple>
          {{ `${$t('auth.logInW')} Apple` }}
        </template>
        <template #google>
          {{ `${$t('auth.logInW')} Google` }}
        </template>
        <template #facebook>
          {{ `${$t('auth.logInW')} Facebook` }}
        </template>
      </auth-providers-buttons>
    </q-card-section>
    <title-line-center>
      {{ $t('common.or') }}
    </title-line-center>
    <form @submit.prevent="submitForm">
      <q-card-section>
        <q-input
          ref="email"
          v-model="formData.email"
          type="email"
          lazy-rules
          label="Email"
          dense
          outlined
          stack-label
          autocomplete="email"
          :rules="[(val) => isValidEmailAddress(val) || 'Please enter a valid email address.']"
        />
        <q-input
          ref="password"
          v-model="formData.password"
          lazy-rules
          type="password"
          label="Password"
          dense
          outlined
          stack-label
          autocomplete="current-password"
          :rules="[(val) => !!val || 'Password is required']"
        />
        <div class="text-body1" :class="{ 'text-body2': $q.screen.xs }">
          <u class="cursor-pointer" @click="passwordReset">{{ $t('auth.forgot') }}</u>
        </div>
        <q-btn
          no-caps
          rounded
          color="black"
          class="q-mt-md full-width"
          :label="$t('auth.logInEmail')"
          type="submit"
        ></q-btn>
      </q-card-section>
    </form>
    <q-card-section>
      <div class="text-body1 full-width text-right" :class="{ 'text-body2': $q.screen.xs }">
        {{ `${$t('auth.don')} ` }}
        <u class="cursor-pointer" @click="$emit('switch')">{{ $t('auth.joinAorta') }}</u>
      </div>
    </q-card-section>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/auth-store.js'
import { useUserStore } from 'stores/user-store'
import TitleLineCenter from 'components/TitleLineCenter.vue'
import AuthProvidersButtons from 'components/auth/AuthProvidersButtons.vue'
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress.js'

export default {
  name: 'LogIn',
  components: {
    TitleLineCenter,
    AuthProvidersButtons
  },
  emits: ['switch'],
  setup() {
    const $q = useQuasar()
    const { t } = useI18n()
    const authStore = useAuthStore()
    const { loginUser, showLoginDialog } = authStore
    const userStore = useUserStore()
    const { sendPasswordReset } = userStore
    const email = ref(null)
    const password = ref(null)
    const formData = ref({
      email: '',
      password: ''
    })
    const closeDialog = () => showLoginDialog(false)
    const submitForm = () => {
      email.value.validate()
      password.value.validate()
      if (!email.value.hasError && !password.value.hasError) {
        loginUser(formData.value)
      }
    }
    const passwordReset = () => {
      email.value.validate()
      if (!email.value.hasError) {
        sendPasswordReset(formData.value.email).finally(() => {
          $q.notify({
            color: 'grey',
            timeout: 10000,
            message: t('auth.sendPasswordReset'),
            actions: [{ label: 'Ok', flat: true, color: 'white' }]
          })
        })
      }
    }
    return {
      email,
      password,
      formData,
      isValidEmailAddress,
      closeDialog,
      submitForm,
      passwordReset
    }
  }
}
</script>

<style scoped lang="sass" />
