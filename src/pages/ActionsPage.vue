<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 100px">
      <fixed-top-title :name="$t(`links.${typeAction}`)"
        ><div class="row justify-md-start">
          <q-tabs v-model="tab" dense narrow-indicator>
            <q-tab
              style="width: 100px"
              class="text-body1"
              v-for="{ label, name } in actionsLinks"
              :key="name"
              :name="name"
              :label="$t(label)"
            />
          </q-tabs></div
      ></fixed-top-title>
      <q-tab-panels v-model="tab" v-if="!$q.loading.isActive">
        <q-tab-panel v-for="{ name } in actionsLinks" :key="name" :name="name">
          <template v-if="filteredActions.length">
            <div
              v-for="(action, index) in filteredActionsI18n"
              :key="action.id"
              ref="itemRefs"
              :id="`d${action.id}`"
            >
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
                    <template #press>
                      <div v-if="action.press?.length" class="text-h5">Press</div>
                      <ul>
                        <li v-for="{ id, name } in action.press" :key="id">
                          <router-link
                            :to="`/press/${action.id}-${id}`"
                            style="color: #1d1d1d"
                            class="text-body1"
                          >
                            {{ name }}
                          </router-link>
                        </li>
                      </ul>
                    </template>
                    <template v-if="action.lifeTime !== 'upcoming'" #button>
                      <action-dialog
                        class="absolute-bottom-right"
                        :title="action.name"
                        :typeAction="typeAction"
                        :dialogData="action.works"
                      />
                    </template>
                  </shared-card>
                </small-page-container>
              </transition>
              <q-separator v-if="index < filteredActions.length - 1" class="q-my-md" />
            </div>
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
import { useMeta, useQuasar } from 'quasar'
import { toRefs, ref, watchEffect, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
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
    const route = useRoute()
    const itemRefs = ref([])
    const elem = computed(() => itemRefs.value.find((item) => item.id === `d${route.query.id}`))
    const $q = useQuasar()
    const { locale } = useI18n({ useScope: 'global' })
    const { typeAction } = toRefs(props)
    const tab = ref(route.query.lifeTime || $q.localStorage.getItem('tab-actions') || 'archive')

    const unwatch = watchEffect(() => {
      if (elem.value) {
        setTimeout(() => {
          elem.value.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }, 500)
      }
    })
    watch(tab, () => {
      $q.localStorage.set('tab-actions', tab.value)
      unwatch()
    })
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
        if (tab.value === 'upcoming' || tab.value === 'current') {
          filteredActions.value.reverse()
        }
      } else {
        if (!filterEventsDraft.value.length) getEvents()
        filteredActions.value = filterEventsDraft.value.filter(
          (event) => event.lifeTime === tab.value
        )
      }
    })
    const filteredActionsI18n = computed(() => {
      if (locale.value === 'it') {
        return filteredActions.value.map((action) => ({
          ...action,
          city: action.cityIt,
          description: action.descriptionIt,
          name: action.nameIt,
          works: action.works.map((item) => ({
            ...item,
            description: item.descriptionIt,
            name: item.nameIt
          }))
        }))
      } else {
        return filteredActions.value
      }
    })
    const ucFirst = (str) => {
      if (!str) return str
      return str[0].toUpperCase() + str.slice(1)
    }
    useMeta(() => {
      return {
        title: `Aorta Social Art Gallery | ${ucFirst(typeAction.value)}`,
        link: {
          canonical: {
            rel: 'canonical',
            href: `https://aortagallery.com/actions/${typeAction.value}`
          }
        },
        meta: {
          description: {
            name: 'description',
            content:
              'Aorta Social Art Gallery is a young and aspiring online gallery of contemporary art. Aorta Gallery sees its mission in promoting art that can help the viewer to learn about, examine, live and comprehend sensory experience.'
          },
          keywords: {
            name: 'keywords',
            content: 'Buy paintings, sculptures, contemporary, souvenirs art in Pisa Italy'
          },
          robots: {
            name: 'robots',
            content: 'index, follow'
          }
        }
      }
    })
    return {
      tab,
      actionsLinks,
      filteredActions,
      filteredActionsI18n,
      itemRefs
    }
  }
}
</script>

<style scoped></style>
