<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page v-if="merch" class="flex flex-center q-pb-md">
      <small-page-container>
        <div class="col-12 col-sm-7">
          <q-card-section>
            <carousel-component v-if="allUrlImages.length" :url-images="allUrlImages" />
          </q-card-section>
        </div>
        <div class="col-12 col-sm-5">
          <q-card-section>
            <div
              class="text-h5 text-bold q-pt-none"
              v-text="$i18n.locale === 'en' ? merch.name : merch.nameIt"
            />
            <div style="white-space: pre-line" class="text-justify text-body1">
              <description-for-card
                :item-description="$i18n.locale === 'en' ? merch.description : merch.descriptionIt"
                :number="$q.screen.xs ? 250 : 700"
              />
            </div>
            <div
              style="white-space: pre-line"
              class="text-justify text-h5 text-bold q-my-md"
              v-text="`€ ${variant?.price || merch.price}`"
            />
            <div
              v-if="colourOptions.length"
              class="text-bold text-body1"
              v-text="$t('merch.colour')"
            />
            <div class="row q-gutter-xs">
              <q-card
                class="flex flex-center border-black shadow-3"
                :class="{
                  'border-black': item === productColor,
                  'no-border': item !== productColor,
                  'no-shadow': item === productColor
                }"
                v-for="item in colourOptions"
                :key="item"
                style="width: 40px; height: 40px; cursor: pointer"
                @click="() => (productColor = item)"
              >
                <div
                  style="width: 30px; height: 30px"
                  :style="{ backgroundColor: colorMappingPrintFul[item] }"
                />
              </q-card>
            </div>
            <q-select
              v-if="sizeOptions.length"
              v-model="productSize"
              :options="sizeOptions"
              options-dense
              lazy-rules
              dense
              virtual
              class="q-my-md"
              style="width: 150px"
            >
              <template v-slot:prepend>
                <span class="text-body2 text-bold">{{ $t('merch.size') }}:</span>
              </template>
            </q-select>
            <q-btn
              no-caps
              outline
              rounded
              style="width: 150px"
              class="q-mt-md"
              :class="{ 'full-width q-mt-xs': $q.screen.xs, 'q-ml-md': !$q.screen.xs }"
              :label="
                cartKey && cart[cartKey].quantityCart >= merch.quantity
                  ? $t('cart.seeCart')
                  : $t('cart.addCart')
              "
              @click="
                cartKey && cart[cartKey].quantityCart >= merch.quantity
                  ? $router.push('/basket')
                  : addToCart(merch)
              "
            />
          </q-card-section>
        </div>
        <q-btn
          class="q-ml-md"
          outline
          rounded
          size="md"
          icon="mdi-arrow-left-bold"
          @click="$router.go(-1)"
        />
      </small-page-container>
    </q-page>
  </transition>
