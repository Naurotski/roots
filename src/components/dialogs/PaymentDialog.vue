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
        <div class="text-body1">{{ $t('dialoguePayment.delivery') }}</div>
      </q-card-section>

      <q-form ref="paymentForm" @submit.prevent="onSubmit" class="row justify-center">
        <q-card-section class="col-12 col-sm-4">
          <q-input
            clearable
            v-model="user.firstName"
            :label="$t('dialoguePayment.firstName')"
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
            v-model="user.lastName"
            :label="$t('dialoguePayment.lastName')"
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
            v-model="user.email"
            label="Email"
            lazy-rules
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
import { reactive, ref, toRefs } from 'vue'
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
    const { work } = toRefs(props)
    const stripeStore = useStripeStore()
    const { payStripe } = stripeStore
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
    const onSubmit = () => {
      payStripe({
        id: work.value.id,
        name: work.value.name,
        description: work.value.description,
        email: user.email,
        images: work.value.urlImageWork,
        amount: work.value.price * 100,
        currency: 'eur',
        quantity: 1,
        dataUser: user,
        metadata: {
          name: work.value.name,
          studioId: work.value.id,
          typeExercise: 'work',
          titleStudiosPrice: work.value.id
        }
      })
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
