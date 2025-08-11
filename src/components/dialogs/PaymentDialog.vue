<template>
  <slot>
    <q-btn
      no-caps
      outline
      rounded
      :class="{ 'full-width': $q.screen.xs }"
      :label="$t('common.buyArt')"
      style="width: 150px"
      @click="updatePaymentDialogActivator(true)"
    />
  </slot>
  <q-dialog
    v-model="paymentDialogActivator"
    persistent
    :maximized="$q.screen.xs"
    :transition-show="$q.screen.xs ? 'slide-up' : 'fade'"
    :transition-hide="$q.screen.xs ? 'slide-down' : 'fade'"
  >
    <q-card style="max-width: 900px; border-radius: 25px">
      <q-toolbar class="q-pt-md">
        <q-toolbar-title class="text-h5" style="white-space: normal !important">
          {{ works.map((item) => item.name).join(', ') }}
        </q-toolbar-title>
        <q-btn flat round icon="close" @click="closeDialog" />
      </q-toolbar>
      <q-card-section>
        <div class="text-body1">
          {{ `€ ${works.reduce((result, item) => result + +item.price, 0)}` }}
        </div>
      </q-card-section>
      <q-separator color="negative" class="q-mx-lg" />
      <q-card-section class="text-body1">
        <div style="white-space: pre-line" class="text-body1">
          {{ $t('dialoguePayment.delivery') }}
          <!--          <router-link style="color: black" to="/termsSale">{{ $t('auth.termsSale') }}</router-link-->
          <!--          >.-->
        </div>
      </q-card-section>

      <form-user-data v-model="user" @submitForm="onSubmit">
        <template #default>
          <!--          <q-card-section class="text-body1">-->
          <!--            {{ $t('dialoguePayment.redirect') }}-->
          <!--          </q-card-section>-->
          <div class="q-ml-md">
            <template v-if="$i18n.locale === 'en'">
              By purchasing an artwork online, you agree to the
              <router-link to="/termsSale" class="text-primary">terms of sale</router-link>
              and the
              <router-link to="/privacy" class="text-primary">privacy policy</router-link>.
            </template>

            <template v-else-if="$i18n.locale === 'it'">
              Acquistando un biglietto online, accetti il
              <router-link to="/rules" class="text-primary">condizioni di vendita</router-link>
              e la
              <router-link to="/privacy" class="text-primary">privacy policy</router-link>.
            </template>
          </div>
        </template>
        <template #btn>
          <q-btn
            class="q-mx-md bg-grey"
            outline
            rounded
            :label="$t('common.close')"
            @click="closeDialog"
            color="white"
          />
        </template>
      </form-user-data>
    </q-card>
  </q-dialog>
  <login-required-dialog
    v-model="requiredDialog"
    :auth-provider="authProvider"
    :email="user.email || ''"
    @allowPayment="onSubmit"
  />
</template>

<script>
import { computed, ref, toRefs, watch } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'
import { useUserStore } from 'stores/user-store.js'
import { useStripeStore } from 'stores/stripe-store.js'
import LoginRequiredDialog from 'components/auth/LoginRequiredDialog.vue'
import FormUserData from 'components/shared/FormUserData.vue'

