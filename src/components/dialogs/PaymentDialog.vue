<template>
  <q-btn :label="$t('common.buy')" @click="activator = true" />
  <q-dialog v-model="activator" persistent>
    <q-card style="max-width: 900px; border-radius: 25px">
      <q-toolbar class="q-pt-md">
        <q-toolbar-title class="text-h5">
          {{ work.name }}
        </q-toolbar-title>
        <q-btn flat round icon="close" @click="closeDialog" />
      </q-toolbar>
      <q-card-section>
        <div class="text-body1">{{ `€ ${work.price}` }}</div>
      </q-card-section>
      <q-card-section class="text-body1">
        <div style="white-space: pre-line" class="text-body1">
          {{ $t('dialoguePayment.delivery') }}
        </div>
      </q-card-section>

      <q-form ref="paymentForm" @submit.prevent="onSubmit" class="row justify-center">
        <q-card-section class="col-12 col-sm-4">
          <q-input
            v-model="user.firstName"
            clearable
            :label="$t('dialoguePayment.firstName')"
            lazy-rules
            autocomplete="given-name"
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
              (v) => v.length <= 30 || 'Not more than 30 characters'
            ]"
          />
        </q-card-section>
        <q-card-section class="col-12 col-sm-4">
          <q-input
            v-model="user.lastName"
            clearable
            :label="$t('dialoguePayment.lastName')"
            lazy-rules
            autocomplete="family-name"
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
              (v) => v.length <= 30 || 'Not more than 30 characters'
            ]"
          />
        </q-card-section>
        <q-card-section class="col-12 col-sm-4">
          <q-input
            v-model="user.email"
            clearable
            label="Email"
            type="email"
            lazy-rules
            autocomplete="email"
            :rules="[(val) => isValidEmailAddress(val) || 'Please enter a valid email address.']"
          />
        </q-card-section>
        <q-card-section class="col-12 col-sm-4">
          <q-select
            v-model="user.country"
            :options="options"
            option-value="countryName"
            option-label="countryName"
            :label="$t('dialoguePayment.country')"
            options-dense
            emit-value
            use-input
            input-debounce="0"
            @filter="filterFn"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please choose something']"
          />
        </q-card-section>
        <q-card-section class="col-12 col-sm-4">
          <q-input
            clearable
            v-model="user.postalCode"
            :label="$t('dialoguePayment.postalCode')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
              (v) => v.length <= 30 || 'Not more than 30 characters'
            ]"
          />
        </q-card-section>
        <q-card-section class="col-12 col-sm-4">
          <q-input
            clearable
            v-model="user.city"
            :label="$t('dialoguePayment.city')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
              (v) => v.length <= 30 || 'Not more than 30 characters'
            ]"
          />
        </q-card-section>
        <q-card-section class="col-12 col-sm-4">
          <q-input
            clearable
            v-model="user.address"
            :label="$t('dialoguePayment.address')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
              (v) => v.length <= 30 || 'Not more than 30 characters'
            ]"
          />
        </q-card-section>
        <q-card-section class="col-12 col-sm-4">
          <q-input
            clearable
            v-model="user.phone"
            type="tel"
            :label="$t('dialoguePayment.phone')"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
              (v) => isValidPhone(v) || 'Please enter a valid phone number'
            ]"
          />
        </q-card-section>
        <q-card-section v-if="user.country === 'Italy'" class="col-12 col-sm-4">
          <q-input
            clearable
            v-model="user.codiceFiscale"
            type="tel"
            label="codice fiscale"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
              (v) => v.length <= 30 || 'Not more than 30 characters'
            ]"
          />
        </q-card-section>
        <q-card-section class="text-body1">
          {{ $t('dialoguePayment.redirect') }}
        </q-card-section>
        <q-card-section class="row justify-end" style="width: 100%">
          <q-btn class="q-mx-md" :label="$t('common.close')" @click="closeDialog" color="grey" />
          <q-btn :label="$t('common.buy')" type="submit" color="primary" />
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
  <login-required-dialog
    v-model="requiredDialog"
    :auth-provider="authProvider"
    :email="user.email"
    @allowPayment="onSubmit"
  />
