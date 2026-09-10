<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'access_guard.php'; ?>
<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'header.php'; ?>

<main class="contenu">

  <div class="feuille">

    <header class="topbar">
      <div class="mark"><span class="mark-dot" aria-hidden="true"></span> Archives de la Ville</div>
      <div class="tag">dossier / 06</div>
    </header>

    <section class="intro" aria-labelledby="page-title">
      <h1 id="page-title">Le panneau de commande dissimulé</h1>
      <p>Certains locaux techniques de l'administration étaient équipés d'un panneau de commande caché dans le décor. Le dispositif comportait plusieurs boutons peints dans la même teinte que leur support : quatre étaient de simples leurres, réagissant au clic par un message d'erreur, et un seul actionnait réellement le mécanisme. Ce dernier n'était pas installé sur le panneau lui-même, mais à l'écart, sur un mur adjacent</p>
    </section>

    <section class="panel">
      <div class="panel-bloc">
        <h2>Zone d'accès</h2>
        <p id="message-bouton" class="note-bas" role="status" aria-live="polite">Terminal en attente.</p>

        <div id="zone-boutons" class="zone-boutons">
          <button type="button" class="bouton-leurre" data-msg="Ce n'est pas le bon bouton." style="top: 20px; left: 40px;"></button>
            <button type="button" class="bouton-leurre" data-msg="Ce n'est pas le bon bouton." style="top: 120px; left: 220px;"></button>
            <button type="button" class="bouton-leurre" data-msg="Ce n'est pas le bon bouton." style="top: 60px; left: 340px;"></button>
            <button type="button" class="bouton-leurre" data-msg="Ce n'est pas le bon bouton." style="top: 180px; left: 90px;"></button>
        </div>
      </div>
    </section>

    <footer class="note-bas">Fonds documentaire · consultation sur place · reproduction interdite</footer>

    <div class="zone-sortie">
      <a href="page5.php" id="lien-sortie" class="lien-sortie masque">Quitter</a>
    </div>

  </div>
  <button type="button" id="bouton-vrai" tabindex="-1"></button>
</main>

<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'footer.php'; ?>
<script src="assets/js/scenarios/page4.js"></script>
</body>
</html>