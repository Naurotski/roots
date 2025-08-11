<template>
  <form class="row justify-center">
    <q-input
      ref="inputText"
      v-model="text"
      rounded
      dense
      outlined
      clearable
      class="col-12 col-sm-4"
      label="Email"
      type="email"
      lazy-rules
      autocomplete="email"
      :rules="rules"
    >
      <template v-slot:append>
        <q-btn
          class="q-mx-xs"
          v-if="text !== originalText"
          @click="text = originalText"
          color="grey"
          size="xs"
          dense
          round
          icon="fa-solid fa-reply"
        />
        <q-btn
          v-if="text !== originalText"
          @click="$emit('onSubmit')"
          color="primary"
          size="md"
          dense
          flat
          :label="$t('common.save')"
        />
      </template>
    </q-input>
  </form>
</template>
<script>
import { computed, toRefs, ref } from 'vue'
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress'
export default {
  name: 'InputUniversal',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    originalText: {
      type: String,
      default: () => ''
    },
    typeRules: {
      type: String
    }
  },
  emits: ['update:modelValue', 'onSubmit'],
  setup(props, { emit }) {
    const { modelValue, typeRules } = toRefs(props)
    const inputText = ref(null)
    const text = computed({
      get() {
        return modelValue.value
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })
    const rules = computed(() => {
      if (typeRules.value === 'email') {
        return [(val) => isValidEmailAddress(val) || 'Please enter a valid email address.']
      } else {
        return []
      }
    })
    return {
      inputText,
      text,
      rules
    }
  }
}
</script>

<style scoped></style>
