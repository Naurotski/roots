<template>
  <q-page class="q-pa-md" style="padding-top: 65px">
    <fixed-top-title :class="{ 'text-h5': $q.screen.xs }" :name="$t('common.rulesGallery')" />
    <small-page-container class="q-pt-md" style="max-width: 1000px">
      <div v-if="$i18n.locale === 'en'">
        <div class="text-body1">
          By purchasing a ticket online, you agree to the following rules and confirm that you are
          familiar with the terms of visit.
        </div>

        <div class="text-h5">1. General</div>
        <ul>
          <li class="text-body1">
            Tickets are personal and valid only for the specified date and time (if a time slot
            system is in use).
          </li>
        </ul>

        <div class="text-h5">2. Refunds and Exchanges</div>
        <ul>
          <li class="text-body1">
            Tickets may be refunded or exchanged no later than 24 hours before the scheduled visit
            time indicated on the ticket.
          </li>
          <li class="text-body1">
            After this period, refunds or exchanges are not possible, except in the event of
            cancellation or rescheduling by the gallery.
          </li>
          <li class="text-body1">
            No refund is provided for missed visits due to personal circumstances (illness,
            lateness, etc.).
          </li>
        </ul>

        <div class="text-h5">3. Entry</div>
        <ul>
          <li class="text-body1">
            Tickets must be shown (printed or on a mobile device) at the entrance.
          </li>
          <li class="text-body1">
            Entry is allowed only during the time slot indicated on the ticket (if applicable).
          </li>
        </ul>

        <div class="text-h5">4. Accessibility</div>
        <ul>
          <li class="text-body1">
            Please note that the gallery is accessible only via stairs and is
            <strong>not equipped with a ramp or lift</strong>.
          </li>
          <li class="text-body1">
            We are aware of the importance of accessibility and are working to improve this.
          </li>
        </ul>

        <div class="text-h5">5. Behavior</div>
        <ul>
          <li class="text-body1">
            No smoking, eating, loud or disruptive behavior is allowed inside the gallery.
          </li>
          <li class="text-body1">
            Please follow the staff's instructions and respect the space and artworks.
          </li>
        </ul>

        <div class="text-h5">6. Responsibility</div>
        <ul>
          <li class="text-body1">
            The gallery is not responsible for late arrival, lost tickets, device issues, or any
            technical problems on the user's side.
          </li>
        </ul>

        <div class="text-h5">7. Data Protection</div>
        <ul>
          <li class="text-body1">
            By placing an order, you agree to the processing of your personal data.
          </li>
          <li class="text-body1">
            Details are available in our <router-link to="/privacy">Privacy Policy</router-link>.
          </li>
        </ul>

        <div class="text-h5">8. Changes and Force Majeure</div>
        <ul>
          <li class="text-body1">
            The gallery reserves the right to change its schedule, exhibitions, or visiting terms in
            the event of force majeure (weather, maintenance, etc.).
          </li>
        </ul>
      </div>

      <div v-else-if="$i18n.locale === 'it'">
        <div class="text-body1">
          Acquistando un biglietto online, accetti il presente regolamento e confermi di essere a
          conoscenza delle condizioni di visita.
        </div>

        <div class="text-h5">1. Generale</div>
        <ul>
          <li class="text-body1">
            I biglietti sono personali e validi solo per la data e l'orario indicati (se si applica
            il sistema a fasce orarie).
          </li>
        </ul>

        <div class="text-h5">2. Rimborsi e cambi</div>
        <ul>
          <li class="text-body1">
            I biglietti possono essere rimborsati o modificati fino a 24 ore prima dell'orario di
            visita indicato sul biglietto.
          </li>
          <li class="text-body1">
            Trascorso questo termine, non sarà possibile effettuare rimborsi o cambi, salvo
            annullamento o rinvio da parte della galleria.
          </li>
          <li class="text-body1">
            Nessun rimborso è previsto in caso di mancata visita per motivi personali (malattia,
            ritardo, ecc.).
          </li>
        </ul>

        <div class="text-h5">3. Ingresso</div>
        <ul>
          <li class="text-body1">
            Il biglietto deve essere mostrato (stampato o su dispositivo mobile) all'ingresso.
          </li>
          <li class="text-body1">
            L'accesso è consentito solo durante la fascia oraria indicata (se applicabile).
          </li>
        </ul>

        <div class="text-h5">4. Accessibilità</div>
        <ul>
          <li class="text-body1">
            Si informa che la galleria è accessibile solo tramite scale e
            <strong>non è dotata di rampa o ascensore</strong>.
          </li>
          <li class="text-body1">
            Siamo consapevoli dell'importanza dell'accessibilità e stiamo lavorando per migliorare
            questa condizione.
          </li>
        </ul>

        <div class="text-h5">5. Comportamento</div>
        <ul>
          <li class="text-body1">
            È vietato fumare, mangiare, comportarsi in modo rumoroso o disturbare all'interno della
            galleria.
          </li>
          <li class="text-body1">
            Si prega di seguire le istruzioni del personale e rispettare lo spazio e le opere
            d’arte.
          </li>
        </ul>

        <div class="text-h5">6. Responsabilità</div>
        <ul>
          <li class="text-body1">
            La galleria non è responsabile per ritardi, biglietti smarriti, problemi tecnici o
            malfunzionamenti dei dispositivi dei visitatori.
          </li>
        </ul>

        <div class="text-h5">7. Protezione dei dati</div>
        <ul>
          <li class="text-body1">
            Effettuando l'acquisto, accetti il trattamento dei tuoi dati personali.
          </li>
          <li class="text-body1">
            I dettagli sono disponibili nella nostra
            <router-link to="/privacy">Informativa sulla privacy</router-link>.
          </li>
        </ul>

        <div class="text-h5">8. Modifiche e forza maggiore</div>
        <ul>
          <li class="text-body1">
            La galleria si riserva il diritto di modificare orari, mostre o condizioni di visita in
            caso di forza maggiore (maltempo, lavori, ecc.).
          </li>
        </ul>
      </div>
      <q-btn
        class="q-mt-md"
        outline
        rounded
        size="md"
        icon="mdi-arrow-left-bold"
        @click="$router.go(-1)"
      />
    </small-page-container>
  </q-page>
</template>

<script setup>
import { useMeta } from 'quasar'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'

useMeta(() => {
  return {
    title: 'Aorta Social Art Gallery | Gallery Rules',
    meta: {
      robots: {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    }
  }
})
</script>

<style scoped></style>
