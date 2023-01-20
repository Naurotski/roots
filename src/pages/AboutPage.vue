<template>
  <q-page padding>
    <h1>About</h1>
    <p v-for="n in 25" :key="n">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a
      adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos
      numquam rerum delectus commodi perferendis voluptate?
    </p>
  </q-page>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style scoped></style>
