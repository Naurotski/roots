<template>
  <q-page class="q-pa-md" style="padding-top: 65px">
    <fixed-top-title :class="{ 'text-h5': $q.screen.xs }" :name="$t('auth.privacyPolicy')" />
    <small-page-container class="q-pt-md" style="max-width: 1000px">
      <div v-if="$i18n.locale === 'en'">
        <div class="text-body1">Last updated: 01/11/2024</div>
        <br />
        <div class="text-body1 text-justify">
          <b>Aorta Art Gallery</b> (hereinafter referred to as "Gallery," "we," "our," or "us")
          respects your privacy and is committed to protecting the personal data you provide to us.
          This Privacy Policy explains what data we collect, how we use it, and what rights you have
          regarding your data in accordance with the General Data Protection Regulation (GDPR)
          Regulation (EU) 2016/679 and applicable Italian legislation.
          <div class="text-h6 text-bold">1. Collection of Personal Data</div>
          We may collect and process the following data about you:
          <ul>
            <li>
              <b>Personal information: </b>Name, surname, email address, phone number, and payment
              information that you provide when registering or placing an order.
            </li>
            <li>
              <b>Transaction information: </b>Purchase history, including purchased artworks and
              transaction amounts.
            </li>
            <li>
              <b>Site usage data: </b>Information about your interactions with our site, such as the
              pages you visit and the time spent on the site.
            </li>
            <li>
              <b>Technical information: </b>IP address, device type, browser data, operating system,
              and unique device identifiers.
            </li>
          </ul>
          <div class="text-h6 text-bold">2. Use of Data</div>
          We use the collected data for the following purposes:
          <ul>
            <li>
              <b>Order processing: </b>To process and fulfill your orders, including delivery and
              providing status updates.
            </li>
            <li>
              <b>Customer support: </b>To respond to inquiries, suggestions, and complaints related
              to our site or products.
            </li>
            <li>
              <b>Marketing and advertising: </b>To send you news about our products, special offers,
              new arrivals, and other news related to the Gallery (if you have consented to this).
            </li>
            <li>
              <b>Analysis and improvement: </b>To analyze site usage, improve our services, and
              optimize the user experience.
            </li>
            <li>
              <b>Legal obligations: </b>To comply with legal requirements, including tax and
              accounting obligations.
            </li>
          </ul>
          <div class="text-h6 text-bold">3. Responsibility for Provided Data</div>
          We do not verify the accuracy of the data you provide and assume that the information you
          provide is accurate, complete, and up-to-date. You are responsible for promptly updating
          your data in case of changes. In the event of inaccurate or incomplete information, we
          cannot guarantee the full provision of our services and are not responsible for any
          consequences arising from such actions.
          <div class="text-h6 text-bold">4. Data Disclosure and Transfer</div>
          We do not share or sell your personal data to third parties, except in the following
          cases:
          <ul>
            <li>
              <b>Service providers: </b>Partner companies that help us process orders, deliver,
              process payments, and conduct marketing campaigns.
            </li>
            <li>
              <b>Legal requirements: </b>If disclosure is required by law, court order, or other
              legal act.
            </li>
            <li>
              <b>Protection of rights and security: </b>To protect the rights, property, or safety
              of the Gallery, our users, or third parties.
            </li>
          </ul>
          <div class="text-h6 text-bold">5. Data Protection</div>
          We take necessary organizational and technical measures to protect personal data from
          unauthorized access, modification, loss, or destruction, as provided by GDPR and Italian
          legislation.
          <div class="text-h6 text-bold">6. Data Retention</div>
          We will retain your personal data only for as long as necessary to fulfill the purposes
          described in this Privacy Policy or as required by EU and Italian law.
          <div class="text-h6 text-bold">7. Your Rights</div>
          Under GDPR and Italian law, you have the right to:
          <ul>
            <li><b>Access data: </b>Request a copy of the personal data we hold about you.</li>
            <li>
              <b>Correct data: </b>Request the correction or completion of your data if it is
              inaccurate or incomplete.
            </li>
            <li>
              <b>Delete data: </b>Request the deletion of your data in certain cases, such as when
              the data is no longer needed for the stated purposes.
            </li>
            <li>
              <b>Restrict processing: </b>Request temporary or permanent restrictions on the
              processing of your data.
            </li>
            <li>
              <b>Withdraw consent: </b>Withdraw your consent to data processing at any time if
              processing is based on your consent.
            </li>
          </ul>
          To exercise your rights, please contact us using the information in Section 9.
          <div class="text-h6 text-bold">8. Cookies and Similar Technologies</div>
          We use cookies and other similar technologies to improve site functionality, analyze
          usage, and provide personalized content. For more information about cookies, please see
          our [Cookie Policy].
          <div class="text-h6 text-bold">9. Contact Information</div>
          If you have questions or requests related to this Privacy Policy or the processing of your
          data, please contact us:
          <ul>
            <li><b>Email: </b><a href="mailto:support@aortagallery.com"></a></li>
            <!--          <li><b>Address: </b>[your physical address]</li>-->
            <!--          <li><b>Phone: </b>[your contact number]</li>-->
          </ul>
          <div class="text-h6 text-bold">10. Changes to the Privacy Policy</div>
          We may periodically update this Privacy Policy. When changes are made, we will post the
          updated Policy on our website with the date of the last update. We recommend that you
          periodically review the Policy to stay informed of any changes.
          <br /><br /><b>Aorta Art Gallery</b> is committed to protecting your privacy and personal
          data in accordance with GDPR and applicable Italian law.
        </div>
      </div>
      <div v-else>
        <div class="text-body1">Ultimo aggiornamento: 01/11/2024</div>
        <br />
        <div class="text-body1 text-justify">
          <b>Aorta Art Gallery</b> (di seguito “Galleria”, “noi”, “nostro”) rispetta la vostra
          privacy e si impegna a proteggere i dati personali che ci fornite. Questa Politica sulla
          Privacy spiega quali dati raccogliamo, come li utilizziamo e quali diritti avete in
          relazione ai vostri dati, in conformità con il Regolamento generale sulla protezione dei
          dati (GDPR) Regolamento UE 2016/679 e la normativa italiana applicabile.
          <div class="text-h6 text-bold">1. Raccolta di Dati Personali</div>
          Possiamo raccogliere ed elaborare i seguenti dati su di voi:
          <ul>
            <li>
              <b>Informazioni personali: </b>Nome, cognome, indirizzo email, numero di telefono e
              dati di pagamento forniti al momento della registrazione o dell’ordine.
            </li>
            <li>
              <b>Informazioni sulle transazioni: </b>Cronologia degli acquisti, inclusi le opere
              d'arte acquistate e gli importi delle transazioni.
            </li>
            <li>
              <b>Dati sull'utilizzo del sito: </b>Informazioni sulle interazioni con il nostro sito,
              come le pagine visitate e il tempo trascorso sul sito.
            </li>
            <li>
              <b>Informazioni tecniche: </b>Indirizzo IP, tipo di dispositivo, dati del browser,
              sistema operativo e identificatori univoci del dispositivo.
            </li>
          </ul>
          <div class="text-h6 text-bold">2. Utilizzo dei Dati</div>
          Utilizziamo i dati raccolti per i seguenti scopi:
          <ul>
            <li>
              <b>Elaborazione degli ordini: </b>Per elaborare ed evadere gli ordini, inclusa la
              consegna e l’aggiornamento sullo stato dell’ordine.
            </li>
            <li>
              <b>Assistenza clienti: </b>Per rispondere a domande, suggerimenti e reclami relativi
              al nostro sito o ai prodotti.
            </li>
            <li>
              <b>Marketing e pubblicità: </b>Per inviare notizie sui nostri prodotti, offerte
              speciali, nuove collezioni e altre notizie relative alla Galleria (se avete dato il
              consenso).
            </li>
            <li>
              <b>Analisi e miglioramento: </b>Per analizzare l’utilizzo del sito, migliorare i
              nostri servizi e ottimizzare l’esperienza utente.
            </li>
            <li>
              <b>Obblighi legali: </b>Per adempiere a requisiti legali, inclusi quelli fiscali e
              contabili.
            </li>
          </ul>
          <div class="text-h6 text-bold">3. Responsabilità per i Dati Forniti</div>
          Non verifichiamo l’accuratezza dei dati forniti da voi e presupponiamo che le informazioni
          che ci fornite siano precise, complete e aggiornate. Voi siete responsabili
          dell’aggiornamento tempestivo dei vostri dati in caso di modifiche. In caso di
          informazioni inesatte o incomplete, non possiamo garantire la piena fornitura dei nostri
          servizi e non ci assumiamo responsabilità per eventuali conseguenze derivanti da tali
          azioni.
          <div class="text-h6 text-bold">4. Divulgazione e Trasferimento dei Dati</div>
          Non condividiamo né vendiamo i vostri dati personali a terzi, salvo nei seguenti casi:
          <ul>
            <li>
              <b>Fornitori di servizi: </b>Aziende partner che ci aiutano nell'elaborazione degli
              ordini, nelle consegne, nella gestione dei pagamenti e nelle campagne di marketing.
            </li>
            <li>
              <b>Requisiti legali: </b>Se richiesto dalla legge, da un ordine giudiziario o da altro
              atto normativo.
            </li>
            <li>
              <b>Protezione dei diritti e sicurezza: </b>Per proteggere i diritti, la proprietà o la
              sicurezza della Galleria, dei nostri utenti o di terzi.
            </li>
          </ul>
          <div class="text-h6 text-bold">5. Protezione dei Dati</div>
          Adottiamo le misure organizzative e tecniche necessarie per proteggere i dati personali da
          accessi non autorizzati, modifiche, perdite o distruzioni, come previsto dal GDPR e dalla
          normativa italiana.
          <div class="text-h6 text-bold">6. Conservazione dei Dati</div>
          Conserviamo i vostri dati personali solo per il tempo necessario a soddisfare le finalità
          descritte nella presente Politica sulla Privacy o per il tempo richiesto dalla legge
          dell'UE e italiana.
          <div class="text-h6 text-bold">7. I vostri Diritti</div>
          Ai sensi del GDPR e della normativa italiana, avete il diritto di:
          <ul>
            <li>
              <b>Accesso ai dati: </b>Richiedere una copia dei dati personali che conserviamo su di
              voi.
            </li>
            <li>
              <b>Correzione dei dati: </b> Richiedere la correzione o il completamento dei vostri
              dati se inesatti o incompleti.
            </li>
            <li>
              <b>Cancellazione dei dati: </b>Richiedere la cancellazione dei vostri dati in alcuni
              casi, ad esempio quando i dati non sono più necessari per le finalità dichiarate.
            </li>
            <li>
              <b>Limitazione del trattamento: </b>Richiedere restrizioni temporanee o permanenti sul
              trattamento dei vostri dati.
            </li>
            <li>
              <b>Revoca del consenso: </b> Revocare il consenso al trattamento dei dati in qualsiasi
              momento se il trattamento si basa sul vostro consenso.
            </li>
          </ul>
          Per esercitare i vostri diritti, vi preghiamo di contattarci utilizzando le informazioni
          della Sezione 9.
          <div class="text-h6 text-bold">8. Cookie e Tecnologie Simili</div>
          Utilizziamo cookie e altre tecnologie simili per migliorare la funzionalità del sito,
          analizzare l’utilizzo e fornire contenuti personalizzati. Per maggiori informazioni sui
          cookie, si prega di consultare la nostra [Politica sui Cookie].
          <div class="text-h6 text-bold">9. Informazioni di Contatto</div>
          Per domande o richieste relative alla presente Politica sulla Privacy o al trattamento dei
          vostri dati, contattateci:
          <ul>
            <li><b>Email: </b><a href="mailto:support@aortagallery.com"></a></li>
            <li><b>Indirizzo: </b>[your physical address]</li>
            <li><b>Telefono: </b>[your contact number]</li>
          </ul>
          <div class="text-h6 text-bold">10. Modifiche alla Politica sulla Privacy</div>
          Potremmo aggiornare periodicamente questa Politica sulla Privacy. In caso di modifiche,
          pubblicheremo la Politica aggiornata sul nostro sito con la data dell’ultimo
          aggiornamento. Si consiglia di rivedere periodicamente la Politica per essere informati su
          eventuali modifiche.
          <br /><br /><b>Aorta Art Gallery</b> si impegna a proteggere la vostra privacy e i vostri
          dati personali in conformità con il GDPR e la normativa italiana applicabile.
        </div>
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
    title: 'Aorta Social Art Gallery | Privacy Policy',
    meta: {
      robots: {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    }
  }
})
</script>

<style scoped lang="sass">
ul
  margin-top: -3px
</style>
