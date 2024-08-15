<template>
  <div
    class="q-ma-lg"
    v-for="{ id, name, materials, price, urlImageWork, artistName } in worksList"
    :key="urlImageWork"
    style="width: 300px"
  >
    <router-link
      v-if="urlImageWork.includes('video')"
      :to="`/work/${id}`"
      style="text-decoration: none; color: #1d1d1d"
    >
      <div style="position: relative">
        <q-video
          :style="$q.screen.xs ? 'max-height: 300px' : 'height: 300px'"
          :src="urlImageWork"
        />
        <div
          style="position: absolute; top: 5px; height: 100%; width: 100%; opacity: 0.1"
          class="bg-grey-2"
        />
      </div>
      <div class="text-body1 q-mt-md">
        <div>{{ artistName }}</div>
        <b>{{ name }}</b>
        <p>{{ materials }}</p>
        <p>{{ `€ ${price}` }}</p>
      </div>
    </router-link>
    <router-link v-else :to="`/work/${id}`" style="text-decoration: none; color: #1d1d1d">
      <q-img
        :src="urlImageWork"
        fit="contain"
        :style="$q.screen.xs ? 'max-height: 300px' : 'height: 300px'"
      />
      <div class="text-body1 q-mt-md">
        <div>{{ artistName }}</div>
        <b>{{ name }}</b>
        <p>{{ materials }}</p>
        <p>{{ `€ ${price}` }}</p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'WorksList',
  props: {
    worksList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped></style>
