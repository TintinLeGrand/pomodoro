// Define vars
let workingState = true;
let resetButtonState = true;
let HTMLTimer = document.getElementById("time");
let progression = document.getElementById("progression");
let title = document.getElementById("title");
let workButton = document.getElementById("work");
let breakButton = document.getElementById("break");
let startButton = document.getElementById("start");
let resetButton = document.getElementById("reset");
let breakTime = document.getElementById("numberBreak");
let workTime = document.getElementById("numberWork");
let workSeconds = 0;
let workMinutes = parseInt(workTime.getAttribute("value"));
let breakSeconds = 0;
let breakMinutes = parseInt(breakTime.getAttribute("value"));
let interval;

// Init page
breakButton.setAttribute("disabled", true);
resetButton.style.display = "none";

breakTime.addEventListener("change", () => {
    breakMinutes = breakTime.value;
})

workTime.addEventListener("change", () => {
    workMinutes = workTime.value;
})

startButton.addEventListener("click", () => {
    resetButtonState = true;
    startButton.style.display = "none";
    resetButton.style.display = "block";
    workButton.setAttribute("disabled", true);
    breakButton.setAttribute("disabled", true);
    manipInterval();
});

resetButton.addEventListener("click", () => {
    resetButtonState = false;
    manipInterval();
    startButton.style.display = "block";
    resetButton.style.display = "none";
    if (workingState) {
        workButton.setAttribute("disabled", false);
    }
    else {
        breakButton.setAttribute("disabled", false);
    }
    workSeconds= 0;
    breakSeconds= 0;
    workMinutes = workTime.value;
    breakMinutes = breakTime.value;
    workingState ? timerDisplay(workSeconds, workMinutes) : timerDisplay(breakSeconds, breakMinutes)
});

workButton.addEventListener("click", () => {

});

breakButton.addEventListener("click", () => {

});

function manipInterval() {
    if (resetButtonState) {
        interval = setInterval(() => {
            countDown();
        }, 10);
    }
    else {
        clearInterval(interval);
    }
}

function countDown() {
    // Function which launches the countdown
    let seconds, minutes;
    // Calculate each case (if you are in break mode or not, and if you are at the end of a minute)
    if (workingState && workSeconds <= 0) {
        workMinutes--;
        workSeconds = 59;
        timerDisplay(workSeconds, workMinutes);
    }
    else if (!workingState && breakSeconds <= 0) {
        breakMinutes--;
        breakSeconds = 59;
        timerDisplay(breakSeconds, breakMinutes);
    }
    else if (workingState && workSeconds > 0) {
        workSeconds--;
        timerDisplay(workSeconds, workMinutes);
    }
    else {
        breakSeconds--;
        timerDisplay(breakSeconds, breakMinutes);
    }

    // Reset timer, and switch the mode at the end of the timer
    if (workMinutes == 0 && workSeconds == 0) {
        workMinutes = workTime;
        workSeconds = 0;
        timerDisplay(workSeconds, workMinutes);
        workingState = !workingState;
    }
    if (breakMinutes == 0 && breakSeconds == 0) {
        breakMinutes = breakTime;
        breakSeconds = 0;
        timerDisplay(workSeconds, workMinutes);
        workingState = !workingState;
    }
}

function timeToMS(seconds, minutes) {
    // Function to convert sec and min in ms
    return minutes * 60 * 1000 + seconds * 1000;
}

function MSToTime(milliseconds) {
    // Function to convert ms to min and sec
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { seconds, minutes };
}

function display(time) {
    // Function which load the display, with a 0 added if it's necessary
    let StrTime = time.toString();
    StrTime = time < 10 ? "0" + StrTime : StrTime;
    return StrTime;
}

function timerDisplay(seconds, minutes) {
    // Function which displays the timer in the HTML document + progression bar
    HTMLTimer.innerHTML = display(minutes) + ":" + display(seconds);
    // title.innerHTML.replace("$time", display(minutes) + ":" + display(seconds))
    let percent = percCalc();
    progression.setAttribute("value", percent);
}

function percCalc() {
    if (workingState) {
        return timeToMS(workSeconds, workMinutes) * 100 / timeToMS(0, workTime);
    }
    return timeToMS(breakSeconds, breakMinutes) * 100 / timeToMS(0, breakTime);
}