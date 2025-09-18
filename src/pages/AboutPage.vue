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
          <div
            v-if="$i18n.locale === 'en'"
            class="text-justify text-body1"
            style="white-space: pre-line"
          >
            <div class="text-h6 text-bold" :class="{ 'text-center': $q.screen.xs }">
              AORTA is the first gallery of social art, combining art, technology, and mental
              health.
            </div>
            <br />
            Our Mission
            <ul>
              <li>
                To change the perception of art: from a static object to a living experience that
                transforms the mental state of a person.
              </li>
              <li>
                To form a new art market where value is defined not only by the sale of works but by
                the impact on the viewer’s experiences, and therefore on society and the future.
              </li>
              <li>
                To create a model in which art works as a means of development, communication, and
                uniting people, and the viewer becomes an active participant in creating the art
                market itself.
              </li>
              <li>
                To reach a new level of development of art and new forms of its impact on the
                viewer’s perception through VR, AR, NFT, and artificial intelligence, creating new
                forms of interaction and engagement.
              </li>
            </ul>
            What we are already doing
            <br />
            <br />
            AORTA (ex-Roots Gallery) is a physical exhibition space in the center of Pisa (Italy).
            Since February 2023, we have been working as a pop-up gallery, and since July 2023 — in
            permanent locations.

            <br />
            We regularly organize immersive exhibitions, which are projects with strong social and
            philosophical content. Up to now, we have organized and carried out 21 exhibition
            projects on topics such as war, dictatorship, homelessness, bullying, ecology, body
            privacy, freedom, migration, etc. Cooperation involves more than 50 artists from
            different countries. AORTA is an international project.

            <br />
            <br />
            Our projects include:

            <ul>
              <li>
                All traditional forms of contemporary art: painting, photography, installations,
                performance, street art, etc.
              </li>
              <li>
                VR / AR / XR practices — Meta Quest + original virtual worlds, collaborations with
                VR artists and architects. We use virtual meditations, immersion into paintings, 3D
                drawing, endorphin-based mental reset.
              </li>
              <li>
                Educational and art-therapeutic practices, embedded in exhibition projects, with
                active audience involvement.
              </li>
              <li>
                NFT and digital projects, which include collections of works, digital artifacts
                related to exhibitions, development of a virtual version of the gallery.
              </li>
            </ul>
            Financial model (growsharing)

            <br />
            <br />
            The main idea is that the viewer is an active participant and sponsor of the project.
            Each project can be implemented through joint financing and contributions:

            <ul>
              <li>
                For users its about tickets, pre-sale, support and contribution with rewards as
                gifts.
              </li>
              <li>For sponsors and partners it’s about business, brand .</li>
              <li>Grants and funds, which is about cultural and humanitarian programs.</li>
            </ul>
            Users and sponsors can choose the project they want to support, choose the amount of
            support and contribution, and receive a guaranteed reward for this amount: merch,
            ticket, NFT, participation in a meeting, some experience, an artwork by the artist, etc.
            The project is implemented if the minimum amount for its realization is reached. If the
            amount is not reached, users and sponsors receive the agreed reward, and the project can
            be implemented in the framework of the virtual gallery. The gallery receives
            remuneration for creating the virtual project, and the artist gets a fee for creating
            artworks. Exhibitions can be implemented in any city of the world with sufficient
            financial collections.

            <br />
            <br />
            Scaling and prospects:

            <ul>
              <li>
                A large network of virtual exhibitions, which means a global access, like Netflix
                for social art.
              </li>
              <li>Virtual gallery: projects do not die but continue to live in VR.</li>
              <li>Virtual NFT vaults as therapeutic rooms for users and NFT storage.</li>
              <li>
                Development of AI in art: VR guides, personalized worlds, interactive dialogues.
              </li>
              <li>
                Creation of the largest immersive art center at the intersection of social art,
                mental health, and technology.
              </li>
              <li>Building a global platform for social art and mental health.</li>
              <li>
                Forming a new culture of a humane future, where art does not entertain but changes
                the state of the person and society, and the viewer participates in project
                implementation.
              </li>
            </ul>
            <div :class="{ 'text-center': $q.screen.xs }">
              If you are interested in collaboration, write to us!
            </div>
          </div>

          <div v-else class="text-justify text-body1" style="white-space: pre-line">
            <div class="text-h6 text-bold" :class="{ 'text-center': $q.screen.xs }">
              AORTA è la prima galleria di arte sociale, che unisce arte, tecnologia e salute
              mentale.
            </div>
            <br />
            La nostra missione
            <ul>
              <li>
                Cambiare la percezione dell’arte: da oggetto statico a esperienza viva che trasforma
                lo stato mentale della persona.
              </li>
              <li>
                Creare un nuovo mercato dell’arte, in cui il valore non è definito solo dalla
                vendita delle opere, ma dall’impatto sulle esperienze dello spettatore, e quindi
                sulla società e sul futuro.
              </li>
              <li>
                Sviluppare un modello in cui l’arte diventa uno strumento di crescita, comunicazione
                e unione tra le persone, e lo spettatore diventa un partecipante attivo nella
                creazione del mercato stesso.
              </li>
              <li>
                Raggiungere un nuovo livello di sviluppo dell’arte e delle sue forme di impatto
                sulla percezione attraverso VR, AR, NFT e intelligenza artificiale, creando nuove
                modalità di interazione e coinvolgimento.
              </li>
            </ul>
            Cosa stiamo già facendo
            <br />
            <br />
            AORTA (ex Roots Gallery) è uno spazio espositivo fisico nel centro di Pisa (Italia). Dal
            febbraio 2023 abbiamo operato come galleria pop-up e da luglio 2023 — in sedi
            permanenti.
            <br />
            Organizziamo regolarmente mostre immersive con contenuti sociali e filosofici di grande
            impatto. Fino ad oggi abbiamo realizzato 21 progetti espositivi su temi come guerra,
            dittatura, senzatetto, bullismo, ecologia, privacy del corpo, libertà, migrazione, ecc.
            Collaboriamo con oltre 50 artisti provenienti da diversi paesi. AORTA è un progetto
            internazionale.
            <br />
            <br />
            I nostri progetti includono:
            <ul>
              <li>
                Tutte le forme tradizionali di arte contemporanea: pittura, fotografia,
                installazioni, performance, street art, ecc.
              </li>
              <li>
                Pratiche VR / AR / XR — Meta Quest + mondi virtuali originali, collaborazioni con
                artisti e architetti VR. Utilizziamo meditazioni virtuali, immersioni nei quadri,
                disegno 3D, reset mentale basato su endorfine.
              </li>
              <li>
                Pratiche educative e art-terapeutiche integrate nei progetti espositivi, con attivo
                coinvolgimento del pubblico.
              </li>
              <li>
                NFT e progetti digitali: collezioni di opere, artefatti digitali legati alle mostre,
                sviluppo della versione virtuale della galleria.
              </li>
            </ul>
            Modello finanziario (growsharing)
            <br />
            <br />
            L’idea principale: lo spettatore è un partecipante e sponsor attivo del progetto. Ogni
            progetto può essere realizzato tramite finanziamento collettivo e contributi:
            <ul>
              <li>
                Per gli utenti significa biglietti, prevendite, sostegno e contributi con premi come
                ricompense.
              </li>
              <li>Per sponsor e partner riguarda business e brand.</li>
              <li>Per fondi e grant riguarda programmi culturali e umanitari.</li>
            </ul>
            Gli utenti e gli sponsor possono scegliere il progetto che vogliono sostenere, l’importo
            del contributo e ricevere una ricompensa garantita: merch, biglietto, NFT,
            partecipazione a un incontro, un’esperienza, un’opera d’arte, ecc. Il progetto si
            realizza se viene raggiunto l’importo minimo necessario. Se non viene raggiunto, utenti
            e sponsor ricevono comunque la ricompensa concordata e il progetto può essere realizzato
            nella galleria virtuale. La galleria riceve un compenso per la creazione del progetto
            virtuale e l’artista un fee per le opere. Le mostre possono essere realizzate in
            qualsiasi città del mondo con sufficiente raccolta fondi.
            <br />
            <br />
            Scalabilità e prospettive
            <ul>
              <li>
                Una vasta rete di mostre virtuali con accesso globale — come un Netflix per l’arte
                sociale.
              </li>
              <li>Galleria virtuale: i progetti non muoiono, ma continuano a vivere in VR.</li>
              <li>
                Caveau NFT virtuali come stanze terapeutiche per utenti e per l’archiviazione degli
                NFT.
              </li>
              <li>
                Sviluppo dell’AI nell’arte: guide VR, mondi personalizzati, dialoghi interattivi.
              </li>
              <li>
                Creazione del più grande centro di arte immersiva all’intersezione tra arte sociale,
                salute mentale e tecnologia.
              </li>
              <li>Costruzione di una piattaforma globale per arte sociale e salute mentale.</li>
              <li>
                Formazione di una nuova cultura di futuro umano, in cui l’arte non intrattiene ma
                cambia lo stato della persona e della società, e lo spettatore partecipa alla
                realizzazione dei progetti.
              </li>
            </ul>
            <div :class="{ 'text-center': $q.screen.xs }">
              Se siete interessati a collaborare, scriveteci!
            </div>
          </div>

          <div class="q-mt-lg" :class="{ 'text-center': $q.screen.xs }">
            <a target="_blank" href="mailto:aorta.gallery@gmail.com">aorta.gallery@gmail.com</a>
            <div>+39 331 994 5585</div>
            <div class="q-mb-xs">Corso Italia 146, 56125 Pisa</div>
            <div>
              <span>{{
                $i18n.locale === 'en' ? 'Founder, curator' : 'Fondatrice e curatrice'
              }}</span>
              Nadzeya Naurotskaya,
            </div>
            <div>
              <span>{{ $i18n.locale === 'en' ? 'Director' : 'Direttrice' }}</span>
              Vera Kaptsiakova,
            </div>

          </div>

          <div class="row justify-center q-my-lg">
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

<style scoped>
ul {
  margin-top: 0;
}
</style>
