<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 65px">
      <fixed-top-title :name="$t('links.about')" />
      <small-page-container class="q-pt-md">
        <div class="col-12 col-sm-4">
          <q-card flat>
            <img src="~assets/icon1.png" alt="roots-logo" />
          </q-card>
        </div>
        <div class="col-12 col-sm-8 relative-position" v-bind="$attrs">
          <p
            v-if="$i18n.locale !== 'it'"
            class="text-justify text-body1"
            style="white-space: pre-line"
          >
            Roots Gallery is a young and aspiring online gallery of contemporary art. Roots Gallery
            sees its mission in promoting art that can help the viewer to learn about, examine, live
            and comprehend sensory experience. <br />
            We collaborate with artists for whom art is a field for living their own complex
            emotional experiences, whether they be personal or collective crises, traumas, phases or
            archaic images of the unconscious. We welcome all types of art, from painting and
            photography to installations. For us, there are no restrictions on the age, experience
            of the artist, his nationality, gender or education. We are looking for new and
            expressive ways of accurately conveying emotional experiences. <br />
            We have a virtual permanent address but we go offline with our projects and involve a
            large number of viewers.<br />
            Our offline projects are focused on social topics and always include an interactive part
            in which viewers can actively participate and live their own experience of a particular
            social theme.
            <br /><br />roots.gallery.it@gmail.com <br /><br />Nadzeya Naurotskaya, curator
            +393925568834
            <br />
            Asya Zuyeva, communications director +393884733424
          </p>
          <p v-else class="text-justify text-body1" style="white-space: pre-line">
            Roots Gallery è una giovane e aspirante galleria-online di arte contemporanea. Roots
            Gallery vede la sua missione nella promozione dell'arte che può aiutare lo spettatore a
            conoscere, esplorare, vivere e comprendere l'esperienza sensoriale. <br />
            Collaboriamo con artisti per i quali l'arte è un campo in cui vivere le proprie
            complesse esperienze emotive, siano esse crisi personali o collettive, traumi, fasi o
            immagini arcaiche dell'inconscio. Diamo il benvenuto a tutti i tipi di arte, dalla
            pittura e fotografia alle installazioni. Per noi non ci sono restrizioni sull'età,
            l'esperienza dell'artista, la sua nazionalità, sesso o formazione. Cerchiamo modi nuovi
            ed espressivi per trasmettere con precisione le esperienze emotive. <br />
            Abbiamo un indirizzo fisso virtuale ma andiamo offline con i nostri progetti e
            coinvolgiamo un gran numero di spettatori. <br />
            I nostri progetti offline si concentrano su temi sociali e includono sempre una parte
            interattiva, in cui gli spettatori possono partecipare attivamente e vivere la propria
            esperienza di un particolare tema sociale.

            <br /><br />roots.gallery.it@gmail.com <br /><br />Nadzeya Naurotskaya, curatrice
            +393925568834
            <br />
            Asya Zuyeva, direttore della comunicazione +393884733424
          </p>
          <br />
          <p class="text-justify text-body1" style="white-space: pre-line">
            Corte San Domenico B, 56125 Pisa
          </p>
        </div>
      </small-page-container>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2883.9473532719735!2d10.397497211949661!3d43.711643148528154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d59157a75704df%3A0xa11c4b4e375b7021!2sRoots%20Gallery!5e0!3m2!1sru!2sit!4v1690212549316!5m2!1sru!2sit"
        width="100%"
        height="500"
        style="border: 0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </q-page>
  </transition>
</template>

<script>
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import { useMeta } from 'quasar'

const metaData = {
  title: 'Aorta Social Art Gallery',
  titleTemplate: (title) => `${title} | About`,
  meta: {
    description: {
      name: 'description',
      content:
        'Roots Gallery is a young and aspiring online gallery of contemporary art. Roots Gallery sees its mission in promoting art that can help the viewer to learn about, examine, live and comprehend sensory experience.'
    },
    ogTitle: {
      property: 'og:title'
    }
  }
}
export default {
  name: 'AboutPage',
  components: {
    FixedTopTitle,
    SmallPageContainer
  },
  setup() {
    useMeta(metaData)
  }
}
</script>

<style scoped></style>
