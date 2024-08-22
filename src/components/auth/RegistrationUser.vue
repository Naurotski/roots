<template>
  <div>
    <q-card-section class="row">
      <div class="text-h4">{{ $t('auth.logIn') }}</div>
      <q-space />
      <q-btn icon="close" flat round dense @click="$emit('closeDialog')" />
    </q-card-section>
  </div>
</template>

<script>
export default {
  name: 'RegistrationUser',
  emits: ['closeDialog']
}
</script>

<style scoped></style>
