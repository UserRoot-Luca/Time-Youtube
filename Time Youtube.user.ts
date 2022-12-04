// ==UserScript==
// @name         Time Youtube
// @namespace    http://tampermonkey.net/
// @version      4.1
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
            const GetTimeMultiplier = (dis: number):number => {
                let Multiplier = 1;
                let ElementMenu = document.querySelectorAll(".ytp-menuitem")
                ElementMenu.forEach((e: any) => {
                    if (e.childNodes[1] != undefined) {
                        if (e.childNodes[1].innerText == Elements[LangPag].SpeedElementsName) {
                            if (e.childNodes[2].innerText != Elements[LangPag].NormalElementsName) { Multiplier = parseFloat(e.childNodes[2].innerText); }
                        }
                    }
                })
                if (Multiplier > 1) { return dis / Multiplier; }
                return dis;
            }

            let CurrentTime = 0;
            document.querySelector<HTMLSpanElement>(".ytp-time-current")!.addEventListener("DOMSubtreeModified", (e: any)=>{
                let Duration = document.querySelector<HTMLSpanElement>('.ytp-time-duration')!.innerText.split(" ")[0];
                let TimeDuration = new Date("1970-01-01T" + TimeFormatting(Duration)).getTime();
                CurrentTime = new Date("1970-01-01T" + TimeFormatting(e.target.innerText)).getTime();
                let EditTime = TimeTransform(GetTimeMultiplier(TimeDuration - CurrentTime));
                let EndTime = new Date((new Date().getTime() + GetTimeMultiplier(TimeDuration - CurrentTime)))
                document.querySelector<HTMLSpanElement>('.ytp-time-duration')!.innerText = Duration+" ( -"+EditTime.hours+":"+EditTime.minutes+":"+EditTime.seconds+ " / "+ EndTime.getHours() + ":" + EndTime.getMinutes() + " )";
            });

            document.querySelector<HTMLSpanElement>(".ytp-tooltip-text")!.addEventListener("DOMSubtreeModified", (e: any)=>{
                let DurationBar = String(e.target.innerHTML.split(" ")[0]);                
                let E_Class = String(e.target.getAttribute('class'));
                let E_MyTimeBar = document.querySelector<HTMLSpanElement>("#MyTimeBar");

                if (!E_MyTimeBar) {
                    let E_Time:HTMLSpanElement = document.createElement("span");
                    E_Time.id = "MyTimeBar"
                    E_Time.setAttribute("class", E_Class);
                    E_Time.innerHTML="( -00:00:00 )";
                    document.querySelector<HTMLDivElement>(".ytp-tooltip-text-wrapper")!.appendChild(E_Time);
                }
                if (DurationBar.split(":").length > 1) {
                    let CurrentTimeBar = new Date("1970-01-01T" + TimeFormatting(DurationBar)).getTime()
                    let DisBar = CurrentTimeBar - CurrentTime;
                    if (DisBar > 0) {
                        let EditTimeBar = TimeTransform(GetTimeMultiplier(DisBar));
                        E_MyTimeBar!.style.display = "inline"
                        E_MyTimeBar!.innerHTML = "( -"+EditTimeBar.hours+":"+EditTimeBar.minutes+":"+EditTimeBar.seconds+ " )";
                    }
                } else if (E_MyTimeBar!.style.display != "none") { E_MyTimeBar!.style.display = "none" }

                E_MyTimeBar!.setAttribute("class", E_Class);
            });
            console.log("Loaded Script");
        }
    }
})();