// Get the audio element
const mediaElement = document.getElementById("correct-sound");
// Set the volume to 50% (0.5) on page load
window.onload = function () {
    if (mediaElement) {
        mediaElement.volume = 0.2;
    }
};

document.getElementById("ctext").addEventListener("focus", function () {
    setBlink();
});

window.addEventListener("load", function () {
    var x = sentences[Math.floor(Math.random() * sentences.length)];
    document.getElementById("atext").innerHTML = x.substring(0, 1000);
    document.getElementById("ctext").focus();
    document.getElementById("ctext").style.height = w3_getStyleValue(document.getElementById("atext"), "height");
});

var blinktimeout,
    blinkstyle = "";
var cursorPos = 0;
function setBlink(a) {
    var n = cursorPos;
    if (blinkstyle == "") blinkstyle = "background-color:#00264d; color:#fff";
    if (a == "stop") blinkstyle = "";
    document.getElementById("atext").innerHTML =
        document.getElementById("atext").innerText.substr(0, n) + "<span style='" + blinkstyle + "'>" + document.getElementById("atext").innerText.substr(n, 1) + "</span>" + document.getElementById("atext").innerText.substr(n + 1);
    if (a == "stop") return false;
    if (blinkstyle == "background-color:#00264d; color:#fff") {
        blinkstyle = "background-color:none";
    } else {
        blinkstyle = "background-color:#00264d; color:#fff";
    }
    blinktimeout = window.setTimeout(setBlink, 800);
}

var dheight = w3_getStyleValue(document.getElementById("dtext"), "height");
function checkScroll() {
    var c = document.getElementById("ctext");
    var d = document.getElementById("dtext");
    var wh = window.innerHeight;
    d.innerText = c.innerText + " Typing_Speed_Website_Designed_By_Mandip_sahoo ";
    new_dheight = w3_getStyleValue(document.getElementById("dtext"), "height");
    var x = dheight.replace("px", "");
    var y = new_dheight.replace("px", "");
    if (y > x && Number(y) + Number(750) > wh) {
        window.scrollBy(0, y - x);
    }
    dheight = w3_getStyleValue(document.getElementById("dtext"), "height");
}

var start = 0,
    keycount = 0,
    wcount,
    wrongword,
    charcount,
    errcount;
function ku(e) {
    (wcount = 0), (charcount = 0), (errcount = 0);
    keycount++;
    if (start == 0) {
        initCount();
        start = 1;
    }
    var a,
        b,
        c,
        i,
        txt = "",
        aARR,
        cARR;
    checkScroll();
    a = document.getElementById("atext").innerText;
    b = document.getElementById("btext").innerText;
    c = document.getElementById("ctext").innerText;
    if (keycount + 5 < c.length) {
        c = "";
        document.getElementById("ctext").innerText = c;
    }
    cursorPos = c.length;
    window.clearTimeout(blinktimeout);
    blinkstyle = "";
    setBlink();
    for (i = 0; i < c.length; i++) {
        if (a[i] == c[i] || (a[i].charCodeAt(0) == 32 && c[i].charCodeAt(0) == 160)) {
            charcount++;
            txt += "<span class='corchar'>" + a[i] + "</span>";
            // Play correct sound
            if (i == c.length - 1) {
                document.getElementById("correct-sound").play();
            }
        } else {
            errcount++;
            txt += "<span class='errchar'>" + a[i] + "</span>";
            // Play wrong sound
            if (i == c.length - 1) {
                document.getElementById("wrong-sound").play();
            }
        }
        if (a[i] == " ") {
            c = c.substr(0, i) + "|" + c.substr(i + 1);
        }
    }
    document.getElementById("btext").innerHTML = txt + a.substr(i);
    document.getElementById("characters").innerHTML = charcount;
    document.getElementById("errors").innerHTML = errcount;
    aARR = a.split(" ");
    cARR = c.split("|");
    wrongword = 0;
    for (i = 0; i < cARR.length; i++) {
        if (cARR[i].trim() == aARR[i].trim()) {
            wcount++;
        } else {
            wrongword++;
        }
    }
    document.getElementById("words").innerHTML = Math.ceil(charcount / 5 / 5);
}

timelength = 60 * 5 - 1;
var ttimer;
function initCount() {
    document.getElementById("timefooter").innerHTML = "";
    document.getElementById("time").innerHTML = timelength;
    ttimer = window.setInterval(updateTimer, 1000);
}

function updateTimer() {
    timelength--;
    document.getElementById("time").innerHTML = timelength;
    if (timelength == 0) {
        stopTyping();
        window.clearInterval(ttimer);
        displayScore();
    }
}

function displayScore() {
    document.getElementById("startdiv").style.display = "none";
    document.getElementById("finishdiv").style.display = "block";
    window.scrollTo(0, 0);
}

function stopTyping() {
    const ctextElement = document.getElementById("ctext");
    ctextElement.contentEditable = false;

    window.addEventListener("keydown", (e) => {
        if (e.key === " ") {
            e.preventDefault();
        }
    });
}

function unfocus() {
    window.clearTimeout(blinktimeout);
    setBlink("stop");
}

function w3_getStyleValue(elmnt, style) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(elmnt, null).getPropertyValue(style);
    } else {
        return elmnt.currentStyle[style];
    }
}