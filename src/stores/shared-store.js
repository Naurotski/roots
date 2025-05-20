import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'
import { ref as dbRef, onValue } from 'firebase/database'
import { db } from 'boot/firebase.js'
import { apiAxios } from 'boot/axios'
import { useMerchStore } from 'stores/merch-store'
import { showErrorMessage } from 'src/composables/show-error-message.js'

export const useSharedStore = defineStore('shared', () => {
  const essentialLinks = ref([
    { label: 'links.home', path: '/home' },
    { label: 'links.artists', path: '/artists' },
    { label: 'links.exhibitions', path: '/actions/exhibitions' },
    { label: 'links.shop', path: '/shop' },
    { label: 'links.about', path: '/about' },
    { label: 'links.sale', path: '/sale' }
  ])
  const actionsLinks = ref([
    { label: 'links.current', name: 'current' },
    { label: 'links.upcoming', name: 'upcoming' },
    { label: 'links.archive', name: 'archive' }
  ])
  const saleLinks = ref([
    { label: 'links.painting', name: 'painting' },
    { label: 'links.sculpture', name: 'sculpture' },
    { label: 'links.photography', name: 'photography' },
    { label: 'links.books', name: 'books' },
    { label: 'links.digital', name: 'digital' }
  ])
  const yourAccountLinks = ref([
    { label: 'links.myData', name: 'UserData' },
    { label: 'links.myOrders', name: 'UserOrders' }
    // { label: 'links.settings', name: 'UserSettings' }
  ])
  //{ label: 'links.graphics', name: 'graphics' },   { label: 'links.installation', name: 'installation' }
  const merchStore = useMerchStore()
  const { getProductsPrintFul, updateMerchHomePageList } = merchStore
  const rightDrawerOpen = ref(false)
  const carouselHomePage = ref([])
  const selectedExhibitionsData = ref({})
  const worksForSale = ref([])
  const listCountry = ref([])
  const deliveryDetailsDialogActivator = ref(false)

  const sortedCountries = computed(() =>
    listCountry.value.sort((a, b) => {
      if (a.countryName > b.countryName) return 1
      if (a.countryName < b.countryName) return -1
      return 0
    })
  )

  const toggleRightDrawer = () => (rightDrawerOpen.value = !rightDrawerOpen.value)
  const toggleDeliveryDetailsDialogActivator = () =>
    (deliveryDetailsDialogActivator.value = !deliveryDetailsDialogActivator.value)

  const getHomePageData = () => {
    onValue(dbRef(db, 'HomePageAorta/'), async (snapshot) => {
      if (snapshot.val()) {
        let dataPage = snapshot.val()
        carouselHomePage.value = dataPage.imagesUrlForCarousel || []
        selectedExhibitionsData.value = dataPage.selectedExhibition || {}
        worksForSale.value = dataPage.worksForSale || []
        let productData = dataPage.merchHomePage
        if (productData) {
          for (const item of productData) {
            const variants = await getProductsPrintFul(item.printFulProductId)
            updateMerchHomePageList({ ...item, variants })
          }
        }
        // const cacheCarouselHomePage = await caches.open('carouselList')
        // await Promise.all(
        //   dataPage.imagesUrlForCarousel.map((item) => cacheCarouselHomePage.add(item.imageUrl))
        // )
      }
    })
  }

  const getCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all')
      listCountry.value = response.data
        .filter((item) => item.idd.root)
        .map((country) => ({
          countryName: country.name.common,
          callingCode: `${country.idd.root}${country.idd.suffixes?.[0]}`,
          cca2: country.cca2,
          flag: country.flag
        }))
    } catch (error) {
      showErrorMessage(error.message)
      throw error
    }
  }
  const sendMailFeedback = async (mailData) => {
    try {
      await apiAxios.post('/nodemailerAorta', { ...mailData })
    } catch (error) {
      if (error.response?.data) {
        showErrorMessage(error.response.data)
      } else {
        showErrorMessage(error.message)
      }
      throw error
    }
  }
  return {
    essentialLinks,
    actionsLinks,
    saleLinks,
    yourAccountLinks,
    rightDrawerOpen,
    carouselHomePage,
    selectedExhibitionsData,
    worksForSale,
    sortedCountries,
    deliveryDetailsDialogActivator,
    toggleRightDrawer,
    toggleDeliveryDetailsDialogActivator,
    getHomePageData,
    getCountries,
    sendMailFeedback
  }
})
