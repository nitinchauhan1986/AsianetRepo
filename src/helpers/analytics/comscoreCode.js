export default {
  __html: `var _comscore = _comscore || [];
          var objComScore = { c1: "2", c2: "6036484" };
          window.TimesApps = window.TimesApps || {};
          function loadComscore() {
            var s = document.createElement("script"),
              el = document.getElementsByTagName("script")[0];
            s.async = true;
            s.src =
              (document.location.protocol == "https:" ? "https://sb" : "http://b") +
              ".scorecardresearch.com/beacon.js";
            el.parentNode.insertBefore(s, el);
          };

          function fireComscore() {
            if (typeof(COMSCORE) !== "undefined" && typeof(COMSCORE.beacon) === "function") {
              COMSCORE.beacon(objComScore);
            }
          }

          if (window.TimesGDPR && TimesGDPR.common.consentModule.gdprCallback) {
            TimesGDPR.common.consentModule.gdprCallback(function(dataObj) {
              if (dataObj.isEUuser) {
                objComScore["cs_ucfr"] = 0;
              }
              _comscore.push(objComScore);
              loadComscore();
              window.TimesApps.fireComscore = fireComscore;
            });
          } else{
            objComScore["cs_ucfr"] = 0;
            _comscore.push(objComScore);
            loadComscore();
          }`,
};
