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
      <q-toolbar class="q-pt-md">
        <q-toolbar-title class="text-h5">{{ $t('cart.deliveryDetails') }}</q-toolbar-title>
        <q-btn flat round icon="close" @click="activator = false" />
      </q-toolbar>

      <form-user-data v-model="localData" @submitForm="onSubmit">
        <template #btn>
          <q-btn
            class="q-mx-md bg-grey"
            outline
            rounded
            :label="$t('common.close')"
            @click="activator = false"
            color="white"
          />
        </template>
      </form-user-data>
    </q-card>
  </q-dialog>
</template>
<script>
import { computed, ref, toRefs } from 'vue'

import FormUserData from 'components/shared/FormUserData.vue'

export default {
  name: 'DeliveryDetailsDialog',
  components: { FormUserData },
  props: {
    modelValue: {
      type: Object,
      require: true
    }
  },
  emits: ['update:modelValue', 'savaDelivery'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)
    const activator = ref(false)
    const localData = computed({
      get() {
        return modelValue.value
      },
      set(value) {
        emit('update:modelValue', value)
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
