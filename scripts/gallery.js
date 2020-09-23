function onResize() {
  // Gallery rescaling for landscape
  var sets = document.getElementsByClassName('set');
  if (DEVICE_TYPE == DESKTOP || DEVICE_TYPE == HALF) {
    for (var index = 0; index < sets.length; index++) {
      sets[index].style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";
    }
  } else {
    for (var index = 0; index < sets.length; index++) {
      sets[index].style.gridTemplateColumns = "1fr 1fr 1fr";
    }
  }

  // Hide update for MOBILE
  if (DEVICE_TYPE == MOBILE) {
    document.getElementsByTagName('header')[0].style.display = "none";
    document.getElementById('update').style.display = "none";
  } else {
    document.getElementsByTagName('header')[0].style.display = "block";
    document.getElementById('update').style.display = "block";
  }

  // Image View auto resize
  var imageScale = 0.9;
  var imageSize;
  if (window.innerWidth < window.innerHeight) {
    imageSize = window.innerWidth * imageScale;
  } else {
    imageSize = window.innerHeight * imageScale;
  }
  var imageView = document.getElementById('imageView');
  imageView.style.width = imageSize + "px";
  imageView.style.height = imageSize + "px";
}

function fadein(element, time) {
  var opacity = 0;
  var delay = 20;
  var delta = 1 / (time * 999 / delay);
  var intervalID = setInterval(
    function() {
      if (opacity < 1) {
        opacity = opacity + delta;
        element.style.opacity = opacity;
      } else {
        clearInterval(intervalID);
      }
    }, delay
  );
}
function fadeout(element, time) {
  var opacity = 1;
  var delay = 20;
  var delta = 1 / (time * 999 / delay);
  var intervalID = setInterval(
    function() {
      if (opacity > 0) {
        opacity = opacity - delta;
        element.style.opacity = opacity;
      } else {
        clearInterval(intervalID);
      }
    }, delay
  );
}

function clearAllIntervals() {
  var interval_id = window.setInterval("", 9999);
  for (var i = 1; i < interval_id; i++) {
    window.clearInterval(i);
  }
}

function showImage(set, imageID) {
  clearAllIntervals();

  var imageView = document.getElementById('imageView');
  var image = imageView.getElementsByTagName('img')[0];
  image.src = "resources/portfolio/high/" + set + "/" + imageID + ".png";
  imageView.style.display = 'table';
  document.getElementById('pageOverlay').style.display = 'block';

  document.body.getElementsByTagName('nav')[0].classList.add("blur");
  document.body.getElementsByTagName('header')[0].classList.add("blur");
  document.body.getElementsByTagName('article')[0].classList.add("blur");

  var intervalID = setInterval(
    function() {
      if (image.complete) {
        fadein(image, 0.2);
        clearInterval(intervalID);
      }
    }, 5
  );
}

function closeImage() {
  clearAllIntervals();

  var imageView = document.getElementById('imageView');
  var image = imageView.getElementsByTagName('img')[0];

  fadeout(image, 0.1);

  setTimeout(function() {
    image.src = "";
    imageView.style.display = 'none';
    document.getElementById('pageOverlay').style.display = 'none';

    document.body.getElementsByTagName('nav')[0].classList.remove("blur");
    document.body.getElementsByTagName('header')[0].classList.remove("blur");
    document.body.getElementsByTagName('article')[0].classList.remove("blur");
  }, 100);
}
