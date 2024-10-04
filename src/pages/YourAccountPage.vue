<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 100px">
      <fixed-top-title :name="$t('auth.yourAccount')"
        ><div class="row justify-md-start">
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
          <component :name="name" :is="name" />
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </transition>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store.js'
import { useUserStore } from 'stores/user-store.js'
import { useSharedStore } from 'stores/shared-store'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import UserSettings from 'components/user/UserSettings.vue'
import UserOrders from 'components/user/UserOrders.vue'
import UserBasket from 'components/user/UserBasket.vue'

export default {
  name: 'YourAccountPage',
  components: { FixedTopTitle, UserSettings, UserOrders, UserBasket },
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
    watch(tab, () => {
      $q.localStorage.set('tabYorAccount', tab.value)
    })
    watch(loggedIn, (val) => {
      if (!val) router.replace('/')
    })
    return {
      userData,
      yourAccountLinks,
      tab
    }
  }
}
</script>

<style scoped></style>
