<template>
  <q-page class="q-pa-md terms-page" :lang="$i18n.locale">
    <div class="q-mx-auto" style="max-width: 900px">
      <q-card flat class="q-pa-lg">
        <div class="row items-center justify-between q-mb-md">
          <div>
            <div class="text-h5 text-weight-bold">{{ t('meta.title') }}</div>
            <div class="text-caption text-grey-7">
              {{ t('meta.lastUpdatedLabel') }} {{ t('meta.lastUpdatedDate') }}
            </div>
          </div>
        </div>

        <q-separator spaced color="negative"/>

        <div class="row">
          <aside class="col-12 col-md-4 q-pr-md q-mb-md">
            <q-card
              flat
              :class="[$q.dark.isActive ? 'bg-grey-10 text-grey-3' : 'bg-grey-1']"
              class="q-pa-md rounded-borders"
            >
              <div class="text-subtitle1 q-mb-sm">{{ t('toc.title') }}</div>
              <q-list dense class="rounded-borders">
                <q-item v-for="s in sections" :key="s.id" clickable v-ripple @click="goTo(s.id)">
                  <q-item-section>{{ s.num }}. {{ s.title }}</q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </aside>

          <article class="col-12 col-md-8">
            <section v-for="s in sections" :id="s.id" :key="s.id" class="q-mb-xl">
              <h2 class="text-h6 text-weight-bold q-mb-sm">{{ s.num }}. {{ s.title }}</h2>

              <ol v-if="s.numbered !== false" class="terms-ol">
                <li v-for="(p, idx) in s.points" :key="idx">
                  <strong>{{ s.num }}.{{ idx + 1 }}.</strong>
                  <span v-if="typeof p === 'string'"> {{ p }} </span>
                  <span v-else v-html="p.html"></span>
                </li>
              </ol>

              <div v-else class="terms-block">
                <div v-for="(p, idx) in s.points" :key="idx" class="q-mb-sm">
                  <span v-if="typeof p === 'string'">{{ p }}</span>
                  <span v-else v-html="p.html"></span>
                </div>
              </div>
            </section>
          </article>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useMeta, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const $q = useQuasar()

