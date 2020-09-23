function mainOnLoad() {
  document.body.className = '';
  mainOnResize();
}

var DEIVCE_TYPE;
var CURRENT = -1;
var DESKTOP = 0;
var HALF = 1
var MOBILE = 2;

function mainOnResize() {
  if (window.innerWidth > window.innerHeight) {
    DEVICE_TYPE = DESKTOP;
    if (CURRENT != DEVICE_TYPE) {
      CURRENT = DEVICE_TYPE;
      switchSiteVersion();
    }
  } else if (1.5*window.innerWidth > window.innerHeight) {
    DEVICE_TYPE = HALF;
    if (CURRENT != DEVICE_TYPE) {
      CURRENT = DEVICE_TYPE;
      switchSiteVersion();
    }
  } else {
    DEVICE_TYPE = MOBILE;
    if (CURRENT != DEVICE_TYPE) {
      CURRENT = DEVICE_TYPE;
      switchSiteVersion();
    }
  }
}

function switchSiteVersion() {
  var navbar = document.body.getElementsByTagName('nav')[0];
  var navbar_links = navbar.getElementsByTagName('a');
  var textSections = document.getElementsByTagName('article')[0].getElementsByClassName('text');
  var asideSections = document.getElementsByTagName('article')[0].getElementsByTagName('aside');
  // alert(textSections[0].className);

  switch (DEVICE_TYPE) {
    case DESKTOP:
      navbar.style.fontSize = "30px";
      for (var index = 0; index < navbar_links.length; index++) {
        navbar_links[index].style.marginLeft = "0.5em";
        navbar_links[index].style.marginRight = "0.5em";
      }
      for (var index = 0; index < textSections.length; index++) {
        textSections[index].style.maxWidth = "50%";
        textSections[index].style.fontSize = "22px";
      }
      for (var index = 0; index < asideSections.length; index++) {
        asideSections[index].style.maxWidth = "50%";
      }
      break;

    case HALF:
      navbar.style.fontSize = "30px";
      for (var index = 0; index < navbar_links.length; index++) {
        navbar_links[index].style.marginLeft = "0.4em";
        navbar_links[index].style.marginRight = "0.4em";
      }
      for (var index = 0; index < textSections.length; index++) {
        textSections[index].style.maxWidth = "100%";
        textSections[index].style.fontSize = "22px";
      }
      for (var index = 0; index < asideSections.length; index++) {
        asideSections[index].style.maxWidth = "100%";
      }
      break;

    case MOBILE:
      navbar.style.fontSize = "2.5em";
      for (var index = 0; index < navbar_links.length; index++) {
        navbar_links[index].style.margin = "0";
      }
      for (var index = 0; index < textSections.length; index++) {
        textSections[index].style.maxWidth = "100%";
        textSections[index].style.fontSize = "36px";
      }
      for (var index = 0; index < asideSections.length; index++) {
        asideSections[index].style.maxWidth = "100%";
      }
      break;

  }
}
