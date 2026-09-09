<?php

require_once __DIR__ . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'database.php';
getDatabase();

?>
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>La Page des Cactus de Gérard</title>
    <link rel="stylesheet" href="assets/css/page1.css" />
    <link rel="icon" href="assets/img/icon.png" type="image/x-icon"/>
  </head>
  <body class="popup-ouverte">

  <div id="popup" class="popup-page">
    <div id="popup-inscription" class="popup-overlay"> 
        <div class="popup-header">
          
          <h2>Inscription</h2>
        </div>    
      <form id="form-inscription">
        <label>Prénom : <input type="text" id="prenom" required></label>
        <label>Nom : <input type="text" id="nom" required></label>
        <button value="Submit" type="submit">Entrer</button>
      </form>
    </div>
  </div>

<div class="cadre">
 
  <div class="banniere">La Page des Cactus de Gérard</div>
  <div class="sous-titre">
    Bienvenue sur ma page personnelle, où je partage ma passion pour les cactus.
  </div>
    
 
  
 
  <div class="contenu">
    <nav id="menu-principal">
    <a href="page2.php">Mes cactus</a>
    <a href="page2.php">Conseils</a>
    <a href="page2.php">Page Suivante</a>
    <a href="#" id="lien-quit">Quitter le site</a>
  </nav>
    
 
    <h2 id="accueil">Bienvenue</h2>
    <p>
      Bonjour et bienvenue à toi, visiteur. Je m'appelle Gérard et je collectionne les cactus
      depuis maintenant dix-sept ans. J'ai construit cette page tout seul pour partager ma
      passion avec le monde entier grâce à la magie d'Internet. N'hésite pas à signer mon livre
      d'or en bas de page, ça fait toujours plaisir.
    </p>
 
 
    <h2>Un peu d'histoire</h2>
    <p>
      Tout a commencé avec un petit Echinopsis offert par ma tante Micheline. Je l'ai posé sur
      le rebord de la fenêtre de la cuisine et je l'ai complètement oublié pendant six mois.
      Quand je l'ai retrouvé, non seulement il était toujours vivant, mais il avait doublé de
      volume. C'est à ce moment-là que j'ai compris : voilà une plante faite pour moi.
    </p>
    <p>
      Aujourd'hui ma collection compte quarante-trois spécimens répartis entre la véranda, le
      garage et, depuis l'année dernière, une petite serre montée au fond du jardin. Ma femme
      trouve que ça commence à faire beaucoup. Je lui réponds qu'un collectionneur ne s'arrête
      jamais vraiment.
    </p>
 
    <div class="image-attente">[ photo : la serre au fond du jardin ]</div>
 
    <h2 id="specimens">Mes spécimens préférés</h2>
    <table class="fiche">
      <tr>
        <th>Nom</th><th>Origine</th><th>Âge</th><th>Remarque</th>
      </tr>
      <tr>
        <td>Echinocactus grusonii</td><td>Mexique</td><td>11 ans</td>
        <td>Le fameux « coussin de belle-mère ». Piquant mais fidèle.</td>
      </tr>
      <tr>
        <td>Opuntia microdasys</td><td>Mexique</td><td>7 ans</td>
        <td>Attention aux glochides, on en retrouve dans les doigts pendant des jours.</td>
      </tr>
      <tr>
        <td>Astrophytum myriostigma</td><td>Mexique</td><td>4 ans</td>
        <td>Aucune épine. Les gens ne me croient jamais quand je dis que c'est un cactus.</td>
      </tr>
      <tr>
        <td>Cereus peruvianus</td><td>Amérique du Sud</td><td>15 ans</td>
        <td>Il a dépassé le plafond de la véranda. Problème à régler cet été.</td>
      </tr>
      <tr>
        <td>Mammillaria elongata</td><td>Mexique</td><td>3 ans</td>
        <td>Se multiplie tout seul, j'en offre à tout le voisinage.</td>
      </tr>
    </table>
 
    <hr class="separateur">
 
    <h2 id="arrosage">Mes conseils d'arrosage</h2>
    <p>
      L'erreur numéro un du débutant, c'est l'excès d'eau. Un cactus qui jaunit à la base et
      devient mou n'a pas soif : il est en train de pourrir. En hiver, de novembre à mars, je
      n'arrose absolument pas. La plante entre en repos végétatif et le moindre apport d'eau
      risque de la tuer.
    </p>
    <p>
      Au printemps, je reprends doucement, un verre d'eau tous les quinze jours, en laissant le
      substrat sécher complètement entre deux arrosages. En plein été, je passe à une fois par
      semaine, toujours le soir, jamais en plein soleil. L'eau de pluie est préférable à l'eau
      du robinet, surtout dans les régions calcaires.
    </p>
    <p>
      Pour le substrat, j'utilise un mélange maison : un tiers de terreau, un tiers de sable de
      rivière grossier, un tiers de pouzzolane. Le drainage est plus important que la richesse
      du sol. Un pot en terre cuite vaut toujours mieux qu'un pot en plastique.
    </p>
 
    <h2>Le rempotage</h2>
    <p>
      Je rempote tous les deux à trois ans, au début du printemps. Pour manipuler les grosses
      pièces sans y laisser la peau des mains, j'enroule une bande de journal plié en quatre
      autour du cactus et je m'en sers comme d'une poignée. Ça marche mieux que n'importe quel
      gant.
    </p>
    <p>
      Après le rempotage, il ne faut surtout pas arroser tout de suite. On attend une bonne
      semaine, le temps que les racines abîmées cicatrisent. Sinon, c'est la porte ouverte aux
      champignons.
    </p>
 
    <div class="image-attente">[ photo : bouture de Mammillaria en pot ]</div>
 
  </div>
 
  <div class="pied">
    Page créée par Gérard — Dernière mise à jour le 12 mars<br>
    <a href="#">Écrivez-moi</a>
  </div>
 
</div>
 
<script src="assets/js/global.js"></script>
<script src="assets/js/scenarios/page1.js"></script>
</body>
</html>
