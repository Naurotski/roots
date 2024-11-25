<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 100px">
      <title-tabs :name-title="$t(`links.shop`)" :links="merchLinks" v-model="tab" />
      <q-tab-panels v-model="tab">
        <q-tab-panel v-for="{ name } in merchLinks" :key="name" :name="name">
          <transition appear enter-active-class="animated fadeIn">
            <small-page-container class="justify-around">
              <merch-list :list="filterMerchList" />
            </small-page-container>
          </transition>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </transition>
</template>
<script>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useMerchStore } from 'stores/merch-store'
import TitleTabs from 'components/shared/Titles/TitleTabs.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import MerchList from 'components/MerchList.vue'

export default {
  name: 'ShopPage',
  components: { SmallPageContainer, TitleTabs, MerchList },
  setup() {
    const $q = useQuasar()
    const { locale } = useI18n({ useScope: 'global' })
    const merchStore = useMerchStore()
    const { merchLinks, merchList } = storeToRefs(merchStore)
    const { listenForChildMerch } = merchStore
    if (!Object.keys(merchList.value).length) {
      merchLinks.value.forEach(({ name }) => listenForChildMerch(name))
    }
    const tab = ref($q.localStorage.getItem('tabMerch') || 'mugs')
    watch(tab, () => {
      $q.localStorage.set('tabMerch', tab.value)
    })
    const filterMerchList = computed(() =>
      Object.values(merchList.value[tab.value] || {})
        .filter((item) => !item.notForSale)
        .map((item) => {
          if (locale.value === 'it') {
            return { ...item, name: item.name, description: item.description }
          } else {
            return { ...item }
          }
        })
    )
    return {
      merchLinks,
      merchList,
      tab,
      filterMerchList
    }
  }
}
</script>

<style scoped></style>
