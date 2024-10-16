<template>
  <q-card flat bordered class="q-mt-md" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
    <q-card-section>Submitted form contains the following formData (key = value):</q-card-section>
    <q-separator />
    <q-card-section class="row q-gutter-sm items-center">
      <div class="q-px-sm q-py-xs bg-grey-8 text-white rounded-borders text-center text-no-wrap">
        Lorem ipsum dolor sit amet.
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'UserOrders'
}
</script>
<style scoped></style>
