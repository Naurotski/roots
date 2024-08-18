import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ref as dbRef, onValue } from 'firebase/database'
import { db } from 'boot/firebase.js'

export const useSharedStore = defineStore('shared', () => {
  const essentialLinks = ref([
    { label: 'links.home', path: '/home' },
    { label: 'links.artists', path: '/artists' },
    { label: 'links.exhibitions', path: '/actions/exhibitions' },
    // { label: 'links.events', path: '/actions/events' },
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
  //{ label: 'links.graphics', name: 'graphics' },   { label: 'links.installation', name: 'installation' }
  const rightDrawerOpen = ref(false)
  const toggleRightDrawer = () => (rightDrawerOpen.value = !rightDrawerOpen.value)

  const carouselHomePage = ref([])
  const selectedExhibitionsData = ref({})
  const worksForSale = ref([])
  const getHomePageData = () => {
    onValue(dbRef(db, 'HomePageAorta/'), async (snapshot) => {
      if (snapshot.val()) {
        let dataPage = snapshot.val()
        carouselHomePage.value = dataPage.imagesUrlForCarousel || []
        selectedExhibitionsData.value = dataPage.selectedExhibition || {}
        worksForSale.value = dataPage.worksForSale || []
        // const cacheCarouselHomePage = await caches.open('carouselList')
        // await Promise.all(
        //   dataPage.imagesUrlForCarousel.map((item) => cacheCarouselHomePage.add(item.imageUrl))
        // )
      }
    })
  }

  return {
    essentialLinks,
    actionsLinks,
    saleLinks,
    rightDrawerOpen,
    carouselHomePage,
    selectedExhibitionsData,
    worksForSale,
    toggleRightDrawer,
    getHomePageData
  }
})
