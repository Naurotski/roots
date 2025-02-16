<template>
  <div>
    <q-card-actions
      :style="$q.screen.height < 600 ? 'margin-top: -20px; margin-bottom: -20px' : 'margin-top: 0'"
    >
      <div class="text-h5">{{ $t('auth.joinAorta') }}</div>
      <q-space />
      <q-btn icon="close" flat round dense @click="closeDialog" />
    </q-card-actions>
    <q-card-section class="q-gutter-y-sm">
      <auth-providers-buttons>
        <template #apple>
          {{ `${$t('auth.continueWith')} Apple` }}
        </template>
        <template #google>
          {{ `${$t('auth.continueWith')} Google` }}
        </template>
        <template #facebook>
          {{ `${$t('auth.continueWith')} Facebook` }}
        </template>
      </auth-providers-buttons>
    </q-card-section>
    <title-line-center>
      {{ $t('common.or') }}
    </title-line-center>
    <form @submit.prevent="submitForm">
      <q-card-section>
        <q-input
          ref="displayName"
          v-model="formData.displayName"
          lazy-rules
          label="Name"
          dense
          outlined
          stack-label
          autocomplete="given-name"
          :rules="[
            (val) => (val && val.length > 0) || 'Please type something',
            (v) => v.length <= 15 || 'Not more than 15 characters',
            (v) => /^[^\s*_]*$/.test(v) || 'Input cannot contain spaces, `*`, or `_`'
          ]"
        />
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
          autocomplete="new-password"
          :rules="passwordRules"
        />
        <q-btn
          no-caps
          rounded
          color="black"
          class="q-mt-xs full-width"
          :label="`${$t('auth.continueWith')} email`"
          type="submit"
        ></q-btn>
      </q-card-section>
    </form>
    <div class="text-body1 full-width text-center" :class="{ 'text-body2': $q.screen.xs }">
      {{ `${$t('auth.already')} `
      }}<u class="cursor-pointer" @click="$emit('switch')">{{ $t('auth.logIn') }}</u>
    </div>
    <q-card-actions>
      <div class="text-caption full-width text-justify">
        {{ $t('auth.rules') }}
        <router-link style="color: black" to="/termsSale">{{ $t('auth.termsSale') }}</router-link>
        {{ $t('common.and') }}
        <router-link style="color: black" to="/privacy">{{ $t('auth.privacyPolicy') }}</router-link>
      </div>
    </q-card-actions>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store.js'
import { useStripeStore } from 'stores/stripe-store.js'
import AuthProvidersButtons from 'components/auth/AuthProvidersButtons.vue'
import TitleLineCenter from 'components/TitleLineCenter.vue'
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress.js'
import { passwordRules } from 'src/composables/passwordRules'

export default {
  name: 'RegistrationUser',
  components: {
    AuthProvidersButtons,
    TitleLineCenter
  },
  emits: ['switch'],
  setup() {
    const authStore = useAuthStore()
    const { registerUser, showLoginDialog } = authStore
    const stripeStore = useStripeStore()
    const { shippingDetails } = storeToRefs(stripeStore)
    const displayName = ref(null)
    const email = ref(null)
    const password = ref(null)
    const formData = ref({
      displayName: '',
      email: '',
      password: ''
    })
    watch(
      shippingDetails,
      (val) => {
        if (val.email) {
          formData.value.displayName = val.firstName
          formData.value.email = val.email
        }
      },
      { immediate: true }
    )
    const closeDialog = () => showLoginDialog(false)
    const submitForm = () => {
      displayName.value.validate()
      email.value.validate()
      password.value.validate()
      if (!email.value.hasError && !password.value.hasError && !displayName.value.hasError) {
        registerUser(formData.value)
      }
    }
    return {
      displayName,
      email,
      password,
      formData,
      isValidEmailAddress,
      passwordRules,
      closeDialog,
      submitForm
    }
  }
}
</script>

<style scoped lang="sass"></style>
