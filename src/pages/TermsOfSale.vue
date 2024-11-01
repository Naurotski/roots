<template>
  <q-page class="q-pa-md" style="padding-top: 65px">
    <fixed-top-title :class="{ 'text-h5': $q.screen.xs }" :name="$t('auth.termsSale')" />
    <small-page-container class="q-pt-md" style="max-width: 1000px">
      <div v-if="$i18n.locale === 'en'">
        <div class="text-body1">Last updated: 01/11/2024</div>
        <br />
        <div class="text-body1 text-justify">
          <div class="text-h6 text-bold">1. General Provisions</div>
          <ul>
            <li>
              These terms of sale apply to the purchase of artworks listed in the “For Sale” section
              of the Aorta online gallery. By making a purchase, the client agrees to these terms.
            </li>
            <li>
              These terms are governed by European Union and Italian law (including Directive
              2011/83/EU on consumer rights in distance selling and Directive 97/7/EC on consumer
              protection in distance trading).
            </li>
          </ul>
          <div class="text-h6 text-bold">2. Purchasing Process and Payment</div>
          <ul>
            <li>
              Only artworks listed in the "For Sale" section are available for purchase. Please note
              that availability may be limited, and items may be sold to another client before
              payment is completed.
            </li>
            <li>
              Payment is made online using the available methods on the site. Payment must be
              completed before the order is shipped.
            </li>
          </ul>
          <div class="text-h6 text-bold">3. Shipping</div>
          <ul>
            <li>
              After payment is confirmed, the artwork will be shipped to the address provided by the
              client.
            </li>
            <li>Shipping within the European Union is included in the artwork price.</li>
            <li>
              For deliveries outside the EU, additional shipping costs may apply, which are payable
              by the buyer. The client should contact the gallery to confirm the shipping cost to
              their region.
            </li>
            <li>
              Delivery times may vary depending on the buyer’s location and the size of the artwork.
              A tracking number will be provided to the client after shipment.
            </li>
          </ul>
          <div class="text-h6 text-bold">4. International Shipping and Export Documentation</div>
          <ul>
            <li>
              For clients outside the EU, the order will include necessary documents authorizing the
              export of the artwork. Preparing these documents may take an additional 2–3 weeks.
            </li>
            <li>
              The export process is carried out in accordance with EU Regulation No. 116/2009 on the
              export of cultural goods and the national regulations of EU countries.
            </li>
            <li>
              Any additional customs duties and taxes applicable in the buyer’s country are payable
              by the buyer.
            </li>
          </ul>
          <div class="text-h6 text-bold">5. Order Cancellation and Returns</div>
          <ul>
            <li>
              In accordance with EU law, the client has the right to cancel the purchase and return
              the item within 14 days of receipt. However, the right of return may be limited if the
              artwork was custom-made or personalized.
            </li>
            <li>
              To return an item, the client must contact the gallery for details and return the
              artwork in its original condition and packaging.
            </li>
            <li>
              The artwork price will be refunded after receiving and verifying the condition of the
              returned item.
            </li>
          </ul>
          <div class="text-h6 text-bold">6. Rights and Obligations of the Parties</div>
          <ul>
            <li>
              Aorta Gallery’s Rights and Obligations
              <ul>
                <li>Ensure accurate descriptions of all artworks and their condition.</li>
                <li>
                  Ensure timely shipping after payment confirmation and, if necessary, prepare
                  export documents.
                </li>
                <li>
                  Provide support to the buyer in case of any questions or issues related to the
                  purchase and delivery.
                </li>
              </ul>
            </li>
            <li>
              Client’s Rights and Obligations
              <ul>
                <li>
                  Make payment using the chosen method and confirm the accuracy of the delivery
                  details.
                </li>
                <li>
                  Report any visible damages or discrepancies of the artwork within 48 hours of
                  receipt.
                </li>
                <li>
                  If necessary, clarify the import conditions of artworks to their country and
                  ensure payment of any customs duties or fees if applicable.
                </li>
              </ul>
            </li>
          </ul>
          <div class="text-h6 text-bold">7. Liability and Guarantee</div>
          <ul>
            <li>
              Aorta Gallery is responsible for the quality and authenticity of each artwork listed
              in the “For Sale” section, as well as its conformity to the website description.
            </li>
            <li>
              The gallery is not responsible for any damages to the artwork occurring after it has
              been handed over to the courier service. In the event of damages found upon delivery,
              the client must report this within 48 hours of receipt.
            </li>
          </ul>
          <div class="text-h6 text-bold">8. Dispute Resolution</div>
          <ul>
            <li>
              In the event of any disputes related to the purchase or delivery of artworks, the
              parties agree to attempt to resolve them amicably through negotiation.
            </li>
            <li>
              If the dispute cannot be resolved through negotiation, it shall be resolved in
              accordance with Italian law and may be submitted to the competent court at the
              gallery’s location.
            </li>
