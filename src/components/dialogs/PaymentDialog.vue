<template>
  <q-btn :label="$t('common.buy')" @click="activator = true" />
  <q-dialog v-model="activator" persistent>
    <q-card style="max-width: 900px">
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
          <q-input
            clearable
            v-model="user.country"
            :label="$t('dialoguePayment.country')"
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
            class="col-12 col-sm-6"
            v-model="user.phone"
            :label="$t('dialoguePayment.phone')"
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
    <!--    <q-card style="min-width: 350px">-->
    <!--      <q-card-section>-->
    <!--        <div class="text-h6">Your address</div>-->
    <!--      </q-card-section>-->
    <!--      <q-card-section class="q-pt-none">-->
    <!--        <q-input dense v-model="address" autofocus @keyup.enter="prompt = false" />-->
    <!--      </q-card-section>-->
    <!--      <q-card-actions align="right" class="text-primary">-->
    <!--        <q-btn flat label="Cancel" v-close-popup />-->
    <!--        <q-btn flat label="Add address" v-close-popup />-->
    <!--      </q-card-actions>-->
    <!--    </q-card>-->
  </q-dialog>
</template>

<script>
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress.js'
import { reactive, ref, toRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store.js'
import { useStripeStore } from 'stores/stripe-store.js'
export default {
  name: 'PayDialog',
  props: {
    work: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const $q = useQuasar()
    const { work } = toRefs(props)
    console.log(work)
    const authStore = useAuthStore()
    const { loggedIn, userData } = storeToRefs(authStore)
    const { updateUser } = authStore
    const stripeStore = useStripeStore()
    const { payStripe } = stripeStore
    console.log(payStripe)
    console.log(updateUser)
    const activator = ref(false)
    const user = reactive({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      phone: ''
    })
    const closeDialog = () => {
      activator.value = !activator.value
    }
    watch(
      userData,
      (val) => {
        user.firstName = val.firstName || val.displayName || ''
        user.lastName = val.lastName || ''
        user.email = val.email || ''
        user.address = val.address || ''
        user.city = val.city || ''
        user.country = val.country || ''
        user.postalCode = val.postalCode || ''
        user.phone = val.phone || ''
      },
      { immediate: true, deep: true }
    )
    const onSubmit = () => {
      if (!loggedIn.value) {
        console.log('-------------------------------')
        $q.dialog({
          title: 'Attention!!!',
          message: 'Are you sure you want to delete?',
          cancel: true,
          persistent: true,
          position: 'bottom'
        }).onOk(async () => {
          console.log('+++++++++++++++++++++++++')
        })
      } else {
        console.log(userData.value)
        console.log(user)
        console.log(userData.value === user)
        // updateUser({ path: `users/${userData.value.userId}`, payload: user })
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
      //   dataUser: user,
      //   metadata: {
      //     name: work.value.name,
      //     studioId: work.value.id,
      //     typeExercise: 'work',
      //     titleStudiosPrice: work.value.artistId,
      //     workIndex: work.value.index
      //   }
      // })
      activator.value = !activator.value
    }
    return {
      activator,
      user,
      isValidEmailAddress,
      closeDialog,
      onSubmit
    }
  }
}
</script>

<style scoped></style>