export default {
  name: 'PaymentDialog',
  components: {
    LoginRequiredDialog,
    FormUserData
  },
  props: {
    works: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const $q = useQuasar()
    const route = useRoute()
    const { works } = toRefs(props)
    const { locale } = useI18n({ useScope: 'global' })
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const { checkUserExistence } = authStore
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const { updateUser } = userStore
    const stripeStore = useStripeStore()
    const { paymentDialogActivator, shippingDetails } = toRefs(stripeStore)
    const { updatePaymentDialogActivator, changeShippingDetails } = stripeStore
    const { payStripe } = stripeStore
    const requiredDialog = ref(false)
    const authProvider = ref([])
    const user = ref({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      country: null,
      postalCode: '',
      phone: '',
      taxId: null
    })
    const closeDialog = () => {
      updatePaymentDialogActivator(false)
    }
    const description = (work) => {
      if (locale.value === 'it') {
        return !work.descriptionIt
          ? 'Nessuna descrizione'
          : work.descriptionIt.length < 200
          ? work.descriptionIt
          : `${work.descriptionIt?.substring(0, 200)}...`
      } else {
        return !work.description
          ? 'No description'
          : work.description.length < 200
          ? work.description
          : `${work.description?.substring(0, 200)}...`
      }
    }
    const images = (work) => {
      if (String(work.id).includes('-')) {
        return [
          work.urlImage || work.urlImageWork,
          ...(work.urlSecondImages || work.urlSecondImagesWork || []).map((item) => item.url)
        ].splice(0, 5)
      } else if (work.targetHeight && !work.urlImageWork) {
        return [
          'https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/admin%2FARTStub.png?alt=media&token=5bba4148-3dba-46ce-8204-0ad7bfb317b3'
        ]
      } else {
        return [work.urlImageWork || work.url, ...(work.urlSecondImagesWork || [])].splice(0, 5)
      }
    }
    const line_items = computed(() =>
      works.value.map((work) => {
        return {
          quantity: work.quantityCart || 1,
          price_data: {
            currency: 'eur',
            unit_amount: work.price * 100,
            product_data: {
              name: locale.value === 'it' ? work.nameIt : work.name,
              description: description(work),
              images: images(work),
              metadata: {
                id: work.id || work.galleryElementId,
                artistId: work.artistId || null,
                rubric: work.rubric || null,
                artistName: work.artistName || null,
                galleryId: work.galleryId || null,
                typeStore: work.typeStore || null,
                galleryElementId: work.galleryElementId || null
              }
            }
          }
        }
      })
    )
    watch(
      userData,
      (val) => {
        if (!val.email) {
          user.value = {}
        } else {
          user.value.firstName ||= val.firstName || val.displayName || ''
          user.value.lastName ||= val.lastName || ''
          user.value.email ||= val.email || ''
          user.value.address ||= val.address || ''
          user.value.city ||= val.city || ''
          user.value.country ||= val.country || null
          user.value.postalCode ||= val.postalCode || ''
          user.value.phone ||= val.phone || ''
          user.value.taxId ||= val.taxId || null
        }
      },
      { immediate: true, deep: true }
    )
    const onSubmit = async () => {
      console.log('onSubmit ----user.value---', user.value)
      changeShippingDetails({ ...user.value })
      if (!loggedIn.value) {
        authProvider.value = await checkUserExistence(user.value.email)
        requiredDialog.value = true
      } else {
        if ($q.localStorage.getItem('cart')) {
          updatePaymentDialogActivator(false)
        } else {
          const diffObj = Object.keys(user.value).reduce((result, key) => {
            if (!(key in userData.value)) result[key] = user.value[key]
            return result
          }, {})
          console.log('diffObj ----', diffObj)
          if (Object.keys(diffObj).length) {
            await updateUser({
              path: `users/${userData.value.userId}/userData`,
              payload: diffObj
            })
          }
          console.log('shippingDetails-----', shippingDetails.value)
          console.log('line_items-----', line_items.value)
          await payStripe({
            cancel_url: route.path,
            line_items: line_items.value,
            mode: 'payment',
            metadata: {
              ...shippingDetails.value,
              country: shippingDetails.value.country.countryName,
              shippingEmail: shippingDetails.value.email,
              works: true
            },
            userData: {
              userId: userData.value.userId,
              email: userData.value.email,
              firstName: userData.value.firstName,
              lastName: userData.value.lastName,
              phone: userData.value.phone,
              city: userData.value.city,
              country: userData.value.country,
              address: userData.value.address,
              postalCode: userData.value.postalCode,
              taxId: userData.value.taxId || null
            }
          })
          changeShippingDetails({})
        }
      }
    }
    return {
      paymentDialogActivator,
      requiredDialog,
      authProvider,
      user,
      userData,
      updatePaymentDialogActivator,
      closeDialog,
      onSubmit
    }
  }
}
</script>

<style scoped></style>