</template>

<script>
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress.js'
import { ref, toRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store.js'
import { useUserStore } from 'stores/user-store.js'
import { useStripeStore } from 'stores/stripe-store.js'
import { useSharedStore } from 'stores/shared-store.js'
import LoginRequiredDialog from 'components/auth/LoginRequiredDialog.vue'
import { isValidPhone } from 'src/composables/isValidPhone.js'
export default {
  name: 'PayDialog',
  components: {
    LoginRequiredDialog
  },
  props: {
    work: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { work } = toRefs(props)
    console.log(work)
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const { checkUserExistence } = authStore
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const { updateUser } = userStore
    const stripeStore = useStripeStore()
    const { deliveryData } = toRefs(stripeStore)
    const { changeDeliveryData } = stripeStore
    // const { payStripe } = stripeStore
    const sharedStore = useSharedStore()
    const { sortedCountries } = storeToRefs(sharedStore)
    const { getCountries } = sharedStore
    if (!sortedCountries.value.length) getCountries()
    console.log(updateUser)
    const options = ref(sortedCountries.value)
    const activator = ref(false)
    const requiredDialog = ref(false)
    const authProvider = ref([])

    const user = ref({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      phone: '',
      codiceFiscale: ''
    })
    const closeDialog = () => {
      activator.value = !activator.value
    }
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
          user.value.country ||= val.country || ''
          user.value.postalCode ||= val.postalCode || ''
          user.value.phone ||= val.phone || ''
          user.value.codiceFiscale ||= val.codiceFiscale || ''
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      () => user.value.country,
      (val) => {
        if (
          !user.value.phone ||
          sortedCountries.value.some((elem) => elem.callingCode === user.value.phone)
        ) {
          user.value.phone = sortedCountries.value.find(
            (elem) => elem.countryName === val
          )?.callingCode
        }
      }
    )
    const filterFn = (val, update) => {
      update(() => {
        const needle = val.toLowerCase()
        options.value = sortedCountries.value.filter(
          (item) => item.countryName.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    const onSubmit = async () => {
      changeDeliveryData({ ...user.value })
      if (!loggedIn.value) {
        authProvider.value = await checkUserExistence(user.value.email)
        requiredDialog.value = true
      } else {
        const diffObj = Object.keys(user.value).reduce((result, key) => {
          if (!(key in userData.value)) result[key] = user.value[key]
          return result
        }, {})
        console.log(diffObj)
        console.log(Object.keys(diffObj).length)
        if (Object.keys(diffObj).length) {
          console.log('============================')
          await updateUser({
            path: `users/${userData.value.userId}`,
            payload: diffObj
          })
        }
        console.log('userData.value =====', userData.value)
        console.log('deliveryData.value =====', deliveryData.value)
        console.log('user =====', user.value)
        activator.value = false
      }
      // payStripe({
      //   id: work.value.id,
      //   name: work.value.name,
      //   description: work.value.description,
      //   email: user.email,
      //   images: work.value.urlImageWork,
      //   amount: work.value.price * 100,
      //   currency: 'eur',
      //   quantity: 1,
      //   dataUser: userData.value,
      //   metadata: {
      //     name: work.value.name,
      //     studioId: work.value.id,
      //     typeExercise: 'work',
      //     titleStudiosPrice: work.value.artistId,
      //     workIndex: work.value.index
      //   }
      // })
      changeDeliveryData({})
    }

    return {
      activator,
      requiredDialog,
      authProvider,
      user,
      sortedCountries,
      getCountries,
      options,
      isValidPhone,
      isValidEmailAddress,
      closeDialog,
      filterFn,
      onSubmit
    }
  }
}
</script>

<style scoped></style>
