<template>
  <transition appear enter-active-class="animated fadeIn">
    <q-page :key="timestamp">
      <template v-for="(exhibition, index) in filterExhibitionsDate" :key="exhibition.id">
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
            <template v-if="exhibition.lifeTime !== 'upcoming'" #button>
              <exhibitionism-work-dialog
                label="enter"
                class="absolute-bottom-right"
                :title="exhibition.name"
                :dialogData="exhibition.works"
              />
            </template>
          </shared-card>
        </small-page-container>
        <q-separator v-if="index < filterExhibitionsDate.length - 1" class="q-my-md" />
      </template>
    </q-page>
  </transition>
</template>

<script>
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import SharedCard from 'components/shared/SharedCard.vue'
import ExhibitionismWorkDialog from 'components/dialogs/ExhibitionismWorkDialog.vue'
import { useExhibitionsStore } from 'stores/exhibitions-store.js'
import { storeToRefs } from 'pinia'
import { computed, toRefs } from 'vue'

export default {
  name: 'FilteredDateExhibitionsPage',
  components: {
    SmallPageContainer,
    SharedCard,
    ExhibitionismWorkDialog
  },
  props: {
    timestamp: {
      type: String,
      require: true
    }
  },
  setup(props) {
    const { timestamp } = toRefs(props)
    const exhibitionsStore = useExhibitionsStore()
    const { filterExhibitionsDraft } = storeToRefs(exhibitionsStore)
    const { getExhibitions } = exhibitionsStore
    if (!filterExhibitionsDraft.value.length) getExhibitions()
    const filterExhibitionsDate = computed(() =>
      filterExhibitionsDraft.value.filter((exhibition) => exhibition.lifeTime === timestamp.value)
    )
    return {
      filterExhibitionsDraft,
      filterExhibitionsDate
    }
  }
}
</script>

<style scoped></style>
