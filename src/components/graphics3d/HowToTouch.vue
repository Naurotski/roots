<template>
  <q-card
    v-if="showCard"
    class="absolute-center q-pa-md z-max"
    style="width: 360px; max-width: 90vw"
  >
    <q-card-section class="row">
      <div class="text-h6">{{ $t('graphics3D.howTo') }}</div>
      <q-space />
      <q-btn
        class="absolute-top-right"
        flat
        round
        icon="close"
        color="negative"
        @click="showCard = false"
      />
    </q-card-section>
    <div class="howto-row orientation-warning">
      <div class="howto-icon">
        <img src="~/assets/useDevice.svg" alt="swipe to rotate" class="icon" />
      </div>
      <div class="howto-text">{{ $t('graphics3D.useDevice') }}</div>
    </div>
    <div class="howto-row">
      <div class="howto-icon">
        <img src="~/assets/touchHalves.svg" alt="swipe to rotate" class="icon" />
      </div>
      <div class="howto-text">{{ $t('graphics3D.touchHalves') }}</div>
    </div>
    <div class="howto-row">
      <div class="howto-icon">
        <img src="~/assets/tapArtworks.svg" alt="tap objects" class="icon" />
      </div>
      <div class="howto-text">
        {{ $t('graphics3D.tapArtworks') }}
      </div>
    </div>
  </q-card>
  <div v-else>
    <q-btn
      round
      color="white"
      text-color="black"
      class="absolute-top-right q-mt-sm q-mr-sm"
      :class="mode === 'keyboard' ? 'q-mt-xl q-ml-xl' : 'q-mt-sm q-ml-sm'"
      size="md"
      icon="fa-solid fa-bars"
      @click="showCard = true"
    />
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'HowToTouch',
  setup() {
    const showCard = ref(true)
    return {
      showCard
    }
  }
}
</script>

<style scoped>
.howto-row {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 80px;
  border-top: 1px solid #eee;
  padding: 12px 0;
}

.howto-row:first-of-type {
  border-top: none;
}

.howto-icon {
  width: 100px; /* одинаковая ширина для всех иконок */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.icon {
  max-width: 100%;
  max-height: 90px; /* ограничение по высоте */
  height: auto;
}
.howto-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  color: black;
  word-break: break-word;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.orientation-warning {
  display: none;
  border-radius: 6px;
  background: #fff3cd; /* мягкий жёлтый */
  border: 1px solid #ffe69c;
}
@media (orientation: portrait) {
  .orientation-warning {
    display: flex;
  }
}
</style>
