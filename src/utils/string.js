function camelCase(str) {
  return str
    .replace(/(?:^|\s)\w/g, match => match.toUpperCase())
    .replace(/(\s|-|_)/g, '');
}

function titleCase(str) {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i += 1) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

function startsWith(haystack, needle) {
  return haystack.indexOf(needle) === 0;
}

export default {
  camelCase,
  startsWith,
  titleCase,
};
