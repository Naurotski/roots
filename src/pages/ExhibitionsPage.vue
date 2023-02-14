<template>
  <q-page class="q-pa-md">
    <template v-for="exhibition in filterExhibitionsDraft" :key="exhibition.id">
      <small-page-container class="q-pb-md">
        <shared-card
          :data-card="{
            name: exhibition.name,
            description: exhibition.description,
            url: exhibition.urlImage,
            caption: `${exhibition.openingDate} - ${exhibition.closingDate}, ${exhibition.city}`
          }"
          class="q-pb-lg"
        >
          <template #button>
            <exhibitionism-work-dialog
              label="enter"
              class="absolute-bottom-right"
              :title="exhibition.name"
              :dialogData="exhibition.works"
            />
          </template>
          <template #underPicture>
            <q-card-section>
              <div class="text-subtitle1">
                <p
                  style="color: #1d1d1d"
                  v-text="
                    `${exhibition.openingDate} - ${exhibition.closingDate}, ${exhibition.city}`
                  "
                />
              </div>
            </q-card-section>
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
import ExhibitionismWorkDialog from 'components/dialogs/ExhibitionismWorkDialog.vue'
export default {
  name: 'ExhibitionsPage',
  components: {
    SmallPageContainer,
    SharedCard,
    ExhibitionismWorkDialog
  },
  setup() {
    const exhibitionsStore = useExhibitionsStore()
    const { filterExhibitionsDraft } = storeToRefs(exhibitionsStore)
    const { getExhibitions } = exhibitionsStore
    if (!filterExhibitionsDraft.value.length) getExhibitions()
    const enterExhibition = () => console.log('enterExhibition')
    return {
      filterExhibitionsDraft,
      enterExhibition
    }
  }
}
</script>

<style scoped></style>
