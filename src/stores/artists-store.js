import { defineStore } from 'pinia'

export const useArtistsStore = defineStore('artists', {
  state: () => ({
    artists: [
      {
        artistId: 'anselmKiefer',
        name: 'Anselm Kiefer',
        mail: '6602796@gmail.com',
        urlPortrait:
          'https://gagosian.com/media/images/artists/anselm-kiefer/y_ZEx3v9tZNH_570x570.jpg',
        description:
          'Anselm Kiefer’s monumental body of work represents a microcosm of collective memory, visually encapsulating a broad range of cultural, literary, and philosophical allusions—from the Old and New Testaments, Kabbalah mysticism, Norse mythology and Wagner’s Ring Cycle to the poetry of Ingeborg Bachmann and Paul Celan.',
        works: [
          {
            urlWork:
              'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2FNadia1.jpg?alt=media&token=5443a0bd-951a-470b-8f55-3887cd3dfba8'
          },
          {
            urlWork:
              'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2F32.jpg?alt=media&token=76382467-144f-4314-b041-f403f81a4775'
          },
          {
            urlWork:
              'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2F_02_larisa_sokolova.jpeg?alt=media&token=a7968187-0ec7-40fc-adc9-ef33a1896460'
          },
          {
            urlWork:
              'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2F%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F%20%60%D0%9B%D0%B8%D0%B1%D0%B8%D0%B4%D0%BE%60%2F%D1%84%D1%80%D0%B5%D0%B9%D0%B4%20%D1%81%D1%82%D0%B0%D1%82%D1%8C%D1%8F%201.jpg?alt=media&token=71f27ce3-f848-4764-ad79-4cfdd757b870'
          },
          {
            urlWork:
              'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2F%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F%20%60%D0%9B%D0%B8%D0%B1%D0%B8%D0%B4%D0%BE%60%2FIMG_4779-25-01-20-02-13.JPG?alt=media&token=2a8329e3-70a4-4540-bcdf-f6936e8e52d8'
          },
          {
            urlWork:
              'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2F%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F%20%60%D0%9B%D0%B8%D0%B1%D0%B8%D0%B4%D0%BE%60%2FIMG_4190.png?alt=media&token=09e5874e-6d75-4c75-a855-2069f3319aef'
          },
          {
            urlWork:
              'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2Fpeekaboo%2F67.png?alt=media&token=8bdf9438-d2c3-46b7-8550-f0d74cd0ebce'
          },
          {
            urlWork:
              'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2Fpeekaboo%2F147.jfif?alt=media&token=0e61453b-5c80-4f36-b71d-325c86604c87'
          },
          {
            urlWork:
              'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2F%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F%20%60Seven%60%2Fhedonism_16.jpg?alt=media&token=e330ed51-91db-4859-bc6d-127aa6179dc6'
          },
          {
            urlWork:
              'https://firebasestorage.googleapis.com/v0/b/first-project-6daea.appspot.com/o/admin%2F%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F%20%60Seven%60%2Fhedonism_4.jpg?alt=media&token=db6f00eb-072b-4276-b6d0-5b5a68a7b68f'
          }
        ]
      },
      {
        artistId: 'ashleyBickerton',
        name: 'Ashley Bickerton',
        urlPortrait:
          'https://gagosian.com/media/images/artists/ashley-bickerton/3qRvdttAlt-Y_570x570.jpg',
        description:
          'Ashley Bickerton (1959–2022) rose to prominence in the mid-1980s with a succession of ironic, abstracted constructions focused on questions of consumerism and identity. Establishing his own (pointedly “feminine”) brand, Susie, Bickerton manufactured knowingly impersonal “self-portraits,” juxtaposing his imaginary company’s logo with various real-world examples. The works’ corporate aura is further enhanced by their elaborate steel, leather, and rubber façades. He has also produced “still lives” incorporating digital screens that display their own fluctuating market value, satirizing art as the object of commercial speculation. And since relocating to the Indonesian island of Bali in the early 1990s, Bickerton has explored cultural dislocation in paintings and sculptures with an ornate, handcrafted aesthetic.',
        works: {}
      },
      {
        artistId: 'rudolfBtingel',
        name: 'Rudolf Stingel',
        urlPortrait:
          'https://gagosian.com/media/images/artists/rudolf-stingel/aS3e0LAkdCa0_2280x2280.jpg',
        description:
          'From his captivatingly realistic oil paintings to his innovative use of Celotex, Styrofoam, carpet, and aluminum, Rudolf Stingel challenges traditional notions of what constitutes a painting. Often dealing with subjects of time, memory, and perception, he embraces industrial materials and ornamental design as vehicles for formal exploration and provoked coincidence, whereby the final state of certain installations is determined by the participation of the viewer.',
        works: {}
      }
    ]
  }),
  getters: {
    artistData: (state) => (artistId) => state.artists.find((item) => item.artistId === artistId)
  }
})
