<template>
  <h2>{{ name }}</h2>
</template>

<script>
export default {
  name: 'UserOrders',
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
<style scoped></style>
