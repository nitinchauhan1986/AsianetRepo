const ALPHA_INDEX = {
  '&lt': '<',
  '&gt': '>',
  '&quot': '"',
  '&apos': "'",
  '&amp': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&amp;': '&',
};

const decodeHtml = function decodeHtml(str) {
  if (!str || !str.length) {
    return '';
  }
  return str.replace(/&#?[0-9a-zA-Z]+;?/g, s => {
    if (s.charAt(1) === '#') {
      const code =
        s.charAt(2).toLowerCase() === 'x'
          ? parseInt(s.substr(3), 16)
          : parseInt(s.substr(2), 10);

      if (Number.isNaN(code) || code < -32768 || code > 65535) {
        return '';
      }
      return String.fromCharCode(code);
    }
    return ALPHA_INDEX[s] || s;
  });
};
export default decodeHtml;
