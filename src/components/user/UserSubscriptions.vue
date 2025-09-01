<template>
  <div
    v-if="
      !Object.keys(listSubscriptions).length ||
      !Object.values(listSubscriptions).find((item) => item.status === 'active')
    "
  >
    <div class="text-center text-h5 q-mb-md">{{ $t('subscription.noSubscriptions') }}</div>
    <div class="text-center">
      <subscribe-dialog v-slot="{ openDialog }">
        <q-btn
          no-caps
          outline
          rounded
          style="width: 200px"
          :class="{ 'full-width': $q.screen.xs }"
          :label="$t('subscription.selectSub')"
          @click="openDialog()"
        />
      </subscribe-dialog>
    </div>
  </div>
  <div v-else>
    <div v-for="(subscription, name) in listSubscriptions" :key="subscription.id">
      <div class="row justify-start">
        <q-img
          height="100px"
          fit="contain"
          class="col-12 col-sm-2"
          :class="$q.screen.xs ? 'q-mb-md' : 'q-mr-md'"
          :src="subscriptionsData[subscription.interval].imageUrl"
          alt="photo"
        />
        <div
          class="col-12 col-sm-9 column justify-center"
          :class="{ ' items-center': $q.screen.xs }"
        >
          <div class="text-h5">{{ name }}</div>
          <div class="text-subtitle1">{{ $t(subscriptionsData[subscription.interval].name) }}</div>
          <div
            v-if="subscription.status === 'active'"
            class="text-caption"
            :class="{ 'text-center': $q.screen.xs }"
          >
            <span v-if="!subscription.cancel_at_period_end">
              {{ $t('subscription.automaticallyRenewed') }}</span
            >
            <span v-else class="text-negative">{{ $t('subscription.subscriptionEnds') }}</span>
            &nbsp;<span class="text-weight-bold">{{
              date.formatDate(subscription.current_period_end * 1000, 'DD/MM/YYYY')
            }}</span>
          </div>
          <div v-else class="text-caption">Status - {{ subscription.status }}</div>
        </div>
      </div>
      <div class="q-my-lg text-justify">
        <div v-for="item in subscriptionsData[subscription.interval].list" :key="item" class="row">
          <q-icon name="check" class="col-1 items-start" />
          <div class="col-11">{{ $t(item) }}</div>
        </div>
      </div>
      <div class="q-gutter-sm">
        <subscribe-dialog
          v-if="!(subscription.interval === 'year' && subscription.status === 'active')"
          v-slot="{ openDialog }"
        >
          <q-btn
            no-caps
            outline
            rounded
            style="width: 200px"
            :class="{ 'full-width': $q.screen.xs }"
            :label="$t('subscription.renewSubscription')"
            @click="openDialog()"
          />
        </subscribe-dialog>
        <q-btn
          v-if="subscription.status === 'active'"
          no-caps
          outline
          rounded
          style="width: 200px"
          :class="{ 'full-width': $q.screen.xs }"
          :label="
            subscription.cancel_at_period_end
              ? $t('subscription.resumeSubscription')
              : $t('subscription.cancelSubscription')
          "
          @click="
            cancelSubscription({
              currentPeriod: subscription.current_period_end,
              subscriptionId: subscription.id,
              cancelChek: !subscription.cancel_at_period_end,
              resumeChek: subscription.cancel_at_period_end
            })
          "
        />
        <q-btn
          no-caps
          outline
          rounded
          style="width: 200px"
          :class="{ 'full-width': $q.screen.xs }"
          :label="$t('subscription.changePaymentMethod')"
          @click="changePaymentMethod(subscription.customer)"
        />
      </div>
    </div>
  </div>
  <q-separator class="q-mt-md" />
  <div v-if="paidVirtualGalleries.length" class="q-gutter-sm q-mt-sm">
    <div v-for="{ name, description, urlImage, access_end, id } in paidVirtualGalleries" :key="id">
      <div class="row justify-start">
        <q-img
          height="100px"
          fit="contain"
          class="col-12 col-sm-2 cursor-pointer"
          :class="$q.screen.xs ? 'q-mb-md' : 'q-mr-md'"
          :src="urlImage"
          alt="photo"
          @click="() => $router.push(`/3d/${id}`)"
        />
        <div class="col-12 col-sm-9 column justify-center" :class="{ 'text-center': $q.screen.xs }">
          <div class="text-h5">{{ name }}</div>
          <div class="text-caption text-justify">
            {{ description
            }}<span
              style="cursor: pointer; color: #0d47a1"
              v-if="description.length >= 300 && !showDescription[id]"
              @click="showDescription[id] = !showDescription[id]"
              >{{ $t('common.more') }}</span
            ><span
              style="cursor: pointer; color: #0d47a1"
              v-if="description.length >= 300 && showDescription[id]"
              @click="showDescription[id] = !showDescription[id]"
            >
              <br />&#8679;</span
            >
          </div>
          <div class="text-subtitle2" :class="{ 'text-center': $q.screen.xs }">
            <span class="text-negative"> {{ $t('subscription.accessEnding') }}</span>
            &nbsp;<span class="text-weight-bold">{{
              date.formatDate(access_end, 'DD/MM/YYYY')
            }}</span>
          </div>
        </div>
      </div>
      <q-separator class="q-mt-xs" />
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { date, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import { useStripeStore } from 'stores/stripe-store'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { useActionStore } from 'stores/actions-store'
import SubscribeDialog from 'components/dialogs/SubscribeDialog.vue'

export default {
  name: 'UserSubscriptions',
  components: {
    SubscribeDialog
  },
  setup() {
    const $q = useQuasar()
    const { t, locale } = useI18n()
    const route = useRoute()
    const userStore = useUserStore()
    const { listSubscriptions, listPayments } = storeToRefs(userStore)
    const { subscriptionsData } = userStore
    const stripeStore = useStripeStore()
    const { subscriptionUpdate, portalSessionStripe } = stripeStore
    const graphics3DStore = useGraphics3DStore()
    const { listGalleries, filteredListGalleriesNonDraft } = storeToRefs(graphics3DStore)
    const { listenForChildEvents } = graphics3DStore
    if (!Object.keys(listGalleries.value).length) listenForChildEvents('listGalleries')
    const actionsStore = useActionStore()
    const { filterExhibitionsDraft } = storeToRefs(actionsStore)
    const { getExhibitions } = actionsStore
    if (!filterExhibitionsDraft.value.length) getExhibitions()
    const showDescription = ref({})

    const filteredListGalleriesPayment = computed(() =>
      Object.values(filteredListGalleriesNonDraft.value).filter((item) => item.payment === 'pay')
    )
    const paidVirtualGalleries = computed(() =>
      filterExhibitionsDraft.value
        .filter((gallery) =>
          filteredListGalleriesPayment.value.some(
            (elem) => elem.galleryId === gallery.id.toString()
          )
        )
        .map((item) => ({
          name: locale === 'it' ? item.nameIt : item.name,
          description: modificationDescription(item),
          urlImage: item.urlImage,
          access_end: listPayments.value?.virtualGalleries[item.id],
          id: item.id
        }))
    )
    const modificationDescription = (gallery) => {
      let description = locale === 'it' ? gallery.descriptionIt : gallery.description
      if (description.length < 300 || showDescription.value[gallery.id]) {
        return description
      } else {
        return `${description.substring(0, 300)}...`
      }
    }
    const cancelSubscription = ({ currentPeriod, subscriptionId, cancelChek, resumeChek }) => {
      $q.dialog({
        title: cancelChek
          ? `<span style="color: red">${t('subscription.cancelSubscription')}</span>`
          : `${t('subscription.resumeSubscription')}?`,
        message: cancelChek
          ? `${t('subscription.subscriptionWillBeCancelled')} ${date.formatDate(
              currentPeriod * 1000,
              'DD/MM/YYYY'
            )}`
          : '',
        cancel: true,
        persistent: true,
        html: true
      }).onOk(async () => {
        console.log('cancelSubscription - ', subscriptionId)
        await subscriptionUpdate({ subscriptionId, cancelChek, resumeChek })
      })
    }
    const changePaymentMethod = (customerId) => {
      portalSessionStripe({ customerId, return_url: route.path })
    }
    return {
      date,
      listSubscriptions,
      subscriptionsData,
      filteredListGalleriesPayment,
      paidVirtualGalleries,
      showDescription,
      cancelSubscription,
      changePaymentMethod
    }
  }
}
</script>

<style scoped></style>