const messages = {
  en: {
    meta: {
      title: 'Subscription Terms — Virtual Gallery',
      lastUpdatedLabel: 'Last updated:',
      lastUpdatedDate: '19 Aug 2025'
    },
    toc: {
      title: 'Contents'
    },
    sections: {
      s1: {
        id: 'general-provisions',
        num: 1,
        title: 'General Provisions',
        points: [
          'These Subscription Terms (the “Terms”) govern the relationship between Aorta Gallery (the “Gallery”, “we”) and the consumer user (the “Client”, “you”) regarding the subscription that provides access to the virtual gallery and related digital services (the “Service”).',
          'By taking out a subscription, you confirm that you have read and accept these Terms. If you do not agree, please do not subscribe and do not use the Service.',
          'Governing law: the law of the Italian Republic. Mandatory consumer‑protection rules of your country of habitual residence continue to apply. Nothing in these Terms limits your non‑waivable consumer rights.',
          'The subscription is available to individuals aged 18 or older. Subscriptions for minors may be taken out only with the consent of a legal representative.'
        ]
      },
      s2: {
        id: 'service-description',
        num: 2,
        title: 'Description of the Service',
        points: [
          'The subscription grants access to the Aorta Gallery virtual gallery via web browser/mobile apps, including online viewing of exhibitions, special projects and additional digital materials (to the extent and composition indicated on the plan page).',
          {
            html: '<strong>Technical requirements.</strong> To access the Virtual Gallery you need:<ul><li>a stable internet connection;</li><li>a current version of a supported browser: Google Chrome, Mozilla Firefox, Microsoft Edge or Safari;</li><li>a compatible device (desktop/laptop, tablet or smartphone).</li></ul>The Virtual Gallery is powered by the three.js library; correct rendering depends on the browser’s support for WebGL (and/or WebGL 2; where available — WebGPU). We are not responsible for any mismatch of your hardware, software or settings with these requirements.'
          },
          'We may periodically modify, improve or add Service features (e.g., add sections, carry out scheduled maintenance) without materially degrading its nature and purpose for the paid term.'
        ]
      },
      s3: {
        id: 'plans-payment', num: 3, title: 'Plans, taxes, payment and auto‑renewal', points: [
          'The subscription price, its duration (e.g., monthly/annual) and included options are shown on the plan page before checkout. Prices for consumers in the EU are VAT‑inclusive. The final amount and currency are calculated based on the Client’s country in accordance with VAT rules and local law.',
          'Payment is processed online via Stripe. By subscribing, you authorize us and Stripe to charge the fee for the selected subscription period and for subsequent periods upon auto‑renewal, in accordance with your payment method’s terms.',
          'By default, the subscription automatically renews for the next equivalent period at the price in force at the time of renewal. You may disable auto‑renewal at any time from your account; in that case, access remains active until the end of the already paid period.',
          { html: '<strong>Price changes.</strong> We may change the subscription price, giving you notice at least [30] days before the next charge. If you disagree, disable auto‑renewal before the charge date.' },
          { html: '<strong>Trial period.</strong> If a free or discounted trial is offered, its conditions and duration are shown at checkout. At the end of the trial, the subscription becomes paid automatically unless you have disabled auto‑renewal in advance.' }
        ]
      },
      s4: {
        id: 'service-start',
        num: 4,
        title: 'Start of the Service',
        points: [
          'Access to the Service is activated immediately after payment confirmation (or at the start of the trial period, if offered).',
          'The invoice/receipt is sent to your e‑mail. Subscription status is available in your account.'
        ]
      },
      s5: {
        id: 'withdrawal-refunds', num: 5, title: 'Right of withdrawal and refunds', points: [
          'As a consumer, you have the right to withdraw from the paid subscription within 14 days of activation (the “withdrawal period”), unless otherwise provided in this Section.',
          { html: '<strong>Exception for digital content/services.</strong> If, at checkout, you gave your explicit consent to the immediate start of the Service and confirmed that you understand that, after activation, you lose the right of withdrawal, no refund is due for a subscription that has already been activated.' },
          'If you did not give the consent referred to in clause 5.2 and you submit a withdrawal within 14 days, we will refund the fee for the period following the termination of access; where the Service has been actually used, you owe a proportionate amount up to the moment of withdrawal. Refunds are issued via the original payment method, net of any applicable payment‑processor fees (where permitted by law).',
          { html: '<strong>How to withdraw/disable auto‑renewal.</strong> To withdraw within the withdrawal period or to disable auto‑renewal, use your account (“Manage subscription”) or e‑mail support@aortagallery.com. We may request identity verification. Suggested e‑mail text: “I hereby notify you of my withdrawal from the subscription [plan], taken out on [date], for [full name, e‑mail].”' },
          { html: '<strong>Refunds for technical outages.</strong> If the Service was materially unavailable due to our fault for an uninterrupted period of [48] hours or more, you may request an extension of access or a partial refund pro‑rata to the downtime.' }
        ]
      },
      s6: {
        id: 'account-acceptable-use',
        num: 6,
        title: 'Account and acceptable use',
        points: [
          'The subscription is personal. Sharing access with third parties, re‑selling access or other commercial use is prohibited.',
          'The Virtual Gallery content (images, video, audio, texts, software components) is protected by copyright. Only personal, non‑commercial use within the Service is allowed. Recording/copying/publishing content, circumventing technical protection measures and any actions infringing the rights of the Gallery and/or rightsholders are prohibited.',
          'You agree not to use the Service unlawfully, not to attempt unauthorized access, not to interfere with the operation of the site/apps and not to use the Service in a way that may harm us or third parties.',
          'We may temporarily suspend or terminate access in case of breach of these Terms, fraud or abuse, or non‑payment. Access may be restored once the breach is remedied.'
        ]
      },
      s7: {
        id: 'availability-support', num: 7, title: 'Availability of the Service and support', points: [
          'We strive to ensure high availability of the Service; however, uninterrupted operation is not guaranteed. Short interruptions for maintenance and updates are possible. We aim to give advance notice of planned work.',
          { html: '<strong>Support.</strong> For any questions related to the subscription and access, contact support@aortagallery.com. Response time: business days 10:00–18:00 CET.' }
        ]
      },
      s8: {
        id: 'personal-data',
        num: 8,
        title: 'Personal data',
        points: [
          'We process your personal data in accordance with our Privacy Policy, including data necessary for payment, subscription management and communications. Stripe acts as payment processor; other trusted technical providers may be engaged.',
          'You may exercise your rights of access, rectification, erasure, restriction of processing, data portability and objection as described in the Privacy Policy.'
        ]
      },
      s9: {
        id: 'intellectual-property',
        num: 9,
        title: 'Intellectual property',
        points: [
          'All rights in the Service content and software components belong to the Gallery and/or respective rightsholders. No rights are transferred to you other than a limited, non‑exclusive, non‑transferable license for personal use of the Service during the subscription term.'
        ]
      },
      s10: {
        id: 'liability',
        num: 10,
        title: 'Liability',
        points: [
          'We are not liable for lack of access caused by circumstances beyond our reasonable control (force majeure, failures of telecom providers, restrictions by platforms, etc.).',
          'To the extent permitted by law, our aggregate liability for any claim relating to the Service is limited to the amount of fees actually paid by you for the last 12 months of the subscription.',
          'Nothing in these Terms excludes or limits liability where such exclusion/limitation is prohibited by law.'
        ]
      },
      s11: {
        id: 'changes-to-terms',
        num: 11,
        title: 'Changes to the Terms',
        points: [
          'We may amend these Terms by publishing a new version on the website. Material changes affecting your rights and obligations take effect with at least 30 days’ notice before the next charge date. If you disagree with the changes, disable auto‑renewal before that date; continued use of the Service after the changes take effect constitutes acceptance of the updated Terms.'
        ]
      },
      s12: {
        id: 'dispute-resolution',
        num: 12,
        title: 'Dispute resolution',
        points: [
          'The parties will first attempt to resolve disputes amicably by contacting support.',
          'If the dispute cannot be resolved, it shall be submitted to the competent court at the Gallery’s location, without prejudice to your non‑waivable consumer right to bring proceedings in your country of residence in the EU/EEA.',
          'Alternative dispute resolution (ADR). You may contact national consumer‑protection bodies or ADR providers in your country.'
        ]
      },
      s13: {
        id: 'supplier-details',
        num: 13,
        title: 'Supplier details',
        numbered: false,
        points: [
          { html: '<strong>AORTA SOCIAL ART GALLERY DI NADZEYA NAUROTSKAYA</strong>' },
          { html: 'Address: CORSO ITALIA 146, Pisa, 56125, Italy' },
          { html: 'Partita IVA: 02303430504' },
          {
            html: 'Support e‑mail: <a href="mailto:support@aortagallery.com">support@aortagallery.com</a>'
          }
        ]
      }
    }
  },
  it: {
    meta: {
      title: 'Condizioni di abbonamento — Galleria Virtuale',
      lastUpdatedLabel: 'Ultimo aggiornamento:',
      lastUpdatedDate: '19 ago 2025'
    },
    toc: {
      title: 'Indice'
    },
    sections: {
      s1: {
        id: 'general-provisions',
        num: 1,
        title: 'Disposizioni generali',
        points: [
          'Le presenti Condizioni di Abbonamento (le “Condizioni”) regolano il rapporto tra Aorta Gallery (la “Galleria”, “noi”) e l’utente consumatore (il “Cliente”, “tu”) in relazione all’abbonamento che fornisce accesso alla galleria virtuale e ai servizi digitali connessi (il “Servizio”).',
          'Sottoscrivendo l’abbonamento, dichiari di aver letto e di accettare le presenti Condizioni. Se non concordi, ti preghiamo di non sottoscrivere e di non utilizzare il Servizio.',
          'Legge applicabile: diritto della Repubblica Italiana. Restano ferme le norme imperative di tutela del consumatore del Paese di residenza abituale. Nulla nelle presenti Condizioni limita i tuoi diritti inderogabili di consumatore.',
          'L’abbonamento è disponibile ai maggiorenni (18+). La sottoscrizione per un minore è possibile solo con il consenso del rappresentante legale.'
        ]
      },
      s2: {
        id: 'service-description', num: 2, title: 'Descrizione del Servizio', points: [
          'L’abbonamento concede l’accesso alla galleria virtuale di Aorta Gallery tramite browser web/app mobili, includendo la visione online delle esposizioni, progetti speciali e materiali digitali aggiuntivi (nella misura e composizione indicate nella pagina del piano).',
          { html: { html: '<strong>Requisiti tecnici.</strong> Per accedere alla Galleria Virtuale sono necessari:<ul><li>una connessione internet stabile;</li><li>una versione aggiornata di un browser supportato: Google Chrome, Mozilla Firefox, Microsoft Edge o Safari;</li><li>un dispositivo compatibile (desktop/portatile, tablet o smartphone).</li></ul>La Galleria Virtuale si basa sulla libreria three.js; la corretta visualizzazione dipende dal supporto nel browser di WebGL (e/o WebGL 2; ove disponibile — WebGPU). Non siamo responsabili per la mancata conformità del tuo hardware, software o impostazioni a tali requisiti.' } },
          'Possiamo modificare, migliorare o integrare periodicamente le funzionalità del Servizio (ad es. aggiungere nuove sezioni, effettuare manutenzioni programmate) senza degradarne in modo sostanziale la natura e la finalità per il periodo già pagato.'
        ]
      },
      s3: {
        id: 'plans-payment', num: 3, title: 'Piani, imposte, pagamento e rinnovo automatico', points: [
          'Il prezzo dell’abbonamento, la sua durata (es. mensile/annuale) e le opzioni incluse sono indicati nella pagina del piano prima dell’acquisto. Per i consumatori dell’UE i prezzi sono IVA inclusa. L’importo finale e la valuta sono calcolati in base al Paese del Cliente conformemente alle regole IVA e alla legislazione locale.',
          'Il pagamento avviene online tramite Stripe. Sottoscrivendo, autorizzi noi e Stripe ad addebitare il corrispettivo per il periodo scelto e per i periodi successivi in caso di rinnovo automatico, secondo i termini del tuo metodo di pagamento.',
          'Per impostazione predefinita l’abbonamento si rinnova automaticamente per il periodo equivalente successivo al prezzo in vigore al momento del rinnovo. Puoi disattivare il rinnovo automatico in qualsiasi momento dall’area personale; in tal caso, l’accesso resta attivo fino alla fine del periodo già pagato.',
          { html: '<strong>Variazione di prezzo.</strong> Possiamo modificare il prezzo dell’abbonamento con un preavviso di almeno [30] giorni prima del successivo addebito. Se non concordi, disattiva il rinnovo automatico prima di tale data.' },
          { html: '<strong>Periodo di prova.</strong> Se è previsto un periodo di prova gratuito o agevolato, le relative condizioni e la durata sono indicate al momento dell’acquisto. Al termine del periodo di prova, l’abbonamento diventa a pagamento automaticamente salvo disattivazione preventiva del rinnovo automatico.' }
        ]
      },
      s4: {
        id: 'service-start',
        num: 4,
        title: 'Inizio della prestazione',
        points: [
          'L’accesso al Servizio viene attivato immediatamente dopo la conferma del pagamento (o all’avvio del periodo di prova, se previsto).',
          'La fattura/ricevuta viene inviata all’e‑mail indicata. Lo stato dell’abbonamento è disponibile nella tua area personale.'
        ]
      },
      s5: {
        id: 'withdrawal-refunds', num: 5, title: 'Diritto di recesso e rimborsi', points: [
          'In qualità di consumatore, hai diritto di recedere dall’abbonamento a pagamento entro 14 giorni dall’attivazione (il “periodo di recesso”), salvo quanto diversamente previsto nel presente articolo.',
          { html: '<strong>Eccezione per contenuti/servizi digitali.</strong> Se, al momento dell’acquisto, hai prestato consenso espresso all’avvio immediato del Servizio e confermato di comprendere che, dopo l’attivazione, perdi il diritto di recesso, non è dovuto alcun rimborso per l’abbonamento già attivato.' },
          'Se non hai prestato il consenso di cui al punto 5.2 e comunichi il recesso entro 14 giorni, rimborseremo la quota relativa al periodo successivo alla cessazione dell’accesso; in presenza di utilizzo del Servizio, è dovuto l’importo proporzionale fino al momento del recesso. I rimborsi sono effettuati con il medesimo metodo di pagamento, al netto delle eventuali commissioni del processore di pagamento (ove consentito dalla legge).',
          { html: '<strong>Modalità di recesso/disattivazione del rinnovo automatico.</strong> Per recedere nel periodo di recesso o disattivare il rinnovo automatico, utilizza l’area personale (“Gestisci abbonamento”) oppure scrivi a support@aortagallery.com. Potremmo richiedere la verifica dell’identità. Testo suggerito dell’e‑mail: “Con la presente comunico il recesso dall’abbonamento [piano], sottoscritto in data [data], a nome di [nome e cognome, e‑mail]”.' },
          { html: '<strong>Rimborsi per indisponibilità tecnica.</strong> Se il Servizio è stato sostanzialmente indisponibile per nostra responsabilità per un periodo continuativo di [48] ore o più, puoi richiedere una proroga dell’accesso o un rimborso parziale pro‑quota per il periodo di indisponibilità.' }
        ]
      },
      s6: {
        id: 'account-acceptable-use',
        num: 6,
        title: 'Account e regole d’uso',
        points: [
          'L’abbonamento è personale. È vietata la condivisione dell’accesso con terzi, la rivendita o l’uso commerciale dell’accesso.',
          'I contenuti della Galleria Virtuale (immagini, video, audio, testi, componenti software) sono tutelati dal diritto d’autore. È consentito soltanto l’uso personale e non commerciale nell’ambito del Servizio. Sono vietate la registrazione/copia/pubblicazione dei contenuti, l’elusione di misure tecniche di protezione e qualunque attività che violi i diritti della Galleria e/o dei titolari dei diritti.',
          'Ti impegni a non utilizzare il Servizio in modo illecito, a non tentare accessi non autorizzati, a non interferire con il funzionamento del sito/app e a non utilizzare il Servizio in modalità idonee a danneggiare noi o terzi.',
          'Possiamo sospendere o cessare temporaneamente l’accesso in caso di violazione delle presenti Condizioni, frode o abuso, o mancato pagamento. In caso di rimozione della violazione, l’accesso può essere ripristinato.'
        ]
      },
      s7: {
        id: 'availability-support', num: 7, title: 'Disponibilità del Servizio e assistenza', points: [
          'Miriamo ad assicurare un’elevata disponibilità del Servizio; tuttavia non garantiamo il funzionamento ininterrotto. Sono possibili brevi interruzioni per manutenzione e aggiornamenti. Forniremo, quando possibile, un preavviso per gli interventi programmati.',
          { html: '<strong>Assistenza.</strong> Per domande relative all’abbonamento e all’accesso, contatta support@aortagallery.com. Tempi di risposta: giorni lavorativi 10:00–18:00 CET.' }
        ]
      },
      s8: {
        id: 'personal-data',
        num: 8,
        title: 'Dati personali',
        points: [
          'Trattiamo i tuoi dati personali in conformità alla nostra Informativa sulla privacy, inclusi i dati necessari al pagamento, alla gestione dell’abbonamento e alle comunicazioni. Stripe opera come processore dei pagamenti; possono essere coinvolti altri fornitori tecnici affidabili.',
          'Puoi esercitare i diritti di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione secondo quanto descritto nell’Informativa sulla privacy.'
        ]
      },
      s9: {
        id: 'intellectual-property',
        num: 9,
        title: 'Proprietà intellettuale',
        points: [
          'Tutti i diritti sui contenuti e sui componenti software del Servizio spettano alla Galleria e/o ai relativi titolari. Non ti viene trasferito alcun diritto, salvo la licenza limitata, non esclusiva e non trasferibile per l’uso personale del Servizio per la durata dell’abbonamento.'
        ]
      },
      s10: {
        id: 'liability',
        num: 10,
        title: 'Responsabilità',
        points: [
          'Non siamo responsabili per l’impossibilità di accesso dovuta a circostanze al di fuori del nostro ragionevole controllo (forza maggiore, guasti dei fornitori di telecomunicazioni, limitazioni imposte dalle piattaforme, ecc.).',
          'Nei limiti consentiti dalla legge, la nostra responsabilità complessiva per qualsiasi pretesa relativa al Servizio è limitata agli importi effettivamente pagati negli ultimi 12 mesi di abbonamento.',
          'Nulla nelle presenti Condizioni esclude o limita la responsabilità laddove tali esclusioni/limitazioni siano vietate dalla legge.'
        ]
      },
      s11: {
        id: 'changes-to-terms',
        num: 11,
        title: 'Modifica delle Condizioni',
        points: [
          'Possiamo modificare le presenti Condizioni pubblicandone una nuova versione sul sito. Le modifiche sostanziali che incidono sui tuoi diritti e obblighi diventano efficaci con un preavviso di almeno 30 giorni prima del successivo addebito. Se non concordi con le modifiche, disattiva il rinnovo automatico prima di tale data; l’uso continuato del Servizio dopo l’entrata in vigore costituisce accettazione delle Condizioni aggiornate.'
        ]
      },
      s12: {
        id: 'dispute-resolution',
        num: 12,
        title: 'Risoluzione delle controversie',
        points: [
          'Le parti tenteranno preliminarmente una risoluzione amichevole contattando l’assistenza.',
          'In mancanza di accordo, la controversia è sottoposta al foro competente presso la sede della Galleria, fatto salvo il diritto inderogabile del consumatore di adire l’autorità giudiziaria del proprio luogo di residenza nell’UE/SEE.',
          'Risoluzione alternativa delle controversie (ADR). Puoi rivolgerti agli organismi nazionali di tutela dei consumatori o agli organismi ADR del tuo Paese.'
        ]
      },
      s13: {
        id: 'supplier-details',
        num: 13,
        title: 'Dati del fornitore del Servizio',
        numbered: false,
        points: [
          { html: '<strong>AORTA SOCIAL ART GALLERY DI NADZEYA NAUROTSKAYA</strong>' },
          { html: 'Indirizzo: CORSO ITALIA 146, Pisa, 56125, Italia' },
          { html: 'Partita IVA: 02303430504' },
          {
            html: 'E‑mail assistenza: <a href="mailto:support@aortagallery.com">support@aortagallery.com</a>'
          }
        ]
      }
    }
  }
}

const { t, locale } = useI18n({ useScope: 'local', messages })

const structure = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13']

const sections = computed(() => {
  const dict = messages[locale.value.startsWith('it') ? 'it' : 'en'].sections
  return structure.map((k) => dict[k])
})

function goTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

useMeta(() => {
  return {
    title: 'Aorta Social Art Gallery',
    titleTemplate: (title) => `${title} | Terms of Sale`,
    meta: {
      robots: {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    }
  }
})
</script>

<style scoped>
.terms-ol {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
.terms-ol > li {
  margin-bottom: 0.8rem;
  line-height: 1.65;
}
.terms-block > div {
  line-height: 1.65;
}
.terms-page :deep(h2) {
  scroll-margin-top: 80px;
}
</style>
