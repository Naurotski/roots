<template>
  <q-form ref="paymentForm" @submit.prevent="$emit('submitForm')" class="row justify-center">
    <div class="col-12 col-sm-4 q-px-md">
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
    </div>
    <div class="col-12 col-sm-4 q-px-md">
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
    </div>
    <div v-if="$route.name !== 'Your Account'" class="col-12 col-sm-4 q-px-md">
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
    </div>
    <div class="col-12 col-sm-4 q-px-md">
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
        lazy-rules
        @filter="filterFn"
        @focus="getAllCountries"
        :rules="[(val) => (val && val.countryName.length > 0) || 'Please choose something']"
        ><template v-slot:prepend
          ><span>{{ user.country?.flag }}</span></template
        ></q-select
      >
    </div>
    <div v-if="optionsState.length || user.state" class="col-12 col-sm-4 q-px-md">
      <q-select
        v-model="user.state"
        :options="optionsState"
        dense
        option-label="name"
        :label="$t('dialoguePayment.state')"
        options-dense
        emit-value
        use-input
        input-debounce="0"
        lazy-rules
        @filter="filterFn"
        @focus="getAllCountries"
        :rules="[(val) => (val && val.name.length > 0) || 'State choose something']"
      ></q-select>
    </div>
    <div class="col-12 col-sm-4 q-px-md">
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
    </div>
    <div class="col-12 col-sm-4 q-px-md">
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
    </div>
    <div class="col-12 col-sm-4 q-px-md">
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
    </div>
    <div class="col-12 col-sm-4 q-px-md">
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
    </div>
    <div v-if="user.country?.countryName === 'Italy'" class="col-12 col-sm-4 q-px-md">
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
    </div>
    <slot />
    <q-card-section class="row justify-end" style="width: 100%">
      <slot name="btn" />
      <q-btn
        no-caps
        outline
        rounded
        class="full-width q-mt-sm"
        :disable="deepEqual"
        :label="
          $route.name === 'Your Account' || $route.name === 'Basket'
            ? $t('common.save')
            : $t('common.buy')
        "
        type="submit"
      />
    </q-card-section>
  </q-form>
</template>
<script>
import { toRefs, computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSharedStore } from 'stores/shared-store'
import { useMerchStore } from 'stores/merch-store'
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress'
import { isValidPhone } from 'src/composables/isValidPhone'

export default {
  name: 'FormUserData',
  props: {
    modelValue: {
      type: Object,
      required: true
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
    const merchStore = useMerchStore()
    const { printFulCountries } = storeToRefs(merchStore)
    const { printFul } = merchStore
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
    const optionsState = computed(() => {
      return (
        printFulCountries.value.find((item) => item.code === user.value.country?.cca2)?.states || []
      )
    })
    watch(
      () => user.value.country,
      (val, oldValue) => {
        if (val) {
          if (
            !user.value.phone ||
            sortedCountries.value.some((elem) => elem.callingCode === user.value.phone)
          ) {
            user.value.phone = user.value.country?.callingCode
          }
          if (val.countryName !== 'Italy') {
            user.value.taxId = ''
          }
          if (oldValue && oldValue.countryName !== val.countryName) {
            user.value.state = ''
          }
        }
      },
      { deep: true }
    )
    const getAllCountries = async () => {
      if (!sortedCountries.value.length) await getCountries()
      if (!printFulCountries.value.length) await printFul('/countries')
    }
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
      optionsState,
      isValidEmailAddress,
      isValidPhone,
      getAllCountries,
      filterFn
    }
  }
}
</script>

<style scoped></style>
