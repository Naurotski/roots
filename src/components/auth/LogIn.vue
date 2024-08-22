<template>
  <div>
    <q-card-section class="row">
      <div class="text-h5">{{ $t('auth.logInAorta') }}</div>
      <q-space />
      <q-btn icon="close" flat round dense @click="$emit('closeDialog')" />
    </q-card-section>
    <q-card-section class="q-gutter-y-sm">
      <auth-providers-buttons>
        <template #apple>
          {{ `${$t('auth.logIn')} Apple` }}
        </template>
        <template #google>
          {{ `${$t('auth.logIn')} Google` }}
        </template>
        <template #facebook>
          {{ `${$t('auth.logIn')} Facebook` }}
        </template>
      </auth-providers-buttons>
    </q-card-section>
    <title-line-center>
      {{ $t('common.or') }}
    </title-line-center>
  </div>

  <!--  <form @submit.prevent="submitForm">-->
  <!--    <div class="row q-mb-md">-->
  <!--      <q-input-->
  <!--        v-if="tab !== 'login'"-->
  <!--        ref="firstName"-->
  <!--        v-model="formData.firstName"-->
  <!--        :rules="[-->
  <!--          (val) => (val && val.length > 0) || 'Please type something',-->
  <!--          (v) => v.length <= 15 || 'Not more than 15 characters',-->
  <!--          (v) => /^[^\s*_]*$/.test(v) || 'Input cannot contain spaces, `*`, or `_`'-->
  <!--        ]"-->
  <!--        lazy-rules-->
  <!--        class="col"-->
  <!--        label="First Name"-->
  <!--        outlined-->
  <!--        stack-label-->
  <!--        autocomplete="given-name"-->
  <!--      />-->
  <!--    </div>-->
  <!--    <div class="row q-mb-md">-->
  <!--      <q-input-->
  <!--        v-if="tab !== 'login'"-->
  <!--        ref="lastName"-->
  <!--        v-model="formData.lastName"-->
  <!--        :rules="[-->
  <!--          (val) => (val && val.length > 0) || 'Please type something',-->
  <!--          (v) => v.length <= 15 || 'Not more than 15 characters',-->
  <!--          (v) => /^[^\s*_]*$/.test(v) || 'Input cannot contain spaces, `*`, or `_`'-->
  <!--        ]"-->
  <!--        lazy-rules-->
  <!--        class="col"-->
  <!--        label="Last Name"-->
  <!--        outlined-->
  <!--        stack-label-->
  <!--        autocomplete="family-name"-->
  <!--      />-->
  <!--    </div>-->
  <!--    <div class="row q-mb-md">-->
  <!--      <q-input-->
  <!--        ref="email"-->
  <!--        v-model="formData.email"-->
  <!--        type="email"-->
  <!--        lazy-rules-->
  <!--        class="col"-->
  <!--        label="Email"-->
  <!--        outlined-->
  <!--        stack-label-->
  <!--        autocomplete="email"-->
  <!--        :rules="[(val) => isValidEmailAddress(val) || 'Please enter a valid email address.']"-->
  <!--      />-->
  <!--    </div>-->
  <!--    <div class="row q-mb-md">-->
  <!--      <q-input-->
  <!--        ref="password"-->
  <!--        v-model="formData.password"-->
  <!--        lazy-rules-->
  <!--        type="password"-->
  <!--        class="col"-->
  <!--        label="Password"-->
  <!--        outlined-->
  <!--        stack-label-->
  <!--        :autocomplete="tab !== 'login' ? 'new-password' : 'current-password'"-->
  <!--        :rules="[(val) => val.length >= 6 || 'Please enter at least 6 characters.']"-->
  <!--      />-->
  <!--    </div>-->
  <!--    <div class="row">-->
  <!--      <q-space />-->
  <!--      <q-btn color="primary" :label="tab" type="submit" />-->
  <!--    </div>-->
  <!--  </form>-->
</template>

<script>
import TitleLineCenter from 'components/TitleLineCenter.vue'
import AuthProvidersButtons from 'components/auth/AuthProvidersButtons.vue'
export default {
  name: 'LogIn',
  components: {
    TitleLineCenter,
    AuthProvidersButtons
  },
  emits: ['closeDialog']
}
</script>

<style scoped lang="sass" />
