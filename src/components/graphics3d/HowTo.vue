<template>
  <q-card v-if="showCard" class="q-pa-md" style="width: 360px; max-width: 90vw">
    <q-card-section class="row">
      <div class="text-h6">{{ $t('graphics3D.howTo') }}</div>
      <q-space />
      <q-btn class="absolute-top-right" flat round icon="close" @click="showCard = false" />
    </q-card-section>

    <!-- 1. Click and drag -->
    <div class="howto-row">
      <div class="howto-icon">
        <img src="~/assets/rotate-mouse.svg" alt="rotate mouse" class="icon" />
      </div>
      <div class="howto-text">{{ $t('graphics3D.clickAndDrag') }}</div>
    </div>

    <!-- 2. Arrow keys -->
    <div class="howto-row">
      <div class="howto-icon">
        <div class="key-group">
          <div class="key-row">
            <div class="key">↑</div>
          </div>
          <div class="key-row">
            <div class="key">←</div>
            <div class="key">↓</div>
            <div class="key">→</div>
          </div>
        </div>
      </div>
      <div class="howto-text">{{ $t('graphics3D.upAndDown') }}</div>
    </div>

    <!-- 3. Click on artworks or objects -->
    <div class="howto-row">
      <div class="howto-icon">
        <img src="~/assets/click-on-objects.svg" alt="click on artworks or objects" class="icon" />
      </div>
      <div class="howto-text">
        {{ $t('graphics3D.clickOnArtworks') }}
      </div>
    </div>
  </q-card>
</template>
<script setup>
import { ref } from 'vue'
const showCard = ref(true)
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

/* Arrow keys block */
.key-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.key-row {
  display: flex;
  justify-content: center;
  margin: 2px 0;
}

.key {
  border: 2px solid black;
  font-weight: bold;
  text-align: center;
  background: white;
  color: black;
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  width: 32px;
  height: 20px;
  border-radius: 4px;
  padding: 0;
}
</style>
