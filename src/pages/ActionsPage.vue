<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 100px">
      <fixed-top-title :name="typeAction[0].toUpperCase() + typeAction.slice(1)"
        ><div class="row justify-md-start">
          <q-tabs v-model="tab" dense narrow-indicator>
            <q-tab
              class="text-body1"
              v-for="link in actionsLinks"
              :key="link"
              :name="link"
              :label="link"
            />
          </q-tabs></div
      ></fixed-top-title>
      <q-tab-panels v-model="tab">
        <q-tab-panel v-for="link in actionsLinks" :key="link" :name="link">
          <template v-if="filteredActions.length">
            <template v-for="(action, index) in filteredActions" :key="action.id">
              <transition appear enter-active-class="animated fadeIn">
                <small-page-container class="q-pb-md">
                  <shared-card
                    :data-card="{
                      name: action.name,
                      description: action.description,
                      url: action.urlImage,
                      caption: `${action.openingDate} - ${action.closingDate}, ${action.city}`
                    }"
                    class="q-pb-lg"
                  >
                    <template #underPicture>
                      <q-card-section>
                        <div class="text-subtitle1">
                          <p
                            style="color: #1d1d1d"
                            v-text="`${action.openingDate} - ${action.closingDate}, ${action.city}`"
                          />
                        </div>
                      </q-card-section>
                    </template>
                    <template v-if="action.lifeTime !== 'upcoming'" #button>
                      <action-dialog
                        label="enter"
                        class="absolute-bottom-right"
                        :title="action.name"
                        :dialogData="action.works"
                      />
                    </template>
                  </shared-card>
                </small-page-container>
              </transition>
              <q-separator v-if="index < filteredActions.length - 1" class="q-my-md" />
            </template>
          </template>
          <no-results v-else />
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </transition>
</template>

<script>
import { useSharedStore } from 'stores/shared-store.js'
import { useActionStore } from 'stores/actions-store.js'
import { storeToRefs } from 'pinia'
import { useMeta } from 'quasar'
import { toRefs, ref, watchEffect } from 'vue'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import SharedCard from 'components/shared/SharedCard.vue'
import ActionDialog from 'components/dialogs/ActionDialog.vue'
import NoResults from 'components/shared/NoResults.vue'

export default {
  name: 'ActionsPage',
  components: {
    FixedTopTitle,
    SmallPageContainer,
    SharedCard,
    ActionDialog,
    NoResults
  },
  props: {
    typeAction: {
      type: String,
      require: true
    }
  },

  setup(props) {
    const { typeAction } = toRefs(props)
    const tab = ref('upcoming')
    const shredStore = useSharedStore()
    const { actionsLinks } = storeToRefs(shredStore)
    const actionsStore = useActionStore()
    const { filterExhibitionsDraft, filterEventsDraft } = storeToRefs(actionsStore)
    const { getExhibitions, getEvents } = actionsStore
    const filteredActions = ref([])
    watchEffect(() => {
      if (typeAction.value === 'exhibitions') {
        if (!filterExhibitionsDraft.value.length) getExhibitions()
        filteredActions.value = filterExhibitionsDraft.value.filter(
          (exhibition) => exhibition.lifeTime === tab.value
        )
      } else {
        if (!filterEventsDraft.value.length) getEvents()
        filteredActions.value = filterEventsDraft.value.filter(
          (event) => event.lifeTime === tab.value
        )
      }
    })

    useMeta(() => {
      return {
        title: 'Roots',
        titleTemplate: (title) => `${title} | ${typeAction.value}`,
        meta: {
          description: {
            name: 'description',
            content:
              'Roots Gallery is a young and aspiring online gallery of contemporary art. Roots Gallery sees its mission in promoting art that can help the viewer to learn about, examine, live and comprehend sensory experience.'
          },
          ogTitle: {
            property: 'og:title'
          }
        }
      }
    })
    return {
      tab,
      actionsLinks,
      filteredActions
    }
  }
}
</script>

<style scoped></style>
