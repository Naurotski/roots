<template>
  <div
    class="text-body2 text-italic cursor-pointer"
    style="text-decoration: underline"
    v-text="localData.address ? $t('cart.changeAddress') : $t('cart.addAddress')"
    @click="activator = true"
  />
  <q-dialog
    v-model="activator"
    persistent
    :maximized="$q.screen.xs"
    :transition-show="$q.screen.xs ? 'slide-up' : 'fade'"
    :transition-hide="$q.screen.xs ? 'slide-down' : 'fade'"
  >
    <q-card style="max-width: 900px; border-radius: 25px">
      <div class="q-mb-md bg-white" style="position: sticky; top: 0; z-index: 10">
        <q-toolbar class="q-pt-md">
          <q-toolbar-title class="text-h5">{{ $t('cart.deliveryDetails') }}</q-toolbar-title>
          <q-btn flat round icon="close" @click="activator = false" />
        </q-toolbar>
        <q-separator color="negative" class="q-mx-lg" />
      </div>
      <form-user-data v-model="localData" @submitForm="onSubmit" />
    </q-card>
  </q-dialog>
</template>
<script>
import { computed, toRefs } from 'vue'
import { useSharedStore } from 'stores/shared-store'
import FormUserData from 'components/shared/FormUserData.vue'
import { storeToRefs } from 'pinia'

export default {
  name: 'DeliveryDetailsDialog',
  components: { FormUserData },
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'savaDelivery'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)
    const sharedStore = useSharedStore()
    const { deliveryDetailsDialogActivator } = storeToRefs(sharedStore)
    const { toggleDeliveryDetailsDialogActivator } = sharedStore
    const localData = computed({
      get() {
        return modelValue.value
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    const activator = computed({
      get() {
        return deliveryDetailsDialogActivator.value
      },
      set() {
        toggleDeliveryDetailsDialogActivator()
      }
    })
    const onSubmit = async () => {
      emit('savaDelivery')
      activator.value = false
    }
    return {
      activator,
      localData,
      onSubmit
    }
  }
}
</script>

<style scoped></style>
