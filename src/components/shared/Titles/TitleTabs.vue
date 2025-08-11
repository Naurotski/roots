<template>
  <fixed-top-title :name="nameTitle">
    <template #button>
      <q-btn class="lt-sm q-mr-md" flat dense icon="menu" aria-label="Menu">
        <q-menu auto-close>
          <q-list style="min-width: 100px">
            <q-item
              clickable
              v-for="{ label, name } in links"
              @click="$emit('update:modelValue', name)"
              :key="name"
            >
              <q-item-section>{{ $t(label) }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </template>
    <q-separator class="lt-sm" />
    <span class="q-ml-lg lt-sm text-h5">{{ $t(`links.${tab}`) }}</span>
    <div class="row justify-md-start">
      <q-tabs v-model="tab" dense narrow-indicator class="gt-xs">
        <q-tab
          class="text-body1"
          v-for="{ label, name } in links"
          :key="name"
          :name="name"
          :label="$t(label)"
        />
      </q-tabs>
    </div>
  </fixed-top-title>
</template>

<script>
import { computed, toRefs } from 'vue'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'

export default {
  name: 'TitleTabs',
  components: { FixedTopTitle },
  props: {
    nameTitle: {
      type: String,
      required: true
    },
    links: {
      type: Object,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)
    const tab = computed({
      get() {
        return modelValue.value
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    return {
      tab
    }
  }
}
</script>

<style scoped></style>
