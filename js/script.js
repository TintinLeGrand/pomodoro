// Define vars
let workingState = true;
let pauseButton = true;
let workSeconds = 0;
let workMinutes = 25;
let breakSeconds = 0;
let breakMinutes = 5;
let HTMLTimer = document.getElementById("time");
let progression = document.getElementById("progression");
let title= document.getElementById("title");

interval = setInterval(() => {
    countDown();
}, 100);

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
        workMinutes = 25;
        workSeconds = 0;
        timerDisplay(workSeconds, workMinutes);
        workingState = !workingState;
    }
    if (breakMinutes == 0 && breakSeconds == 0) {
        breakMinutes = 5;
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
    progression.setAttribute('value', percCalc(seconds, minutes));
}

function percCalc(seconds, minutes){
    if(workingState){
        return timeToMS(seconds, minutes)*100/timeToMS(workSeconds, workMinutes);
    }
    return timeToMS(seconds, minutes)*100/timeToMS(breakSeconds, breakMinutes);
}