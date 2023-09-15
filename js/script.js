// Define vars
let workingState = true;
let pauseButton = true;
let workSeconds = 0;
let workMinutes = 25;
let workCountdown = timeToMS(workMinutes, workSeconds);
let breakSeconds = 0;
let breakMinutes = 5;
let breakCountdown = timeToMS(breakMinutes, breakSeconds);
let HTMLTimer= document.getElementById("time");
let progression= document.getElementById("progression");

interval = setInterval(() => {
    countDown();
}, 1000);

function countDown() {
    let seconds, minutes;
    if (workingState && workSeconds <= 0) {
        workMinutes--;
        workSeconds = 59;
        timerDisplay(workSeconds, workMinutes);
    }
    else if (!workingState && breakSeconds <= 0){
        breakMinutes--;
        breakSeconds = 59;
        timerDisplay(breakSeconds, breakMinutes);
    }
    else if(workingState && workSeconds> 0){
        workSeconds--;
        timerDisplay(workSeconds, workMinutes);
    }
    else{
        breakSeconds--;
        timerDisplay(breakSeconds, breakMinutes);
    }
    

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

function timeToMS(minutes, seconds) {
    // Fonction pour convertir minutes et secondes en millisecondes
    return minutes * 60 * 1000 + seconds * 1000;
}

function MSToTime(milliseconds) {
    // Fonction pour convertir millisecondes en minutes et secondes
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
}

function display(time) {
    let StrTime = time.toString();
    StrTime = time < 10 ? "0" + StrTime : StrTime;
    return StrTime;
}

function timerDisplay(seconds, minutes) {
    HTMLTimer.innerHTML = display(minutes)+":"+display(seconds);
    
    progression.innerHTML = ;
    progression.setAttribute();
    progression.setAttribute();
}