document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapBtn = document.getElementById('lapBtn');
    const countdownBtn = document.getElementById('countdownBtn');
    const lapList = document.getElementById('lapList');
    const themeSelector = document.getElementById('theme');
    const progress = document.getElementById('progress');

    let timer;
    let seconds = 0;
    let running = false;
    let countdownMode = false;
    let countdownTarget = 0;

    function updateDisplay() {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        display.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        // Update progress circle
        const progressPercentage = countdownMode 
            ? ((countdownTarget - seconds) / countdownTarget) * 100
            : (seconds % 3600) / 3600 * 100;
        progress.style.background = `conic-gradient(${getProgressColor()} ${progressPercentage}%, transparent 0)`;
    }

    function getProgressColor() {
        const theme = document.body.className;
        switch (theme) {
            case 'neon':
                return '#0f0'; // Neon Green
            case 'retro':
                return '#f9c'; // Retro Pink
            case 'classic':
                return '#00f'; // Classic Blue
            default:
                return '#0f0'; // Default to Neon Green if no theme is applied
        }
    }

    function startTimer() {
        if (!running) {
            running = true;
            timer = setInterval(() => {
                if (countdownMode) {
                    if (seconds > 0) {
                        seconds--;
                    } else {
                        resetTimer(); // Stop when countdown reaches zero
                    }
                } else {
                    seconds++;
                }
                updateDisplay();
            }, 1000);
        }
    }

    function pauseTimer() {
        if (running) {
            clearInterval(timer);
            running = false;
        }
    }

    function resetTimer() {
        clearInterval(timer);
        running = false;
        seconds = countdownMode ? countdownTarget : 0;
        updateDisplay();
        lapList.innerHTML = ''; // Clear laps
    }

    function recordLap() {
        const lapItem = document.createElement('li');
        lapItem.textContent = display.textContent;
        lapList.appendChild(lapItem);
    }

    function toggleCountdown() {
        countdownMode = !countdownMode;
        countdownBtn.textContent = countdownMode ? 'Count Up' : 'Countdown';
        if (countdownMode) {
            const input = prompt("Enter countdown time in seconds:");
            countdownTarget = parseInt(input, 10);
            if (isNaN(countdownTarget) || countdownTarget <= 0) {
                countdownTarget = 0;
                alert("Invalid input. Countdown time reset to 0.");
            }
            seconds = countdownTarget;
        } else {
            seconds = 0; // Reset to 0 when switching to count up
        }
        updateDisplay();
    }

    function changeTheme() {
        const theme = themeSelector.value;
        document.body.className = theme;

        // Hide all videos and show the one for the current theme
        const videos = document.querySelectorAll('.theme-video');
        videos.forEach(video => video.classList.remove('active'));

        const activeVideo = document.getElementById(`video${theme.charAt(0).toUpperCase() + theme.slice(1)}`);
        if (activeVideo) {
            activeVideo.classList.add('active');
        }

        updateDisplay(); // Update display to reflect theme changes
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', recordLap);
    countdownBtn.addEventListener('click', toggleCountdown);
    themeSelector.addEventListener('change', changeTheme);

    // Initialize theme on page load
    changeTheme();
});
