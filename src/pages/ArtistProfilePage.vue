<template>
  <q-page class="q-pa-md" style="margin-top: 60px">
    <fixed-top-title :name="artistData.name" />
    <div class="q-gutter-sm row justify-around q-my-md">
      <div v-for="work in artistData.works" :key="work.urlImageWork">
        <full-width-dialog :work="work" :artistName="artistData.name">
          <template #button="{ onUseActivator }">
            <img
              class="cursor-pointer"
              :src="work.urlImageWork"
              style="height: 25vh"
              :alt="artistData.name"
              @click="onUseActivator"
            />
          </template>
        </full-width-dialog>
      </div>
    </div>
    <q-separator />
    <small-page-container>
      <q-toolbar>
        <q-toolbar-title class="text-h5">About</q-toolbar-title>
      </q-toolbar>
      <div class="col-12 col-sm-4 row">
        <q-card square flat style="z-index: 1" class="q-pr-sm-xl">
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
        <p class="text-justify text-subtitle1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus animi assumenda aut
          beatae blanditiis dolorem dolores, earum et iusto laudantium minima obcaecati quaerat
          reiciendis rem, repellat tenetur, ut vero voluptatum! Eum, illum ipsa nostrum omnis quos
          repellendus? Aliquam aperiam asperiores corporis culpa cum deserunt distinctio dolore
          dolorem dolores dolorum eligendi error esse et explicabo facere facilis hic labore magni
          minima molestias mollitia necessitatibus nobis nostrum numquam odio optio quae quaerat
          quasi quo recusandae repudiandae sequi sunt tenetur ullam, vero, voluptatem voluptates. Ad
          autem consequuntur cupiditate deleniti ducimus et excepturi expedita explicabo, fugit in
          labore nemo officiis quibusdam, sapiente sed vel.
        </p>
        <p class="text-justify text-subtitle1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus animi assumenda aut
          beatae blanditiis dolorem dolores, earum et iusto laudantium minima obcaecati quaerat
          reiciendis rem, repellat tenetur, ut vero voluptatum! Eum, illum ipsa nostrum omnis quos
          repellendus? Aliquam aperiam asperiores corporis culpa cum deserunt distinctio dolore
          dolorem dolores dolorum eligendi error esse et explicabo facere facilis hic labore magni
          minima molestias mollitia necessitatibus nobis nostrum numquam odio optio quae quaerat
          quasi quo recusandae repudiandae sequi sunt tenetur ullam, vero, voluptatem voluptates. Ad
          autem consequuntur cupiditate deleniti ducimus et excepturi expedita explicabo, fugit in
          labore nemo officiis quibusdam, sapiente sed vel.
        </p>
        <p class="text-justify text-subtitle1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus animi assumenda aut
          beatae blanditiis dolorem dolores, earum et iusto laudantium minima obcaecati quaerat
          reiciendis rem, repellat tenetur, ut vero voluptatum! Eum, illum ipsa nostrum omnis quos
          repellendus? Aliquam aperiam asperiores corporis culpa cum deserunt distinctio dolore
          dolorem dolores dolorum eligendi error esse et explicabo facere facilis hic labore magni
          minima molestias mollitia necessitatibus nobis nostrum numquam odio optio quae quaerat
          quasi quo recusandae repudiandae sequi sunt tenetur ullam, vero, voluptatem voluptates. Ad
          autem consequuntur cupiditate deleniti ducimus et excepturi expedita explicabo, fugit in
          labore nemo officiis quibusdam, sapiente sed vel.
        </p>
      </div>
    </small-page-container>
    <q-separator />
    <q-toolbar>
      <q-toolbar-title class="text-h5">Education</q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <q-toolbar>
      <q-toolbar-title class="text-h5">Exhibitions</q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <q-toolbar class="text-primary">
      <q-toolbar-title class="text-h5"> Press </q-toolbar-title>
    </q-toolbar>
  </q-page>
</template>

<script>
import { toRefs } from 'vue'
import { useArtistsStore } from 'stores/artists-store.js'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import FullWidthDialog from 'components/dialogs/FullWidthDialog.vue'

export default {
  name: 'ArtistProfilePage',
  components: {
    FixedTopTitle,
    SmallPageContainer,
    FullWidthDialog
  },
  props: {
    artistId: {
      type: String,
      require: true
    }
  },
  setup(props) {
    const { artistId } = toRefs(props)
    const artistsStore = useArtistsStore()
    const { artistData } = artistsStore
    const test = () => console.log('Hello')
    return {
      test,
      artistData: artistData(artistId.value),
      lorem:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  }
}
</script>

<style lang="sass" scoped></style>
