<template>
  <q-page class="q-pa-md">
    <template v-for="exhibition in filterExhibitionsDraft" :key="exhibition.id">
      <small-page-container class="q-pb-md">
        <shared-card :data-card="{ ...exhibition, url: exhibition.urlImage }" class="q-pb-lg">
          <template #button>
            <full-width-dialog1111
              label="enter"
              class="absolute-bottom-right"
              :title="exhibition.name"
              :dialogData="exhibition.works"
            />
          </template>
        </shared-card>
      </small-page-container>
      <q-separator />
    </template>
  </q-page>
</template>

<script>
import { useExhibitionsStore } from 'stores/exhibitions-store.js'
import { storeToRefs } from 'pinia'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import SharedCard from 'components/shared/SharedCard.vue'
import FullWidthDialog1111 from 'components/dialogs/FullWidthDialog1111.vue'
export default {
  name: 'ExhibitionsPage',
  components: {
    SmallPageContainer,
    SharedCard,
    FullWidthDialog1111
  },
  setup() {
    const exhibitionsStore = useExhibitionsStore()
    const { filterExhibitionsDraft } = storeToRefs(exhibitionsStore)
    const enterExhibition = () => console.log('enterExhibition')
    return {
      filterExhibitionsDraft,
      enterExhibition
    }
  }
}
</script>

<style scoped></style>
