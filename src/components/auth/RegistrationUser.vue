<template>
  <div>
    <q-card-section class="row">
      <div class="text-h5">{{ $t('auth.joinAorta') }}</div>
      <q-space />
      <q-btn icon="close" flat round dense @click="$emit('closeDialog')" />
    </q-card-section>
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
  </div>
</template>

<script>
import AuthProvidersButtons from 'components/auth/AuthProvidersButtons.vue'
import TitleLineCenter from 'components/TitleLineCenter.vue'
export default {
  name: 'RegistrationUser',
  components: {
    AuthProvidersButtons,
    TitleLineCenter
  },
  emits: ['closeDialog']
}
</script>

<style scoped lang="sass"></style>
