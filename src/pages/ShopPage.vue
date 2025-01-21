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
import { useMeta, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useMerchStore } from 'stores/merch-store'
import TitleTabs from 'components/shared/Titles/TitleTabs.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import MerchList from 'components/merch/MerchList.vue'

export default {
  name: 'ShopPage',
  components: { SmallPageContainer, TitleTabs, MerchList },
  setup() {
    const $q = useQuasar()
    const { locale } = useI18n({ useScope: 'global' })
    const tab = ref($q.localStorage.getItem('tabMerch') || 'mugs')
    const merchStore = useMerchStore()
    const { merchLinks, merchList } = storeToRefs(merchStore)
    const { listenForChildMerch } = merchStore
    watch(
      tab,
      (val) => {
        $q.localStorage.set('tabMerch', val)
        if (!merchList.value[val]) {
          listenForChildMerch(val)
        }
      },
      { immediate: true }
    )
    const filterMerchList = computed(() =>
      Object.values(merchList.value[tab.value] || {})
        .filter((item) => !item.notForSale && +item.quantity > 0)
        .map((item) => {
          if (locale.value === 'it') {
            return { ...item, name: item.nameIt, description: item.descriptionIt }
          } else {
            return { ...item }
          }
        })
    )
    useMeta(() => {
      return {
        title: 'Aorta Social Art Gallery | Shop',
        meta: {
          description: {
            name: 'description',
            content:
              'Aorta Social Art Gallery is a young and aspiring online gallery of contemporary art. Aorta Gallery sees its mission in promoting art that can help the viewer to learn about, examine, live and comprehend sensory experience.'
          },
          keywords: {
            name: 'keywords',
            content: 'Buy paintings, sculptures, contemporary art, souvenirs in Pisa Italy'
          },
          robots: {
            name: 'robots',
            content: 'index, follow'
          }
        },
        link: {
          canonical: {
            rel: 'canonical',
            href: 'https://aortagallery.com/shop'
          }
        }
      }
    })
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
