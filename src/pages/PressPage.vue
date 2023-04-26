<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md">
      <small-page-container class="q-pt-md">
        <q-img
          src="https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/admin%2Fwww.lospaziobianco.png?alt=media&token=3cc6cc37-db46-4807-b25c-71c757e16907"
          width="100%"
        />
      </small-page-container>
    </q-page>
  </transition>
</template>

<script>
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
export default {
  name: 'PressPage',
  components: {
    SmallPageContainer
  }
}
</script>

<style scoped></style>
