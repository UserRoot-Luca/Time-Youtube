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
(function() {
    window.onload = () => {
        if (document.querySelector('.ytp-chrome-bottom')) {
            console.log("Start Script");
            let LangPag = document.documentElement.lang;
            let Elements:{[index: string]:{SpeedElementsName: string, NormalElementsName: string}} = {
                "en": {
                    SpeedElementsName: "Playback speed",
                    NormalElementsName: "Normal"
                },
                "it-IT": {
                    SpeedElementsName: "Velocità di riproduzione",
                    NormalElementsName: "Normale"
                }
            }

            const TimeFormatting = (e: string):string => {
                let array = e.split(":");
                if (array.length < 3) { array.unshift("00"); }
                array.forEach((s, i) => { if (s.length < 2) { array[i] = '0'+ s; }});
                return array.join(":");
            }
            const TimeTransform = (n: number):{hours: String, minutes: String, seconds: String} => {
                let h: Number | String = Math.floor((n % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let m: Number | String = Math.floor((n % (1000 * 60 * 60)) / (1000 * 60));
                let s: Number | String = Math.floor((n % (1000 * 60)) / 1000);

                if (h < 10 ) {h = "0" + h }
                if (m < 10 ) {m = "0" + m }
                if (s < 10 ) {s = "0" + s }

                return {
                    hours: String(h),
                    minutes: String(m),
                    seconds: String(s)
                };
            }

            let TimeString = "";
            let TimeStringBar = "";
            setInterval(() => {
                let Duration = document.querySelector<HTMLElement>('.ytp-time-duration')!.innerText.split(" ")[0];
                let TimeDuration = new Date("1970-01-01T" + TimeFormatting(Duration)).getTime();
                
                let CurrentTime = new Date("1970-01-01T" + TimeFormatting(document.querySelector<HTMLElement>('.ytp-time-current')!.innerText)).getTime();
                let Dis = TimeDuration - CurrentTime;

                let Multiplier = 1;
                let ElementMenu = document.querySelectorAll(".ytp-menuitem")
                ElementMenu.forEach((e: any) => {
                    if (e.childNodes[1] != undefined) {
                        if (e.childNodes[1].innerText == Elements[LangPag].SpeedElementsName) {
                            if (e.childNodes[2].innerText != Elements[LangPag].NormalElementsName) { Multiplier = parseFloat(e.childNodes[2].innerText); }
                        }
                    }
                })
                if (Multiplier > 1) { Dis /= Multiplier; }
                
                let DurationBar = document.querySelector<HTMLSpanElement>(".ytp-tooltip-text")!.innerHTML.split(" ")[0];
                let E_MyTimeBar = document.querySelector<HTMLSpanElement>("#MyTimeBar");
                if (!E_MyTimeBar) {
                    let E_Time:HTMLSpanElement = document.createElement("span");
                    E_Time.id = "MyTimeBar"
                    E_Time.setAttribute("class", "ytp-tooltip-text ytp-tooltip-text-no-title");
                    E_Time.innerHTML="";
                    document.querySelector<HTMLDivElement>(".ytp-tooltip-text-wrapper")!.appendChild(E_Time);
                }
                if (DurationBar.split(":").length > 1) {
                    let CurrentTimeBar = new Date("1970-01-01T" + TimeFormatting(DurationBar)).getTime()
                    let DisBar = CurrentTimeBar - CurrentTime;
                    if (DisBar > 0) {
                        if (Multiplier > 1) { DisBar /= Multiplier; }
                        let EditTimeBar = TimeTransform(DisBar);
                        let CurrentTimeBarString = "( -"+EditTimeBar.hours+":"+EditTimeBar.minutes+":"+EditTimeBar.seconds+ " )";
                        if (TimeStringBar != CurrentTimeBarString) {
                            TimeStringBar = CurrentTimeBarString;
                            E_MyTimeBar!.style.display = "inline"
                            E_MyTimeBar!.innerHTML = CurrentTimeBarString;
                        }
                    }
                } else { E_MyTimeBar!.style.display = "none" }


                let EditTime = TimeTransform(Dis);
                let CurrentTimeString = Duration+" ( -"+EditTime.hours+":"+EditTime.minutes+":"+EditTime.seconds+ " )";
                if (TimeString != CurrentTimeString) {
                    TimeString = CurrentTimeString
                    document.querySelector<HTMLElement>('.ytp-time-duration')!.innerText = CurrentTimeString
                }
            }, 300)
            console.log("Loaded Script");
        }
    }
})();