<?php
$firstName = $_GET['first_name'] ?? '';
$lastName = $_GET['last_name'] ?? '';
?>

<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'header.php'; ?>

<main>
    <div class="result">
        <section>
            <h1>Résultats de <span id="finish-player"><?php echo htmlspecialchars($firstName . ' ' . $lastName); ?></span></h1>
            <p>Nous avons pris 6 photos pendant que vous jouiez. Choisissez celle qui apparaitra dans le leaderboard.</p>
        </section>
        <section>
            <p>Temps final</p>
            <h1 id="finish-time">00:00</h1>
        </section>
    </div>
    <div id="finish-photos" class="finish-photos">Aucune photo disponible.</div>
</main>

<?php require __DIR__ . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'footer.php'; ?>
<script src="assets/js/scenarios/fin.js"></script>
</body>
</html>
