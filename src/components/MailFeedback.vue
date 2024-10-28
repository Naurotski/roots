<template>
  <form @submit.prevent="submitForm" class="row q-col-gutter-xs">
    <q-input
      ref="name"
      v-model="formData.name"
      class="col-12 col-sm-6"
      lazy-rules
      :label="$t('common.yourName')"
      dense
      outlined
      stack-label
      autocomplete="given-name"
      :rules="[
        (val) => (val && val.length > 0) || 'Please type something',
        (v) => v.length <= 30 || 'Not more than 30 characters'
      ]"
    />
    <q-input
      ref="email"
      v-model="formData.email"
      class="col-12 col-sm-6"
      type="email"
      lazy-rules
      :label="$t('common.yourEmail')"
      dense
      outlined
      stack-label
      autocomplete="email"
      :rules="[(val) => isValidEmailAddress(val) || 'Please enter a valid email address.']"
    />
    <q-input
      v-model="formData.title"
      type="text"
      class="col-12"
      lazy-rules
      :label="$t('common.title')"
      dense
      outlined
      stack-label
      :rules="[
        (val) => (val && val.length > 0) || 'Please type something',
        (v) => v.length <= 30 || 'Not more than 30 characters'
      ]"
    />
    <q-input
      ref="email"
      v-model="formData.message"
      class="col-12"
      type="textarea"
      lazy-rules
      :label="$t('common.yourMessage')"
      dense
      outlined
      stack-label
      :rules="[
        (val) => (val && val.length > 0) || 'Please type something',
        (v) => v.length <= 5000 || 'Not more than 5000 characters'
      ]"
    />
    <q-btn
      no-caps
      rounded
      color="black"
      class="q-mt-xs full-width"
      :label="$t('common.sendMessage')"
      type="submit"
    ></q-btn>
  </form>
</template>

<script>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'stores/user-store'
import { useSharedStore } from 'stores/shared-store'
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress'

export default {
  name: 'MailFeedback',
  setup() {
    const $q = useQuasar()
    const { t } = useI18n()
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const sharedStore = useSharedStore()
    const { sendMailFeedback } = sharedStore
    const name = ref(null)
    const email = ref(null)
    const formData = ref({})
    watch(
      userData,
      (val) => {
        formData.value.name =
          val.firstName && val.lastName
            ? `${val.firstName} ${val.lastName}`
            : userData.value.displayName || ''
        formData.value.email = val.email || ''
        formData.value.title = ''
        formData.value.message = ''
      },
      { immediate: true, deep: true }
    )
    const submitForm = () => {
      console.log('submitForm')
      name.value.validate()
      email.value.validate()
      if (!email.value.hasError && !name.value.hasError) {
        console.log(formData.value)
        sendMailFeedback(formData.value).then(() => {
          $q.notify({
            message: t('common.sentMessage'),
            color: 'grey'
          })
          formData.value.title = ''
          formData.value.message = ''
        })
      }
    }
    return {
      name,
      email,
      formData,
      isValidEmailAddress,
      submitForm
    }
  }
}
</script>

<style scoped></style>
