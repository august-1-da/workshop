<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'header.php'; ?>

<main class="contenu contenu-large">
 
  <div class="classement-container">
 
    <header class="topbar">
      <div class="mark"><span class="mark-dot" aria-hidden="true"></span> Leaderboard</div>
      <div class="tag">
        <span id="nb-joueurs"></span>
      </div>
    </header>
 
    <div id="etat-chargement" class="etat">Chargement du classement…</div>
 
    <div class="cadre-classement">
      <table class="classement" id="classement" hidden>
      <thead>
        <tr>
          <th class="col-rang">#</th>
          <th class="col-photo">Photo</th>
          <th>Joueur</th>
          <th class="col-etape">Étape</th>
          <th class="col-temps">Temps</th>
        </tr>
      </thead>
        <tbody id="classement-corps"></tbody>
      </table>
    </div>
 
  </div>
 
</main>

<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'footer.php'; ?>
<script src="assets/js/leaderboard.js"></script>
</body>
</html>