</template>
<script>
import { computed, toRefs, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMeta, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import { useMerchStore } from 'stores/merch-store'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import CarouselComponent from 'components/shared/CarouselComponent.vue'
import DescriptionForCard from 'components/shared/DescriptionForCard.vue'

export default {
  name: 'MerchPage',
  components: { CarouselComponent, SmallPageContainer, DescriptionForCard },
  props: {
    rubric: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { rubric, id } = toRefs(props)
    const $q = useQuasar()
    const { locale, t } = useI18n({ useScope: 'global' })
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const stripeStore = useStripeStore()
    const { cart } = storeToRefs(stripeStore)
    const { addProductToCart, updateCart } = stripeStore
    const merchStore = useMerchStore()
    const { merchList, colorMappingPrintFul } = storeToRefs(merchStore)
    const { listenForChildMerch } = merchStore
    const productColor = ref('')
    const productSize = ref('')

    if (!merchList.value[rubric.value]) listenForChildMerch(rubric.value)
    const merch = computed(() => {
      return merchList.value[rubric.value]?.[id.value]
    })

    const colourOptions = computed(
      () =>
        merch.value.variants
          ?.filter((item) => item.size === productSize.value)
          .map((item) => item.color)
          .filter((item, index, array) => array.indexOf(item) === index) || []
    )
    const sizeOptions = computed(
      () =>
        merch.value.variants
          ?.filter((item) => item.color === productColor.value)
          .map((item) => item.size)
          .filter((item, index, array) => array.indexOf(item) === index) || []
    )
    const allUrlImages = computed(() => {
      if (merch.value) {
        if (merch.value.urlSecondImages) {
          return [merch.value.urlImage, ...merch.value.urlSecondImages.map((item) => item.url)]
        } else {
          return [merch.value.urlImage]
        }
      } else {
        return []
      }
    })
    const variant = computed(() =>
      merch.value.variants?.find(
        (item) => item.color === productColor.value && item.size === productSize.value
      )
    )
    const cartKey = computed(() =>
      Object.keys(cart.value).find((item) => item.split('_')[0] === merch.value.id)
    )
    watch(
      merch,
      (val) => {
        if (val && val.variants) {
          productColor.value = val.variants[0].color
          productSize.value = val.variants[0].size
        }
      },
      { immediate: true, deep: true }
    )
    const addToCart = (merch) => {
      if (loggedIn.value) {
        addProductToCart({
          ...merch,
          quantityCart: 1,
          urlImageWork: merch.urlImage,
          urlSecondImagesWork: merch.urlSecondImages || [],
          urlImage: null,
          urlSecondImages: null,
          variants: variant.value ? [variant.value] : null,
          id: `${merch.id}_${variant.value?.variantId}` || merch.id
        }).then(() =>
          $q.notify({
            message: t('cart.addedCart'),
            color: 'grey',
            badgeColor: 'grey',
            badgeClass: 'shadow-3 glossy my-badge-class'
          })
        )
      } else {
        updateCart({
          key: `${merch.id}_${variant.value?.variantId}` || merch.id,
          value: {
            ...merch,
            quantityCart: 1,
            urlImageWork: merch.urlImage,
            urlSecondImagesWork: merch.urlSecondImages || [],
            urlImage: null,
            urlSecondImages: null,
            variants: variant.value ? [variant.value] : null,
            id: `${merch.id}_${variant.value?.variantId}` || merch.id
          }
        })
      }
    }
    useMeta(() => {
      return {
        title: t('meta.homeTitle'),
        titleTemplate: (title) =>
          `${title} | ${locale.value === 'it' ? merch.value?.nameIt : merch.value?.name}`,
        meta: {
          description: {
            name: 'description',
            content:
              locale.value === 'it'
                ? merch.value?.descriptionIt?.split('.')[0]
                : merch.value?.description?.split('.')[0]
          },
          keywords: {
            name: 'keywords',
            content: t('meta.shopKeywords')
          },
          robots: {
            name: 'robots',
            content: 'index, follow'
          }
        },
        link: {
          canonical: {
            rel: 'canonical',
            href: `https://aortagallery.com/${rubric.value}/${id.value}`
          }
        },
        script: {
          jsonLd: {
            type: 'application/ld+json',
            // prettier-ignore
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": locale.value === 'en' ? merch.value?.name : merch.value?.nameIt,
              "image": allUrlImages.value,
              "description": locale.value === 'en' ? merch.value?.description : merch.value?.descriptionIt,
              "category": merch.value?.rubric,
              "url": `https://aortagallery.com/work/${merch.value?.id}`,
              "offers": {
                "@type": "Offer",
                "price": merch.value?.price,
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "ArtGallery",
                  "name": t('meta.homeTitle'),
                  "url": "https://aortagallery.com",
                  "logo": "https://aortagallery.com/logo.png",
                  "image": "https://aortagallery.com/image.png",
                  "telephone": "+39-392-5568834",
                  "address": {
                    "@type": "PostalAddress",
                    "postalCode": "56125",
                    "addressLocality": "Pisa",
                    "addressCountry": "IT",
                    "streetAddress": "Corso Italia 146"
                  },
                }
              }
            })
          }
        }
      }
    })
    return {
      colorMappingPrintFul,
      cart,
      merch,
      variant,
      colourOptions,
      sizeOptions,
      allUrlImages,
      productColor,
      productSize,
      cartKey,
      addToCart
    }
  }
}
</script>

<style scoped></style>
