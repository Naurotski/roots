<template>
  <q-layout view="hHh lpr fff">
    <q-header bordered class="bg-white text-primary">
      <q-toolbar>
        <q-toolbar-title>
          <router-link to="/" style="text-decoration: none">
            <span class="text-primary">ROOTS</span>
          </router-link>
        </q-toolbar-title>
        <q-tabs class="gt-xs" v-model="tab">
          <q-route-tab
            v-for="{ title } in essentialLinks"
            :key="title"
            :name="title"
            :label="title"
            :to="{ name: title }"
          />
        </q-tabs>
        <q-btn
          class="lt-sm"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right">
      <q-list>
        <q-item-label header> Essential Links </q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer bordered class="bg-white text-primary">
      <q-tabs no-caps active-color="primary" indicator-color="transparent" class="text-grey">
        <q-tab icon="list" name="images" label="Images" />
        <q-tab name="videos" label="Videos" />
        <q-tab name="articles" label="Articles" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Home',
    caption: 'quasar.dev',
    icon: 'school'
  },
  {
    title: 'Test',
    caption: 'github.com/quasarframework',
    icon: 'code'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },
  setup() {
    const rightDrawerOpen = ref(false)
    const tab = ref(linksList[0].title)
    const toggleRightDrawer = () => (rightDrawerOpen.value = !rightDrawerOpen.value)
    return {
      essentialLinks: linksList,
      rightDrawerOpen,
      tab,
      toggleRightDrawer
    }
  }
})
</script>
