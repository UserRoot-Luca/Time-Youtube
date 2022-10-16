// ==UserScript==
// @name         Time Youtube
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ###
// @author       UserRoot-Luca
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function() {
    window.onload = function () {
        if (document.querySelector('.ytp-chrome-bottom')) {
            console.log("Start Time");

            const TimeFormatting = (element) => {
                let array = element.split(":");
                if (array.length < 3) { array.unshift("00"); }
                for (let i = 0; i < array.length; i++) {
                    if (array[i].length < 2) { array[i] = '0'+ array[i]; }
                }
                return array.join(":");
            }

            let TimeString = "";
            setInterval(function() {
                let Duration = document.querySelector('.ytp-time-duration').innerText.split(" ")[0];
                let TimeDuration = new Date("1970-01-01T" + TimeFormatting(Duration)).getTime();

                let CurrentTime = new Date("1970-01-01T" + TimeFormatting(document.querySelector('.ytp-time-current').innerText)).getTime();
                let dis = TimeDuration - CurrentTime;

                let multiplier = 1;
                let ElementMenu = document.querySelectorAll(".ytp-menuitem")
                for (let i = 0; i < ElementMenu.length; i++) {
                    if (ElementMenu[i].childNodes[1].innerText == "Playback speed") { 
                        if (ElementMenu[i].childNodes[2].innerText != "Normal") { multiplier = parseFloat(ElementMenu[i].childNodes[2].innerText); }
                    }
                }
                if (multiplier >= 1) { dis /= multiplier; }

                let hours   = Math.floor((dis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((dis % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((dis % (1000 * 60)) / 1000);

                if (hours   < 10 ) {hours   = "0" + hours   }
                if (minutes < 10 ) {minutes = "0" + minutes }
                if (seconds < 10 ) {seconds = "0" + seconds }

                let currentTimeString = Duration+" ( -"+hours+":"+minutes+":"+seconds+ " )";

                if (TimeString != currentTimeString) {
                    TimeString = currentTimeString
                    document.querySelector('.ytp-time-duration').innerText = currentTimeString
                }
            }, 300);
            console.log("Loaded Time");
        }
    }
})();
