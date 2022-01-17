import FontFaceObserver from 'fontfaceobserver';

function addFontClass(clasName) {
  const root = document.getElementsByTagName('html')[0];

  root.classList.add(clasName);
}

export default function loadFonts() {
  const fonts = new FontFaceObserver('proximanova');

  if (
    window.sessionStorage &&
    (!sessionStorage.fontsLoaded || sessionStorage.fontsLoaded === '0')
  ) {
    Promise.all([fonts.load()]).then(
      () => {
        sessionStorage.fontsLoaded = '1';
        addFontClass('fontsLoaded');
      },
      err => {
        sessionStorage.fontsLoaded = '0';
        console.log(err);
      },
    );
  } else {
    addFontClass('fontsLoaded');
  }
}
