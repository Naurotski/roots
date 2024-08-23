<template>
  <div>
    <q-card-actions
      :style="$q.screen.height < 600 ? 'margin-top: -20px; margin-bottom: -20px' : 'margin-top: 0'"
    >
      <div class="text-h5">{{ $t('auth.joinAorta') }}</div>
      <q-space />
      <q-btn icon="close" flat round dense @click="$emit('closeDialog')" />
    </q-card-actions>
    <q-card-section class="q-gutter-y-sm">
      <auth-providers-buttons>
        <template #apple>
          {{ `${$t('auth.continue')} Apple` }}
        </template>
        <template #google>
          {{ `${$t('auth.continue')} Google` }}
        </template>
        <template #facebook>
          {{ `${$t('auth.continue')} Facebook` }}
        </template>
      </auth-providers-buttons>
    </q-card-section>
    <title-line-center>
      {{ $t('common.or') }}
    </title-line-center>
    <form @submit.prevent="submitForm">
      <q-card-section>
        <q-input
          v-if="tab !== 'login'"
          ref="firstName"
          v-model="formData.firstName"
          :rules="[
            (val) => (val && val.length > 0) || 'Please type something',
            (v) => v.length <= 15 || 'Not more than 15 characters',
            (v) => /^[^\s*_]*$/.test(v) || 'Input cannot contain spaces, `*`, or `_`'
          ]"
          lazy-rules
          label="First Name"
          dense
          outlined
          stack-label
          autocomplete="given-name"
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
          autocomplete="current-password"
          :rules="[(val) => val.length >= 6 || 'Please enter at least 6 characters.']"
        />
        <q-btn
          no-caps
          rounded
          color="black"
          class="q-mt-xs full-width"
          :label="`${$t('auth.continue')} email`"
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
      </div>
    </q-card-actions>
  </div>
</template>

<script>
import { ref } from 'vue'
import AuthProvidersButtons from 'components/auth/AuthProvidersButtons.vue'
import TitleLineCenter from 'components/TitleLineCenter.vue'
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress.js'
export default {
  name: 'RegistrationUser',
  components: {
    AuthProvidersButtons,
    TitleLineCenter
  },
  emits: ['closeDialog', 'switch'],
  setup() {
    const firstName = ref(null)
    const email = ref(null)
    const password = ref(null)
    const formData = ref({
      firstName: '',
      email: '',
      password: ''
    })
    function submitForm() {
      firstName.value.validate()
      email.value.validate()
      password.value.validate()
      if (!email.value.hasError && !password.value.hasError && !firstName.value.hasError) {
        // loginUser(formData.value)
        console.log('formData ----', formData.value)
      }
    }
    return {
      firstName,
      email,
      password,
      formData,
      isValidEmailAddress,
      submitForm
    }
  }
}
</script>

<style scoped lang="sass"></style>
