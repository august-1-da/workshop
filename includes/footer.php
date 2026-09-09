<footer class="altf4-footer">
    <div class="footer-menu">
        <p>Menu</p>
    </div>
    <div class="footer-timer">
        <p id="timer"></p>
    </div>
</footer>

<script src="assets/js/global.js"></script>
<script>
    recordPageTiming('fin');
    const timerElement = document.querySelector('.footer-timer');
    const timerParagraph = document.querySelector('#timer');
    if (timerElement && timerParagraph) {
        const timer = new Date();
        const hour = String(timer.getHours()).padStart(2, '0');
        const minutes = String(timer.getMinutes()).padStart(2, '0');
        const realHour = `${hour}:${minutes}`;
        timerParagraph.textContent = realHour;
    }

    setInterval(() => {
        if (timerParagraph) {
            const timer = new Date();
            const hour = String(timer.getHours()).padStart(2, '0');
            const minutes = String(timer.getMinutes()).padStart(2, '0');
            const realHour = `${hour}:${minutes}`;
            timerParagraph.textContent = realHour;
        }
    }, 1000);
</script>