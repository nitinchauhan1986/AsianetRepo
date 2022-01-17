/**
 * Style tag to be usd for A/B testing for the US HP in the react set-up
 * This will be used in conjunction with Script below.
 * This will be put on the <html> element by the JS for the 4 sec (defined below)
 */
export const optimizeAbTestingStyle = `.async-hide { opacity: 0 !important} `;

/**
 * JS to be loaded for A/B testing on the client side using Google Optimise JS.
 * This is being used on the Mobile US Home Page to start-with TOIPR-45779.
 * This will be inserted in the head tag of the page using <script> tag so placing only the script code here.
 * This also has the dependency of <style> tag needed to be added before it, for this we are putting <style>tag in headStyles.
 */

export function getOptimizeAbTestingScript(gtmID) {
  return `(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;})(window,document.documentElement,'async-hide','dataLayer',4000,{'${gtmID}':true});`;
}
