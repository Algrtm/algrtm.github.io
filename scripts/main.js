function mainOnLoad() {
  document.body.className = '';
  mainOnResize();
}

function mainOnResize() {
  var navbar = document.body.getElementsByTagName('nav')[0];
  var links = navbar.getElementsByTagName('a');
  if (1.5*window.innerWidth > window.innerHeight) {
    navbar.style.fontSize = "30px";
    for (var index = 0; index < links.length; index++) {
      links[index].style.marginLeft = "0.5em";
      links[index].style.marginRight = "0.5em";
    }
  } else {
    navbar.style.fontSize = "6vw";
    for (var index = 0; index < links.length; index++) {
      links[index].style.margin = "0";
    }
  }
}
