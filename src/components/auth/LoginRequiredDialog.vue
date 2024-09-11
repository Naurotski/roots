<template>
  <q-dialog
    v-model="dialog"
    persistent
    :position="$q.screen.xs ? 'bottom' : 'standard'"
    @hide="closeDialog"
  >
    <q-card style="min-width: 350px; border-radius: 25px">
      <q-card-actions>
        <div class="text-h6">{{ $t('common.attention') }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-actions>
      <div>
        <q-card-section>
          <div class="text-center">
            {{ textMessage }}
          </div>
        </q-card-section>
        <q-card-section v-if="authProvider[0] === 'password'" class="q-pt-none">
          <form>
            <q-input
              ref="pass"
              v-model="password"
              lazy-rules
              type="password"
              label="Password"
              dense
              outlined
              stack-label
              autofocus
              autocomplete="current-password"
              :rules="[(val) => val.length >= 6 || 'Please enter at least 6 characters.']"
            />
          </form>
        </q-card-section>
        <q-card-section v-if="authProvider[0] === 'google.com'">
          <google-button @click="loginGoogle" />
        </q-card-section>
      </div>
      <q-card-actions align="right" class="text-primary">
        <q-btn
          v-if="authProvider[0] !== 'google.com'"
          flat
          :label="$t('common.continue')"
          @click="continueBuy"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, toRefs, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/auth-store.js'
import GoogleButton from 'components/auth/GoogleButton.vue'
export default {
  name: 'LoginRequiredDialog',
  components: {
    GoogleButton
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    authProvider: {
      type: Array,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'allowPayment'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const { modelValue, authProvider, email } = toRefs(props)
    const authStore = useAuthStore()
    const { loginUser, logInGoogle, showLoginDialog } = authStore
    const textMessage = ref('')
    const pass = ref(null)
    const password = ref('')
    const dialog = computed({
      get() {
        return modelValue.value
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    watch(authProvider, (val) => {
      switch (val[0]) {
        case 'password':
          textMessage.value = t('dialoguePayment.loginRequired')
          break
        case 'google.com':
          textMessage.value = t('dialoguePayment.loginRequired')
          break
        default:
          textMessage.value = t('dialoguePayment.registrationRequired')
      }
    })
    const continueBuy = async () => {
      console.log(authProvider.value)
      if (!authProvider.value.length) {
        showLoginDialog(true)
        emit('update:modelValue', false)
      }
      if (authProvider.value[0] === 'password') {
        pass.value.validate()
        if (!pass.value.hasError) {
          const resultPassword = await loginUser({ email: email.value, password: password.value })
          if (resultPassword) {
            emit('update:modelValue', false)
            emit('allowPayment')
          }
        }
      }
    }
    const loginGoogle = async () => {
      const resultGoogle = await logInGoogle()
      if (resultGoogle) {
        emit('update:modelValue', false)
        emit('allowPayment')
      }
    }
    const closeDialog = () => {
      textMessage.value = ''
      password.value = ''
    }
    return {
      dialog,
      pass,
      password,
      textMessage,
      continueBuy,
      loginGoogle,
      closeDialog
    }
  }
}
</script>

<style scoped></style>
