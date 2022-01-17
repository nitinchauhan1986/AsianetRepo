// eslint-disable-next-line import/prefer-default-export
export const gptHeadAppendScript = `var gptScript = document.createElement('script'); gptScript.async = 'async';  gptScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js'; document.head.appendChild(gptScript);`;

export const amazonPrebidScript = `if (window.TimesGDPR && TimesGDPR.common.consentModule.gdprCallback) {
  TimesGDPR.common.consentModule.gdprCallback(function(dataObj) {
    //var countryVal = document.cookie.match(/(?:\\s)?geo_country=(\\w+);?/);
    //if (!dataObj.isEUuser && typeof countryVal === 'object' && countryVal[1] !== "IN") {
    if (!dataObj.isEUuser) {
        !function(a9,a,p,s,t,A,g){ if(a[a9])return;function q(c,r){a[a9]._Q.push([c,r])}a[a9]={init:function(){q("i",arguments)},fetchBids:function(){q("f",arguments)},setDisplayBids:function(){},targetingKeys:function(){return[]},_Q:[]};A=p.createElement(s);A.async=!0;A.src=t;g=p.getElementsByTagName(s)[0];g.parentNode.insertBefore(A,g)}("apstag",window,document,"script","//c.amazon-adsystem.com/aax2/apstag.js");
    }
  });
} else {

}`;

export const amazonPrebidScriptMobile = amazonPrebidScript;
