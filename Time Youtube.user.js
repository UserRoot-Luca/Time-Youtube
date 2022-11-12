"use strict";
// ==UserScript==
// @name         Time Youtube
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  ###
// @author       UserRoot-Luca
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function () {
    window.onload = () => {
        if (document.querySelector('.ytp-chrome-bottom')) {
            console.log("Start Script");
            let LangPag = document.documentElement.lang;
            let Elements = {
                "en": {
                    SpeedElementsName: "Playback speed",
                    NormalElementsName: "Normal"
                },
                "it-IT": {
                    SpeedElementsName: "Velocità di riproduzione",
                    NormalElementsName: "Normale"
                }
            };
            const TimeFormatting = (e) => {
                let array = e.split(":");
                if (array.length < 3) {
                    array.unshift("00");
                }
                array.forEach((s, i) => { if (s.length < 2) {
                    array[i] = '0' + s;
                } });
                return array.join(":");
            };
            const TimeTransform = (n) => {
                let h = Math.floor((n % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let m = Math.floor((n % (1000 * 60 * 60)) / (1000 * 60));
                let s = Math.floor((n % (1000 * 60)) / 1000);
                if (h < 10) {
                    h = "0" + h;
                }
                if (m < 10) {
                    m = "0" + m;
                }
                if (s < 10) {
                    s = "0" + s;
                }
                return {
                    hours: String(h),
                    minutes: String(m),
                    seconds: String(s)
                };
            };
            let TimeString = "";
            let TimeStringBar = "";
            let ClassBar = "";
            setInterval(() => {
                let Duration = document.querySelector('.ytp-time-duration').innerText.split(" ")[0];
                let TimeDuration = new Date("1970-01-01T" + TimeFormatting(Duration)).getTime();
                let CurrentTime = new Date("1970-01-01T" + TimeFormatting(document.querySelector('.ytp-time-current').innerText)).getTime();
                let Dis = TimeDuration - CurrentTime;
                let Multiplier = 1;
                let ElementMenu = document.querySelectorAll(".ytp-menuitem");
                ElementMenu.forEach((e) => {
                    if (e.childNodes[1] != undefined) {
                        if (e.childNodes[1].innerText == Elements[LangPag].SpeedElementsName) {
                            if (e.childNodes[2].innerText != Elements[LangPag].NormalElementsName) {
                                Multiplier = parseFloat(e.childNodes[2].innerText);
                            }
                        }
                    }
                });
                if (Multiplier > 1) {
                    Dis /= Multiplier;
                }
                let DurationBar = document.querySelector(".ytp-tooltip-text").innerHTML.split(" ")[0];
                let E_MyTimeBar = document.querySelector("#MyTimeBar");
                if (!E_MyTimeBar) {
                    document.querySelector(".ytp-tooltip-text").getAttribute('class');
                    let E_Time = document.createElement("span");
                    E_Time.id = "MyTimeBar";
                    E_Time.setAttribute("class", "ytp-tooltip-text ytp-tooltip-text-no-title");
                    E_Time.innerHTML = "";
                    document.querySelector(".ytp-tooltip-text-wrapper").appendChild(E_Time);
                }
                if (DurationBar.split(":").length > 1) {
                    let CurrentTimeBar = new Date("1970-01-01T" + TimeFormatting(DurationBar)).getTime();
                    let DisBar = CurrentTimeBar - CurrentTime;
                    if (DisBar > 0) {
                        if (Multiplier > 1) {
                            DisBar /= Multiplier;
                        }
                        let EditTimeBar = TimeTransform(DisBar);
                        let CurrentTimeBarString = "( -" + EditTimeBar.hours + ":" + EditTimeBar.minutes + ":" + EditTimeBar.seconds + " )";
                        if (TimeStringBar != CurrentTimeBarString) {
                            TimeStringBar = CurrentTimeBarString;
                            E_MyTimeBar.style.display = "inline";
                            E_MyTimeBar.innerHTML = CurrentTimeBarString;
                        }
                    }
                }
                else if (E_MyTimeBar.style.display != "none") {
                    E_MyTimeBar.style.display = "none";
                }
                let CurrentClassBar = String(document.querySelector(".ytp-tooltip-text").getAttribute('class'));
                if (ClassBar != CurrentClassBar) {
                    ClassBar = CurrentClassBar;
                    E_MyTimeBar.setAttribute("class", CurrentClassBar);
                }
                let EditTime = TimeTransform(Dis);
                let CurrentTimeString = Duration + " ( -" + EditTime.hours + ":" + EditTime.minutes + ":" + EditTime.seconds + " )";
                if (TimeString != CurrentTimeString) {
                    TimeString = CurrentTimeString;
                    document.querySelector('.ytp-time-duration').innerText = CurrentTimeString;
                }
            }, 300);
            console.log("Loaded Script");
        }
    };
})();
