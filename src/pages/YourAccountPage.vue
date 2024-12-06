<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page :style="$q.screen.sm || $q.screen.xs ? 'padding-top: 100px' : 'padding-top: 10px'">
      <template v-if="$q.screen.sm || $q.screen.xs">
        <fixed-top-title :name="$t('auth.yourAccount')">
          <template #link>
            <div class="row justify-between">
              {{ $t('auth.yourAccount') }}<language-switcher style="display: flex" />
            </div>
          </template>
          <div class="row justify-md-start">
            <q-tabs v-model="tab" dense narrow-indicator>
              <q-tab
                style="width: 120px"
                class="text-body1"
                v-for="{ label, name } in yourAccountLinks"
                :key="name"
                :name="name"
                :label="$t(label)"
              />
            </q-tabs></div
        ></fixed-top-title>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel v-for="{ name } in yourAccountLinks" :key="name" :name="name">
            <component :is="name" />
          </q-tab-panel>
        </q-tab-panels>
      </template>
      <div v-else class="row justify-center">
        <q-splitter v-model="splitterModel" style="height: 81vh; width: 100%; max-width: 1400px">
          <template v-slot:before>
            <div>
              <div class="text-h5 q-mb-xl text-center">
                {{ $t('auth.yourAccount') }}
                <q-separator inset />
              </div>
              <q-tabs v-model="tab" vertical>
                <q-tab
                  class="text-body1"
                  v-for="{ label, name } in yourAccountLinks"
                  :key="name"
                  :name="name"
                  :label="$t(label)"
                />
              </q-tabs>
            </div>
          </template>
          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              vertical
              transition-prev="jump-up"
              transition-next="jump-down"
            >
              <q-tab-panel v-for="{ name } in yourAccountLinks" :key="name" :name="name">
                <component :is="name" />
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </div>
    </q-page>
  </transition>
</template>

<script>
import { useMeta, useQuasar } from 'quasar'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store.js'
import { useUserStore } from 'stores/user-store.js'
import { useSharedStore } from 'stores/shared-store'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import UserData from 'components/user/UserData.vue'
import UserOrders from 'components/user/UserOrders.vue'
import UserSettings from 'components/user/UserSettings.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import LanguageSwitcher from 'components/LanguageSwitcher.vue'

export default {
  name: 'YourAccountPage',
  components: {
    LanguageSwitcher,
    SmallPageContainer,
    FixedTopTitle,
    UserSettings,
    UserOrders,
    UserData
  },
  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const sharedStore = useSharedStore()
    const { yourAccountLinks } = storeToRefs(sharedStore)
    const tab = ref($q.localStorage.getItem('tabYorAccount') || 'UserSettings')
    const splitterModel = ref(15)
    watch(tab, () => {
      $q.localStorage.set('tabYorAccount', tab.value)
    })
    watch(loggedIn, (val) => {
      if (!val) router.replace('/')
    })
    useMeta(() => {
      return {
        title: userData.value.firstName
          ? `Aorta Social Art Gallery | ${userData.value.firstName} ${userData.value.lastName}`
          : `Aorta Social Art Gallery | ${userData.value.displayName}`,
        link: {
          canonical: {
            rel: 'canonical',
            href: `https://aortagallery.com/account`
          }
        },
        meta: {
          robots: {
            name: 'robots',
            content: 'noindex, nofollow'
          },
          description: {
            name: 'description',
            content:
              'Aorta Social Art Gallery is a young and aspiring online gallery of contemporary art. Aorta Gallery sees its mission in promoting art that can help the viewer to learn about, examine, live and comprehend sensory experience.'
          },
          keywords: {
            name: 'keywords',
            content: 'Buy paintings, sculptures, contemporary art in Pisa Italy'
          }
        }
      }
    })
    return {
      userData,
      yourAccountLinks,
      tab,
      splitterModel
    }
  }
}
</script>

<style scoped></style>
