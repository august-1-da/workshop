<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'access_guard.php'; ?>
<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'header.php'; ?>

<main class="contenu">

  <div class="feuille">

    <header class="topbar">
      <div class="mark"><span class="mark-dot" aria-hidden="true"></span> Archives de la Ville</div>
      <div class="tag">dossier / 05</div>
    </header>

    <section class="intro" aria-labelledby="page-title">
      <h1 id="page-title">Le terminal du sous-sol</h1>
      <p>Dans les années 1970, l'accès aux gros ordinateurs de l'administration passait par des terminaux installés en sous-sol. Un écran vert, un clavier lourd, et un code à saisir avant toute chose. Ce dossier conserve le manuel d'exploitation de l'un d'eux.</p>
    </section>

    <section class="panel">
      <div class="panel-bloc">
        <h2>Extrait du manuel</h2>
        <p>Chaque agent disposait d'un identifiant personnel et d'un code de service, renouvelé tous les trimestres et transmis par pli interne. Il arrivait parfois que le Code à entrer soit vide pour certaines personnes.</p>
        <p>La salle était occupée en continu, par roulement, du premier train du matin à la fermeture des bureaux. Les agents notaient leur heure d'arrivée sur un registre papier posé près de la porte, et l'opérateur de permanence contresignait chaque ouverture de session.</p>
        <p>Le matériel chauffait beaucoup. Deux ventilateurs tournaient en permanence derrière la baie, au point qu'il fallait parfois répéter deux fois une consigne pour se faire entendre d'un bout à l'autre de la pièce.</p>
      </div>

      <div class="checks panel-bloc">
        <h2>Quelques repères</h2>
        <ul>
          <li>Terminaux installés à partir de 1971</li>
          <li>Codes de service à six caractères, renouvelés chaque trimestre</li>
          <li>Salle occupée par roulement, du matin à la fermeture</li>
        </ul>
      </div>
    </section>

        <section class="panel">
      <div class="panel-bloc">
        <h2>Ouverture de session</h2>

        <p id="message-code" class="note-bas" role="status" aria-live="polite">Terminal en attente.</p>

        <label for="champ-code">Entrez le code de service : </label>
        <input
          type="text"
          id="champ-code"
          name="champ-code"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false">

        <button id="bouton-valider" class="lien-sortie" type="button">Valider</button>
      </div>
    </section>

    <footer class="note-bas">Fonds documentaire · consultation sur place · reproduction interdite</footer>

    <div class="zone-sortie">
      <a href="page4.php" id="lien-sortie" class="lien-sortie masque">Quitter</a>
    </div>

  </div>
</main>

<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'footer.php'; ?>
<script src="assets/js/scenarios/page3.js"></script>
</body>
</html>