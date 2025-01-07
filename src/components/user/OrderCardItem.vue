<template>
  <div class="row q-my-xs">
    <div class="col-3 relative-position flex flex-center">
      <q-img
        :src="item.urlImageWork"
        :alt="item.name"
        fit="contain"
        :style="$q.screen.xs ? 'max-height: 150px' : 'height: 150px'"
      ></q-img>
      <q-badge
        v-if="item.quantity && item.quantity !== 1"
        class="absolute shadow-3 glossy my-badge-class"
        color="grey"
        style="bottom: 15px"
        :style="$q.screen.xs ? 'right: 15px' : 'right: 55px'"
        >{{ item.quantity }}</q-badge
      >
    </div>
    <div class="col-9 q-px-xs column">
      <div :class="{ 'text-subtitle2': $q.screen.xs }" class="text-h6 text-bold">
        {{ item.name }}
      </div>
      <div :class="{ 'text-body2': $q.screen.xs }" class="text-justify text-body1">
        <description-for-card
          :item-description="item.description"
          :number="$q.screen.xs ? 100 : 250"
        />
      </div>
      <div
        v-if="item.materials"
        :class="{ 'text-body2': $q.screen.xs }"
        class="text-justify text-body1"
      >
        <description-for-card
          :item-description="item.materials"
          :number="$q.screen.xs ? 100 : 250"
        />
      </div>
      <q-space />
      <q-btn
        v-if="presenceCheck"
        no-caps
        outline
        rounded
        style="max-width: 150px"
        :label="$t('merch.buyItAgain')"
        @click="$router.push(`/merch/${item.rubric}/${item.id.split('_')[0]}`)"
      />
    </div>
    <q-separator />
  </div>
  <!--  <pre>presenceCheck - {{ presenceCheck }}</pre>-->
  <!--  <pre>merchList - {{ item.id.split('_')[0] }}</pre>-->
  <!--  <pre>merchList - {{ merchList[item.rubric] }}</pre>-->
</template>
<script>
import DescriptionForCard from 'components/shared/DescriptionForCard.vue'
import { useMerchStore } from 'stores/merch-store'
import { storeToRefs } from 'pinia'
import { computed, toRefs } from 'vue'

export default {
  name: 'OrderCardItem',
  components: { DescriptionForCard },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { item } = toRefs(props)
    const merchStore = useMerchStore()
    const { merchList } = storeToRefs(merchStore)
    const presenceCheck = computed(
      () =>
        item.value.id.includes('-') &&
        !!merchList.value[item.value.rubric]?.[item.value.id.split('_')[0]] &&
        !merchList.value[item.value.rubric]?.[item.value.id.split('_')[0]].notForSale
    )
    return {
      merchList,
      presenceCheck
    }
  }
}
</script>

<style scoped></style>
