<template>
  <q-btn-dropdown auto-close stretch flat :label="locale">
    <q-list>
      <q-item
        v-for="{ value, label } in localeOptions"
        :key="label"
        clickable
        :active="locale === value"
        active-class="bg-teal-1"
        v-close-popup
        @click="locale = value"
      >
        <q-item-section>{{ label }}</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { useI18n } from 'vue-i18n'
export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale } = useI18n({ useScope: 'global' })

    return {
      locale,
      localeOptions: [
        { value: 'en', label: 'En' },
        { value: 'it', label: 'It' }
      ]
    }
  }
}
</script>

<style scoped></style>
