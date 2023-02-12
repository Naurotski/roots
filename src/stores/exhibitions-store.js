import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useExhibitionsStore = defineStore('exhibitions', () => {
  const exhibitionsList = ref([
    {
      id: '123456',
      name: 'First Exhibitions',
      description:
        'Lorem ipsum dolor Commodi cupiditate dolorem eaque quod? Aperiam, at debitis eaque impedit minima modi, nihil numquam officia possimus quas quisquam quos sed ut vel voluptas. Assumenda atque ea illo maxime obcaecati! Autem consequatur, distinctio eligendi expedita impedit mollitia nesciunt non optio, praesentium repellendus, tempor Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi cupiditate dolorem eaque quod? Aperiam, at debitis eaque impedit minima modi, nihil numquam officia possimus quas quisquam quos sed ut vel voluptas. Assumenda atque ea illo maxime obcaecati! Autem consequatur, distinctio eligendi expedita impedit mollitia nesciunt non optio, praesentium repellendus, temporeLorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi cupiditate dolorem eaque quod? Aperiam, at debitis eaque impedit minima modi, nihil numquam officia possimus quas quisquam quos sed ut vel voluptas. Assumenda atque ea illo maxime obcaecati! Autem consequatur, distinctio eligendi expedita impedit mollitia nesciunt non optio, praesentium repellendus, temporeLorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi cupiditate dolorem eaque quod? Aperiam, at debitis eaque impedit minima modi, nihil numquam officia possimus quas quisquam quos sed ut vel voluptas. Assumenda atque ea illo maxime obcaecati! Autem consequatur, distinctio eligendi expedita impedit mollitia nesciunt non optio, praesentium repellendus, temporeLorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi cupiditate dolorem eaque quod? Aperiam, at debitis eaque impedit minima modi, nihil numquam officia possimus quas quisquam quos sed ut vel voluptas. Assumenda atque ea illo maxime obcaecati! Autem consequatur, distinctio eligendi expedita impedit mollitia nesciunt non optio, praesentium repellendus, tempore. Lorem ipsum dolor Commodi cupiditate dolorem eaque quod? Aperiam, at debitis eaque impedit minima modi, nihil numquam officia possimus quas ',
      draft: false,
      urlImage:
        'https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/artists%2FBobMarley%2Fworks%2FBobMarley-Test3?alt=media&token=00d2dfab-8116-4136-ac01-319a1b21eb90',
      works: [
        {
          id: 'ff99ff',
          urlWork:
            'https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/artists%2FBobMarley%2Fworks%2FBobMarley-tes3?alt=media&token=e6407aaa-db30-4e9b-be92-5333e47f1915',
          artistName: 'Bob Marley',
          name: 'Hello World!',
          description:
            ' Assumenda atque ea illo maxime obcaecati! Autem consequatur, distinctio eligendi expedita impedit mollitia nesciunt non optio, praesentium repellendus, tempor Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
          id: 'ff99333ff',
          urlWork:
            'https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/artists%2FBobMarley%2Fworks%2FBobMarley-Test1%2F13-500x300.jpg?alt=media&token=283a8e3f-1779-481f-bae9-56717d863e70',
          artistName: 'Anselm Kiefer',
          name: 'Goodbye World!',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid dignissimos dolorum, earum laborum magni numquam odio rem. Atque debitis facere fuga ipsa labore minima nisi, placeat praesentium, sint ut veritatis?70'
        }
      ]
    },
    {
      id: '98765',
      name: 'Second Exhibitions',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid dignissimos dolorum, earum laborum magni numquam odio rem. Atque debitis facere fuga ipsa labore minima nisi, placeat praesentium, sint ut veritatis?70',
      draft: false,
      urlImage:
        'https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/artists%2FBobMarley%2Fworks%2FBobMarley-Test1?alt=media&token=f39e684f-b355-4311-98ed-69994dda2b8e',
      works: [
        {
          id: 'ff99ff',
          urlWork:
            'https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/artists%2FBobMarley%2Fworks%2FBobMarley-tes3?alt=media&token=e6407aaa-db30-4e9b-be92-5333e47f1915',
          artistName: 'Bob Marley',
          name: 'Hello World!',
          description:
            ' Assumenda atque ea illo maxime obcaecati! Autem consequatur, distinctio eligendi expedita impedit mollitia nesciunt non optio, praesentium repellendus, tempor Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
        },
        {
          id: 'ff99333ff',
          urlWork:
            'https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/artists%2FBobMarley%2Fworks%2FBobMarley-Test1%2F13-500x300.jpg?alt=media&token=283a8e3f-1779-481f-bae9-56717d863e70',
          artistName: 'Anselm Kiefer',
          name: 'Goodbye World!',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid dignissimos dolorum, earum laborum magni numquam odio rem. Atque debitis facere fuga ipsa labore minima nisi, placeat praesentium, sint ut veritatis?70'
        }
      ]
    }
  ])
  const filterExhibitionsDraft = computed(() => exhibitionsList.value.filter((item) => !item.draft))
  return {
    filterExhibitionsDraft
  }
})
