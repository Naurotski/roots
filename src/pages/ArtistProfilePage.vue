<template>
  <q-page class="q-pa-md" style="margin-top: 60px">
    <title-fixed-top :name="artistData.name" />
    <div class="q-gutter-sm row justify-around q-my-md">
      <div class="my-card" v-for="{ urlWork } in artistData.works" :key="urlWork">
        <img :src="urlWork" style="height: 25vh" :alt="artistData.name" />
      </div>
    </div>
    <q-separator />

    <div class="row q-mt-md">
      <div class="col-12 col-sm-4 row justify-end">
        <q-card square flat style="width: 100%; max-width: 450px; z-index: 1" class="q-pr-sm-xl">
          <p class="text-h5 q-ml-md">About</p>
          <img :src="artistData.urlPortrait" :alt="artistData.name" />
          <q-card-section>
            <div class="text-subtitle1">
              <a
                href="http://localhost:9000/artists"
                target="_blank"
                style="text-decoration: none; color: #1d1d1d"
              >
                <q-icon name="mdi-facebook" size="sm" class="q-mb-xs q-mr-sm" />Facebook</a
              >
            </div>
            <div class="text-subtitle1">
              <a
                href="http://localhost:9000/"
                target="_blank"
                style="text-decoration: none; color: #1d1d1d"
              >
                <q-icon name="mdi-instagram" size="sm" class="q-mb-xs q-mr-sm" />Instagram</a
              >
            </div>
            <!--            <div class="text-subtitle1">-->
            <!--              <a-->
            <!--                :href="`mailto:${artistData.mail}?subject=Roots`"-->
            <!--                target="_blank"-->
            <!--                style="text-decoration: none; color: #1d1d1d"-->
            <!--              >-->
            <!--                <q-icon name="mdi-email-outline" size="sm" class="q-mb-xs q-mr-sm"/>E-mail</a-->
            <!--              >-->
            <!--            </div>-->
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-8">
        <div style="width: 100%; max-width: 1000px" class="q-pt-md-xl">
          <p class="text-justify text-subtitle1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus animi assumenda aut
            beatae blanditiis dolorem dolores, earum et iusto laudantium minima obcaecati quaerat
            reiciendis rem, repellat tenetur, ut vero voluptatum! Eum, illum ipsa nostrum omnis quos
            repellendus? Aliquam aperiam asperiores corporis culpa cum deserunt distinctio dolore
            dolorem dolores dolorum eligendi error esse et explicabo facere facilis hic labore magni
            minima molestias mollitia necessitatibus nobis nostrum numquam odio optio quae quaerat
            quasi quo recusandae repudiandae sequi sunt tenetur ullam, vero, voluptatem voluptates.
            Ad autem consequuntur cupiditate deleniti ducimus et excepturi expedita explicabo, fugit
            in labore nemo officiis quibusdam, sapiente sed vel.
          </p>
          <p class="text-justify text-subtitle1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus animi assumenda aut
            beatae blanditiis dolorem dolores, earum et iusto laudantium minima obcaecati quaerat
            reiciendis rem, repellat tenetur, ut vero voluptatum! Eum, illum ipsa nostrum omnis quos
            repellendus? Aliquam aperiam asperiores corporis culpa cum deserunt distinctio dolore
            dolorem dolores dolorum eligendi error esse et explicabo facere facilis hic labore magni
            minima molestias mollitia necessitatibus nobis nostrum numquam odio optio quae quaerat
            quasi quo recusandae repudiandae sequi sunt tenetur ullam, vero, voluptatem voluptates.
            Ad autem consequuntur cupiditate deleniti ducimus et excepturi expedita explicabo, fugit
            in labore nemo officiis quibusdam, sapiente sed vel.
          </p>
          <p class="text-justify text-subtitle1">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus animi assumenda aut
            beatae blanditiis dolorem dolores, earum et iusto laudantium minima obcaecati quaerat
            reiciendis rem, repellat tenetur, ut vero voluptatum! Eum, illum ipsa nostrum omnis quos
            repellendus? Aliquam aperiam asperiores corporis culpa cum deserunt distinctio dolore
            dolorem dolores dolorum eligendi error esse et explicabo facere facilis hic labore magni
            minima molestias mollitia necessitatibus nobis nostrum numquam odio optio quae quaerat
            quasi quo recusandae repudiandae sequi sunt tenetur ullam, vero, voluptatem voluptates.
            Ad autem consequuntur cupiditate deleniti ducimus et excepturi expedita explicabo, fugit
            in labore nemo officiis quibusdam, sapiente sed vel.
          </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { toRefs } from 'vue'
import { useArtistsStore } from 'stores/artists-store.js'
// import { storeToRefs } from 'pinia'
import TitleFixedTop from 'components/shared/TitleFixedTop.vue'

export default {
  name: 'ArtistProfilePage',
  components: {
    TitleFixedTop
  },
  props: {
    artistId: {
      type: String,
      require: true
    }
  },
  setup(props) {
    const { artistId } = toRefs(props)
    console.log(artistId.value)
    const artistsStore = useArtistsStore()
    const { artistData } = artistsStore
    console.log(artistData(artistId.value))
    return {
      artistData: artistData(artistId.value),
      lorem:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  }
}
</script>

<style lang="sass" scoped></style>
