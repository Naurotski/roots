<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 65px">
      <fixed-top-title :name="$t('links.about')" />
      <small-page-container class="q-pt-md">
        <div class="col-12 col-sm-4">
          <q-card flat>
            <img src="~assets/icon1.png" alt="Aorta-logo" />
          </q-card>
        </div>
        <div class="col-12 col-sm-8 relative-position" v-bind="$attrs">
          <p
            v-if="$i18n.locale !== 'it'"
            class="text-justify text-body1"
            style="white-space: pre-line"
          >
            Aorta Social Art Gallery (ex-Roots Gallery) is a young and aspiring gallery of
            contemporary social art. Aorta Gallery sees its mission in promoting art that can help
            the viewer to learn about, examine, live and comprehend sensory experience associated
            with social, political and universal processes. <br />
            We collaborate with artists, for whom art is a field of living their own complex
            emotional experiences, whether they be personal or collective crises, traumas, phases or
            archaic images of the unconscious. We welcome all the types of art, from painting and
            photography to installations. We support young artists, who explore social issues and
            also develop our city of Pisa as the center of social art.
            <br /><br /><a
              target="_blank"
              style="text-decoration: none; color: black"
              href="mailto:aorta.gallery@gmail.com"
              >aorta.gallery@gmail.com</a
            ><br />Nadzeya Naurotskaya, curator +393925568834
          </p>
          <p v-else class="text-justify text-body1" style="white-space: pre-line">
            Aorta Social Art Gallery (ex-Roots Gallery) è una giovane e aspirante galleria di arte
            sociale contemporanea. Aorta Gallery vede la sua missione nel promuovere un tipo di arte
            che possa aiutare lo spettatore a conoscere, esaminare, vivere e comprendere
            l'esperienza sensoriale associata a processi sociali, politici e universali. <br />
            Collaboriamo con artisti per i quali l'arte è un campo in cui vivere le proprie
            complesse esperienze emotive: siano esse crisi personali o collettive, traumi, fasi o
            immagini arcaiche dell'inconscio. Diamo il benvenuto a tutti i tipi di arte, dalla
            pittura e fotografia alle installazioni. Sosteniamo i giovani artisti che esplorano
            questioni sociali e vogliono aiutarci a far sviluppare la nostra città di Pisa come
            centro dell'arte sociale.

            <br />
            <br /><a
              target="_blank"
              style="text-decoration: none; color: black"
              href="mailto:aorta.gallery@gmail.com"
              >aorta.gallery@gmail.com</a
            >
            <br />Nadzeya Naurotskaya, curatrice +393925568834
          </p>

          <div class="text-justify text-body1" style="white-space: pre-line">
            Corso Italia 146, 56125 Pisa
          </div>

          <div class="row justify-center q-my-md">
            <div class="col-12 text-h6 text-center">{{ $t('common.yourMessage') }}</div>
            <mail-feedback class="col-12 col-md-8" />
          </div>
        </div>
      </small-page-container>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d812.0474914186576!2d10.398930428545782!3d43.71175286757088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d5919c1c927ded%3A0x834b906e70fe60d6!2sCorso%20Italia%2C%20146%2C%2056125%20Pisa%20PI!5e1!3m2!1sru!2sit!4v1724014576603!5m2!1sen!2sit"
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
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import MailFeedback from 'components/MailFeedback.vue'

export default {
  name: 'AboutPage',
  components: {
    FixedTopTitle,
    SmallPageContainer,
    MailFeedback
  },
  setup() {
    const { t } = useI18n()
    useMeta(() => {
      return {
        title: t('meta.homeTitle'),
        titleTemplate: (title) => `${title} | ${t('links.about')}`,
        meta: {
          description: {
            name: 'description',
            content: t('meta.aboutDescription')
          },
          keywords: {
            name: 'keywords',
            content: t('meta.homeKeywords')
          },
          robots: {
            name: 'robots',
            content: 'index, follow'
          }
        },
        link: {
          canonical: {
            rel: 'canonical',
            href: 'https://aortagallery.com/about'
          }
        },
        script: {
          jsonLd: {
            type: 'application/ld+json',
            // prettier-ignore
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ArtGallery",
              "name": t('meta.homeTitle'),
              "url": "https://aortagallery.com/about",
              "logo": "https://aortagallery.com/logo.png",
              "image": "https://aortagallery.com/image.png",
              "description": t('meta.aboutDescription'),
              "address": {
                "@type": "PostalAddress",
                "postalCode": "56125",
                "addressLocality": "Pisa",
                "addressCountry": "IT",
                "streetAddress": "Corso Italia 146"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 43.7117760654017,
                "longitude": 10.399556980989269
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    t('jsonLd.monday'),
                    t('jsonLd.tuesday'),
                    t('jsonLd.wednesday'),
                    t('jsonLd.thursday'),
                    t('jsonLd.friday'),
                    t('jsonLd.saturday'),
                    t('jsonLd.sunday')
                  ],
                  "opens": "12:00",
                  "closes": "20:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/profile.php?id=100088816940231",
                "https://www.instagram.com/aorta.socialartgallery/"
              ]
            })
          }
        }
      }
    })
  }
}
</script>

<style scoped></style>
