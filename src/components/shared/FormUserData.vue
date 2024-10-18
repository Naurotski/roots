<template>
  <q-form ref="paymentForm" @submit.prevent="$emit('submitForm')" class="row justify-center">
    <q-card-section class="col-12 col-sm-4">
      <q-input
        v-model="user.firstName"
        dense
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
        dense
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
    <q-card-section v-if="$route.name !== 'Your Account'" class="col-12 col-sm-4">
      <q-input
        v-model="user.email"
        dense
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
        dense
        option-label="countryName"
        :label="$t('dialoguePayment.country')"
        options-dense
        emit-value
        use-input
        input-debounce="0"
        @filter="filterFn"
        lazy-rules
        :rules="[(val) => (val && val.countryName.length > 0) || 'Please choose something']"
        ><template v-slot:prepend
          ><span>{{ user.country?.flag }}</span></template
        ></q-select
      >
    </q-card-section>
    <q-card-section class="col-12 col-sm-4">
      <q-input
        v-model="user.postalCode"
        dense
        clearable
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
        v-model="user.city"
        dense
        clearable
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
        v-model="user.address"
        dense
        clearable
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
        v-model="user.phone"
        dense
        clearable
        type="tel"
        :label="$t('dialoguePayment.phone')"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please type something',
          (v) => isValidPhone(v) || 'Please enter a valid phone number'
        ]"
      />
    </q-card-section>
    <q-card-section v-if="user.country?.countryName === 'Italy'" class="col-12 col-sm-4">
      <q-input
        v-model="user.taxId"
        dense
        clearable
        type="text"
        label="Codice Fiscale"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please type something',
          (v) => v.length <= 30 || 'Not more than 30 characters'
        ]"
      />
    </q-card-section>
    <slot />
    <q-card-section class="row justify-end" style="width: 100%">
      <slot name="btn" />
      <q-btn
        :disable="deepEqual"
        :label="$route.name === 'Your Account' ? $t('common.save') : $t('common.buy')"
        type="submit"
        color="primary"
      />
    </q-card-section>
  </q-form>
</template>
<script>
import { toRefs, computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSharedStore } from 'stores/shared-store'
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress'
import { isValidPhone } from 'src/composables/isValidPhone'

export default {
  name: 'FormUserData',
  props: {
    modelValue: {
      type: Object,
      require: true
    },
    deepEqual: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['update:modelValue', 'submitForm'],
  setup(props, { emit }) {
    const sharedStore = useSharedStore()
    const { sortedCountries } = storeToRefs(sharedStore)
    const { getCountries } = sharedStore
    if (!sortedCountries.value.length) getCountries()
    const options = ref(sortedCountries.value)
    const { modelValue } = toRefs(props)
    const user = computed({
      get() {
        return modelValue.value
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    watch(
      () => user.value.country,
      (val) => {
        if (
          !user.value.phone ||
          sortedCountries.value.some((elem) => elem.callingCode === user.value.phone)
        ) {
          user.value.phone = user.value.country?.callingCode
        }
        if (val.countryName !== 'Italy') {
          user.value.taxId = ''
        }
      },
      { deep: true }
    )
    const filterFn = (val, update) => {
      update(() => {
        const needle = val.toLowerCase()
        options.value = sortedCountries.value.filter(
          (item) => item.countryName.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    return {
      options,
      user,
      isValidEmailAddress,
      isValidPhone,
      filterFn
    }
  }
}
</script>

<style scoped></style>
