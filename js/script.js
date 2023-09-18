// Define vars
let workingStatus = true;
let notification = false;
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
let htmlTimer= '&nbsp;<i class="fa-regular fa-clock" style="color: --bodyText;"></i>';
let htmlMovingTimer= '&nbsp;<i class="fa-regular fa-clock fa-bounce" style="color: --bodyText;"></i>';
let onPlay= false;
let workTheme= "--bodyText : #cc3300; --header : #802b00; --body : #FFFFFF; --headerText : #C5C6C6; --other : #a4a9c1;";
let breakTheme= "--bodyText : #516079; --header : #2E3244; --body : #FFFFFF; --headerText : #C5C6C6; --other : #ff9966;";

// Init page
workButton.setAttribute("disabled", true);
resetButton.style.display = "none";
timerDisplay(0, workMinutes);
Notification.requestPermission().then(function (result) {
    notification= true;
  });
  document.documentElement.style.cssText = workTheme;

// Listener at break and work buttons : change timer and display it
breakTime.addEventListener("change", () => {
    breakTime.value<1 ? breakTime.value= 1 : breakTime.value>60 ? breakTime.value=60 : breakTime.value = Math.trunc(breakTime.value);
    breakMinutes = breakTime.value;
    if(!workingStatus){
        timerDisplay(0, breakMinutes)
    }
})

workTime.addEventListener("change", () => {
    workTime.value<1 ? workTime.value= 1 : workTime.value>60 ? workTime.value=60 : workTime.value = Math.trunc(workTime.value);
    workMinutes = workTime.value;
    if(workingStatus){
        timerDisplay(0, workMinutes)
    }
})

// Add listener to all the buttons, and execute all the necessary actions (hide buttons, and activate others)
startButton.addEventListener("click", () => {
    onPlay= true;
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
    onPlay= false;
    resetButtonState = false;
    manipInterval();
    startButton.style.display = "block";
    resetButton.style.display = "none";
    if (!workingStatus) {
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
    workingStatus ? timerDisplay(workSeconds, workMinutes) : timerDisplay(breakSeconds, breakMinutes)
});

workButton.addEventListener("click", () => {
    workingStatus = true;
    workButton.setAttribute("disabled", true);
    breakButton.removeAttribute("disabled");
    timerDisplay(0, workMinutes)
    
});

breakButton.addEventListener("click", () => {
    workingStatus = false;
    breakButton.setAttribute("disabled", true);
    workButton.removeAttribute("disabled");
    timerDisplay(0, breakMinutes)
});

// Launch timer, or stop it
function manipInterval() {
    if (resetButtonState) {
        interval = setInterval(() => {
            countDown();
        }, 1000);
    }
    else {
        clearInterval(interval);
    }
}

function countDown() {
    // Function which launches the countdown
    // Calculate each case (if you are in break mode or not, and if you are at the end of a minute)
    if (workingStatus && workSeconds <= 0) {
        workMinutes--;
        workSeconds = 59;
        timerDisplay(workSeconds, workMinutes);
    }
    else if (!workingStatus && breakSeconds <= 0) {
        breakMinutes--;
        breakSeconds = 59;
        timerDisplay(breakSeconds, breakMinutes);
    }
    else if (workingStatus && workSeconds > 0) {
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
        workingStatus = !workingStatus;
        if(notification)notif();
    }
    if (breakMinutes == 0 && breakSeconds == 0) {
        breakMinutes = breakTime.value;
        breakSeconds = 0;
        workingStatus = !workingStatus;
        if(notification)notif();
        timerDisplay(workSeconds, workMinutes);
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
    let html= onPlay ? workingStatus ? htmlMovingTimer : htmlMovingTimer : workingStatus ? htmlTimer : htmlTimer;
    HTMLTimer.innerHTML = display(minutes) + ":" + display(seconds) + html;
    document.title= "$time - Pomodoro Timer"
    // The previous line resets the document title in order to be modified each time with the following line
    document.title= document.title.replace("$time", display(minutes) + ":" + display(seconds));
    workingStatus ? progression.setAttribute("value", timeToMS(workSeconds,workMinutes)) : progression.setAttribute("value", timeToMS(breakSeconds,breakMinutes));
    workingStatus ? progression.setAttribute("max", timeToMS(0,workTime.value)) : progression.setAttribute("max", timeToMS(0,breakTime.value));
    workingStatus ? document.documentElement.style.cssText = workTheme : document.documentElement.style.cssText = breakTheme;
}

function notif(){
    // Function to notify user when a period ends, if he accepted notifications
    const img = htmlTimer;
    const text = !workingStatus ? "It's now time to take a break ;))" : "It's time to work !!"
const notification = new Notification("Pomodoro Timer", {
  body: text,
  icon: img,
});
}
