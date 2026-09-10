<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'access_guard.php'; ?>
<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'header.php'; ?>

<main class="contenu">
 
    <div class="consigne">
      <h1>Vous êtes entré. Vous ne sortirez pas comme ça.</h1>
 
      <p class="principe">
        Ce site compte sept pages, et chacune est verrouillée. Pour passer à la suivante, il faut
        trouver ce qui débloque la sortie : une combinaison, un bouton caché, un formulaire... Tant que la dernière page n'est pas résolue, il n'y a aucun moyen de quitter le site.
        Votre chronomètre tourne depuis votre inscription.
      </p>
 
      <p class="principe-note">
        Vous avez réussi la page 1. Il en reste six.
      </p>
      
    </div>
 
    <div class="feuille">
 
      <h2>Le petit musée virtuel de l'informatique personnelle</h2>
 
      <p id="texte-enigme">
        <p id="texte-enigme">
  Bien<strong>v</strong>enue dans le petit musée <strong>v</strong>irtuel de l'in<strong>f</strong>ormatique
  personnelle. Au début des années 1980, les premiers ordinateurs <strong>f</strong>amiliaux tenaient sur
  un bureau et pesaient par<strong>f</strong>ois plus de dix <strong>k</strong>ilos. Leur cla<strong>v</strong>ier
  mécanique, bruyant et un brin capricieux, était relié à un simple écran monochrome. On y insérait alors
  une disquette souple de cinq pouces et quart, contenant à peine quelques <strong>k</strong>ilooctets de
  données, pour char<strong>g</strong>er un jeu ou un traitement de texte rudimentaire.

  À l'époque, la mémoire <strong>v</strong>i<strong>v</strong>e se comptait en <strong>k</strong>ilooctets et non en
  <strong>g</strong>i<strong>g</strong>aoctets, et la moindre sau<strong>v</strong>e<strong>g</strong>arde
  prenait de lon<strong>g</strong>ues minutes. Beaucoup de <strong>f</strong>amilles
  <strong>g</strong>ardaient précieusement leurs <strong>v</strong>ieilles disquettes dans une boîte en
  carton, espérant qu'elles <strong>f</strong>onctionneraient encore des années plus tard, par<strong>f</strong>ois
  sans même sa<strong>v</strong>oir si le lecteur les reconnaîtrait encore.

  Appuyez sur les bonnes touches, dans le bon ordre, pour dé<strong>v</strong>errouiller la suite d.

  Le <strong>g</strong>rand public a décou<strong>v</strong>ert ensuite les premiers modems, capables de
  <strong>f</strong>aire crépiter la li<strong>g</strong>ne téléphonique pour se connecter au réseau naissant.
  Cha<strong>qu</strong>e a<strong>v</strong>ancée technique de cette période sem<strong>bl</strong>ait mineure
  sur le moment, mais elle pré<strong>p</strong>arait déjà le terrain pour ce <strong>qu</strong>i allait
  sui<strong>v</strong>re. Les premiers <strong>f</strong>orums en li<strong>g</strong>ne et les
  <strong>g</strong>roupes de discussion ont commencé à rassembler des passionnés autour de ces machines
  encore <strong>f</strong>ragiles. Ce <strong>f</strong>ut le <strong>v</strong>rai point de départ d'une
  ré<strong>v</strong>olution que personne n'a<strong>v</strong>ait <strong>v</strong>raiment
  <strong>v</strong>ue <strong>v</strong>enir, et qui allait chan<strong>g</strong>er durablement la
  manière dont chacun <strong>v</strong>i<strong>v</strong>ait au quotidien.
</p>
      </p>
 
      <div class="zone-sortie">
        <div class="voyants" id="voyants" aria-label="Progression de la combinaison">
          <span class="voyant"></span>
          <span class="voyant"></span>
          <span class="voyant"></span>
          <span class="voyant"></span>
        </div>
        <a href="page3.php" id="lien-sortie" class="lien-sortie">Quitter</a>
      </div>
 
    </div>
 
  </main>

<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'footer.php'; ?>

  <script src="assets/js/scenarios/page2.js"></script>
  </body>
</html>