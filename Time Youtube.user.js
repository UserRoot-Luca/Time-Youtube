// ==UserScript==
// @name         Time Youtube
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  ###
// @author       UserRoot-Luca
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function () {
    window.onload = function () {
        if (document.querySelector('.ytp-chrome-bottom')) {
            console.log("Start Script");
            var LangPag_1 = document.documentElement.lang;
            var Elements_1 = {
                "en": {
                    SpeedElementsName: "Playback speed",
                    NormalElementsName: "Normal"
                },
                "it-IT": {
                    SpeedElementsName: "Velocità di riproduzione",
                    NormalElementsName: "Normale"
                }
            };
            var TimeFormatting_1 = function (e) {
                var array = e.split(":");
                if (array.length < 3) {
                    array.unshift("00");
                }
                array.forEach(function (s, i) { if (s.length < 2) {
                    array[i] = '0' + s;
                } });
                return array.join(":");
            };
            var TimeTransform_1 = function (n) {
                var h = Math.floor((n % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var m = Math.floor((n % (1000 * 60 * 60)) / (1000 * 60));
                var s = Math.floor((n % (1000 * 60)) / 1000);
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
            var TimeString_1 = "";
            var TimeStringBar_1 = "";
            setInterval(function () {
                var Duration = document.querySelector('.ytp-time-duration').innerText.split(" ")[0];
                var TimeDuration = new Date("1970-01-01T" + TimeFormatting_1(Duration)).getTime();
                var CurrentTime = new Date("1970-01-01T" + TimeFormatting_1(document.querySelector('.ytp-time-current').innerText)).getTime();
                var Dis = TimeDuration - CurrentTime;
                var Multiplier = 1;
                var ElementMenu = document.querySelectorAll(".ytp-menuitem");
                ElementMenu.forEach(function (e) {
                    if (e.childNodes[1] != undefined) {
                        if (e.childNodes[1].innerText == Elements_1[LangPag_1].SpeedElementsName) {
                            if (e.childNodes[2].innerText != Elements_1[LangPag_1].NormalElementsName) {
                                Multiplier = parseFloat(e.childNodes[2].innerText);
                            }
                        }
                    }
                });
                if (Multiplier > 1) {
                    Dis /= Multiplier;
                }
                var DurationBar = document.querySelector(".ytp-tooltip-text").innerHTML.split(" ")[0];
                var E_MyTimeBar = document.querySelector("#MyTimeBar");
                if (!E_MyTimeBar) {
                    var E_Time = document.createElement("span");
                    E_Time.id = "MyTimeBar";
                    E_Time.setAttribute("class", "ytp-tooltip-text ytp-tooltip-text-no-title");
                    E_Time.innerHTML = "";
                    document.querySelector(".ytp-tooltip-text-wrapper").appendChild(E_Time);
                }
                if (DurationBar.split(":").length > 1) {
                    var CurrentTimeBar = new Date("1970-01-01T" + TimeFormatting_1(DurationBar)).getTime();
                    var DisBar = CurrentTimeBar - CurrentTime;
                    if (DisBar > 0) {
                        if (Multiplier > 1) {
                            DisBar /= Multiplier;
                        }
                        var EditTimeBar = TimeTransform_1(DisBar);
                        var CurrentTimeBarString = "( -" + EditTimeBar.hours + ":" + EditTimeBar.minutes + ":" + EditTimeBar.seconds + " )";
                        if (TimeStringBar_1 != CurrentTimeBarString) {
                            TimeStringBar_1 = CurrentTimeBarString;
                            E_MyTimeBar.style.display = "inline";
                            E_MyTimeBar.innerHTML = CurrentTimeBarString;
                        }
                    }
                }
                else {
                    E_MyTimeBar.style.display = "none";
                }
                var EditTime = TimeTransform_1(Dis);
                var CurrentTimeString = Duration + " ( -" + EditTime.hours + ":" + EditTime.minutes + ":" + EditTime.seconds + " )";
                if (TimeString_1 != CurrentTimeString) {
                    TimeString_1 = CurrentTimeString;
                    document.querySelector('.ytp-time-duration').innerText = CurrentTimeString;
                }
            }, 300);
            console.log("Loaded Script");
        }
    };
})();
