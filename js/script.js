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
workButton.setAttribute("disabled", true);
resetButton.style.display = "none";
timerDisplay(0, workMinutes)

// Listener at break and work buttons : change timer and display it
breakTime.addEventListener("change", () => {
    breakMinutes = breakTime.value;
    if(!workingState){
        timerDisplay(0, breakMinutes)
    }
})

workTime.addEventListener("change", () => {
    workMinutes = workTime.value;
    if(workingState){
        timerDisplay(0, workMinutes)
    }
})

// Add listener to all the buttons, and execute all the necessary actions (hide buttons, and activate others)
startButton.addEventListener("click", () => {
    resetButtonState = true;
    startButton.style.display = "none";
    resetButton.style.display = "block";
    workButton.setAttribute("disabled", true);
    breakButton.setAttribute("disabled", true);
    breakTime.setAttribute("disabled", true);
    workTime.setAttribute("disabled", true);
    manipInterval();
});

resetButton.addEventListener("click", () => {
    resetButtonState = false;
    manipInterval();
    startButton.style.display = "block";
    resetButton.style.display = "none";
    if (!workingState) {
        workButton.removeAttribute("disabled");
    }
    else {
        breakButton.removeAttribute("disabled");
    }
    breakTime.removeAttribute("disabled");
    workTime.removeAttribute("disabled");
    workSeconds= 0;
    breakSeconds= 0;
    workMinutes = workTime.value;
    breakMinutes = breakTime.value;
    workingState ? timerDisplay(workSeconds, workMinutes) : timerDisplay(breakSeconds, breakMinutes)
});

workButton.addEventListener("click", () => {
    workingState = true;
    workButton.setAttribute("disabled", true);
    breakButton.removeAttribute("disabled");
    timerDisplay(0, workMinutes)
    
});

breakButton.addEventListener("click", () => {
    workingState = false;
    breakButton.setAttribute("disabled", true);
    workButton.removeAttribute("disabled");
    timerDisplay(0, breakMinutes)
});

// Launch timer, or stop it
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
        workMinutes = workTime.value;
        workSeconds = 0;
        timerDisplay(workSeconds, workMinutes);
        workingState = !workingState;
    }
    if (breakMinutes == 0 && breakSeconds == 0) {
        breakMinutes = breakTime.value;
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
    // title.innerText.replace("$time", display(minutes) + ":" + display(seconds))
    workingState ? progression.setAttribute("value", timeToMS(workSeconds,workMinutes)) : progression.setAttribute("value", timeToMS(breakSeconds,breakMinutes));
    workingState ? progression.setAttribute("max", timeToMS(0,workTime.value)) : progression.setAttribute("max", timeToMS(0,breakTime.value));
}