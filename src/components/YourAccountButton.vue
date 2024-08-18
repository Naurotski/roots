<template>
  <q-btn-dropdown
    style="width: 100px"
    no-caps
    v-model="status"
    :disable-dropdown="!login && !status"
    auto-close
    stretch
    flat
    @click="loginUser"
    ><template v-slot:label>
      <div v-if="login" class="text-center overflow-hidden">{{ $t('auth.hello') }}<br />Nadia</div>
      <div v-else class="text-center">{{ $t('auth.singIn') }}</div>
    </template>
    <q-list>
      <q-item v-close-popup clickable @click="locale = value">
        <q-item-section> {{ $t('auth.yourAccount') }} </q-item-section>
      </q-item>
    </q-list>
    <q-list>
      <q-item v-close-popup clickable @click="logoutUser">
        <q-item-section>{{ $t('auth.signOut') }}</q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>

  <q-dialog v-model="dialog" backdrop-filter="blur(4px)">
    <transition :name="transitionName">
      <q-card v-if="showFirstDiv">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h4">Div1</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate
          voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam
          exercitationem aut, natus minima, porro labore.
        </q-card-section>
        <q-card-actions>
          <button @click="toggleDiv">Toggle Div</button>
        </q-card-actions>
      </q-card>
      <q-card v-else>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Close icon</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aperiam distinctio incidunt
          inventore iusto minima molestias nam nemo nostrum optio perspiciatis quia repellendus
          temporibus, ut vel. Aut dolore eius provident!
        </q-card-section>
        <q-card-actions>
          <button @click="toggleDiv">Toggle Div</button>
        </q-card-actions>
      </q-card>
    </transition>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'YourAccountButton',
  setup() {
    const login = ref(false)
    const status = ref(false)
    const dialog = ref(false)
    const showFirstDiv = ref(true)
    const transitionName = ref('slide-right')
    const loginUser = () => {
      console.log('loginUser')
      if (dialog.value) {
        login.value = true
        dialog.value = true
      }
    }
    const logoutUser = () => {
      console.log('logoutUser')
      login.value = false
    }
    const toggleDiv = () => {
      transitionName.value = showFirstDiv.value ? 'slide-left' : 'slide-right'
      showFirstDiv.value = !showFirstDiv.value
    }
    return {
      login,
      status,
      dialog,
      showFirstDiv,
      transitionName,
      loginUser,
      logoutUser,
      toggleDiv
    }
  }
}
</script>

<style scoped></style>