<!--            <li>-->
<!--              The client also has the right to file a complaint with the European Online Dispute-->
<!--              Resolution (ODR) platform, available at https://ec.europa.eu/consumers/odr, if located-->
<!--              within the EU.-->
<!--            </li>-->
          </ul>
        </div>
      </div>
      <div v-else>
        <div class="text-body1">Ultimo aggiornamento: 01/11/2024</div>
        <br />
        <div class="text-body1 text-justify">
          <div class="text-h6 text-bold">1. Disposizioni Generali</div>
          <ul>
            <li>
              Le presenti condizioni di vendita si applicano all’acquisto delle opere d'arte
              elencate nella sezione "In Vendita" della galleria online Aorta. Effettuando un
              acquisto, il cliente accetta queste condizioni.
            </li>
            <li>
              Queste condizioni sono regolamentate dalla normativa dell’Unione Europea e dalla legge
              italiana (compresa la Direttiva 2011/83/UE sui diritti dei consumatori nelle vendite a
              distanza e la Direttiva 97/7/CE sulla protezione dei consumatori nel commercio a
              distanza).
            </li>
          </ul>
          <div class="text-h6 text-bold">2. Processo di Acquisto e Pagamento</div>
          <ul>
            <li>
              Solo le opere elencate nella sezione "In Vendita" sono disponibili per l'acquisto. Si
              prega di notare che la disponibilità potrebbe essere limitata e che le opere
              potrebbero essere vendute ad un altro cliente prima del completamento del pagamento.
            </li>
            <li>
              Il pagamento viene effettuato online utilizzando i metodi disponibili sul sito. Il
              pagamento deve essere completato prima della spedizione dell'ordine.
            </li>
          </ul>
          <div class="text-h6 text-bold">3. Spedizione</div>
          <ul>
            <li>
              Dopo la conferma del pagamento, l'opera sarà spedita all'indirizzo fornito dal
              cliente.
            </li>
            <li>La spedizione all'interno dell'Unione Europea è inclusa nel prezzo dell'opera.</li>
            <li>
              Per le consegne al di fuori dell'UE, possono essere applicati costi di spedizione
              aggiuntivi, a carico del compratore. Il cliente è invitato a contattare la galleria
              per confermare il costo di spedizione nella sua regione.
            </li>
            <li>
              I tempi di consegna possono variare a seconda della posizione del cliente e delle
              dimensioni dell'opera. Al cliente verrà fornito un numero di tracciamento una volta
              effettuata la spedizione.
            </li>
          </ul>
          <div class="text-h6 text-bold">
            4. Spedizione Internazionale e Documenti di Esportazione
          </div>
          <ul>
            <li>
              Per i clienti al di fuori dell'UE, l'ordine includerà i documenti necessari per
              autorizzare l'esportazione dell'opera. La preparazione di tali documenti può
              richiedere ulteriori 2-3 settimane.
            </li>
            <li>
              Il processo di esportazione è condotto in conformità al Regolamento UE n. 116/2009
              sull'esportazione dei beni culturali e alle normative nazionali dei paesi dell'UE.
            </li>
            <li>
              Eventuali dazi doganali e tasse aggiuntive applicabili nel paese del cliente sono a
              carico del compratore.
            </li>
          </ul>
          <div class="text-h6 text-bold">5. Annullamento dell'Ordine e Resi</div>
          <ul>
            <li>
              In conformità con la legge dell'UE, il cliente ha il diritto di annullare l'acquisto e
              restituire l'opera entro 14 giorni dalla ricezione. Tuttavia, il diritto di
              restituzione può essere limitato se l'opera è stata realizzata su misura o
              personalizzata.
            </li>
            <li>
              Per restituire un'opera, il cliente deve contattare la galleria per i dettagli e
              restituire l'opera nello stato e nell'imballaggio originale.
            </li>
            <li>
              Il prezzo dell'opera sarà rimborsato dopo la ricezione e la verifica dello stato
              dell'opera restituita.
            </li>
          </ul>
          <div class="text-h6 text-bold">6. Diritti e Obblighi delle Parti</div>
          <ul>
            <li>
              Diritti e Obblighi della Galleria Aorta
              <ul>
                <li>Assicurare descrizioni accurate di tutte le opere e del loro stato.</li>
                <li>
                  Garantire la spedizione tempestiva dopo la conferma del pagamento e, se
                  necessario, preparare i documenti di esportazione.
                </li>
                <li>
                  Fornire supporto al compratore in caso di domande o problemi relativi all'acquisto
                  e alla consegna.
                </li>
              </ul>
            </li>
            <li>
              Diritti e Obblighi del Cliente
              <ul>
                <li>
                  Effettuare il pagamento secondo il metodo scelto e confermare l'esattezza dei dati
                  di consegna.
                </li>
                <li>
                  Segnalare eventuali danni visibili o discrepanze dell'opera entro 48 ore dalla
                  ricezione.
                </li>
                <li>
                  Se necessario, chiarire le condizioni di importazione delle opere d'arte nel
                  proprio paese e garantire il pagamento di eventuali dazi doganali o spese, se
                  applicabili.
                </li>
              </ul>
            </li>
          </ul>
          <div class="text-h6 text-bold">7. Responsabilità e Garanzia</div>
          <ul>
            <li>
              La Galleria Aorta è responsabile per la qualità e l'autenticità di ogni opera elencata
              nella sezione "In Vendita", nonché per la sua conformità alla descrizione sul sito.
            </li>
            <li>
              La galleria non è responsabile per eventuali danni all'opera verificatisi dopo il
              passaggio al servizio di corriere. In caso di danni rilevati alla consegna, il cliente
              deve segnalarlo entro 48 ore dalla ricezione.
            </li>
          </ul>
          <div class="text-h6 text-bold">8. Risoluzione delle Controversie</div>
          <ul>
            <li>
              In caso di controversie relative all'acquisto o alla consegna delle opere, le parti
              concordano di tentare di risolverle amichevolmente tramite negoziazione.
            </li>
            <li>
              Se la controversia non può essere risolta tramite negoziazione, essa sarà risolta
              secondo la legge italiana e potrà essere sottoposta al tribunale competente nel luogo
              della galleria.
            </li>
<!--            <li>-->
<!--              Il cliente ha inoltre il diritto di presentare un reclamo sulla piattaforma europea di-->
<!--              risoluzione online delle controversie (ODR), disponibile all'indirizzo-->
<!--              https://ec.europa.eu/consumers/odr, se si trova nell'UE.-->
<!--            </li>-->
          </ul>
        </div>
      </div>
      <q-btn class="q-mt-md" outline size="md" icon="mdi-arrow-left-bold" @click="$router.go(-1)" />
    </small-page-container>
  </q-page>
</template>
<script setup>
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
</script>

<style scoped lang="sass">
ul
  margin-top: -3px
</style>
