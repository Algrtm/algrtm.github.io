function showcaseImages() {
  var images = document.getElementById('showcase').getElementsByTagName('img');

  let files = [
    '1594353791749',
    '1594354229233',
    '1594360056479',
    '1594360278280',
    '1594879146752',
    '1596928142578',
    '1596928287737',
    '1596928461250',
    '1596928818819',
    '1597001420786',
    '1597001676721',
    '1597012926052',
    '1597013019395',
    '1597013164096',
    '1597013379856',
    '1597013485958',
    '1598390416920',
    '1598390613842',
    '1598390803289',
    '1598394466525',
    '1598395517935',
    '1598396374597',
    '1598396537100',
    '1598396753247',
    '1600044156764',
    '1600044289701',
    '1600044431275',
    '1600044897787',
    '1600046765088',
    '1600047602575',
    '1600048014186',
  ];

  var fadeDelay = 500;
  var switchDelay = 3500;

  setTimeout(function() {
    fadein(images[0], fadeDelay);
    fadein(images[1], fadeDelay);
    fadein(images[2], fadeDelay);
  }, 1000);

  setInterval(function() {
    // Fadeout
    fadeout(images[0], fadeDelay);
    fadeout(images[1], fadeDelay);
    fadeout(images[2], fadeDelay);

    // New image
    setTimeout(function() {
      do {
        var img1 = Math.floor(Math.random() * files.length);
        var img2 = Math.floor(Math.random() * files.length);
        var img3 = Math.floor(Math.random() * files.length);
      } while (img1 == img2 || img1 == img3 || img2 == img3);
      images[0].src = 'resources/portfolio/' + files[img1] + '.png';
      images[1].src = 'resources/portfolio/' + files[img2] + '.png';
      images[2].src = 'resources/portfolio/' + files[img3] + '.png';
    }, fadeDelay);

    // Fadein
    setTimeout(function() {
      fadein(images[0], fadeDelay);
      fadein(images[1], fadeDelay);
      fadein(images[2], fadeDelay);
    }, fadeDelay+200);
  }, switchDelay);
}

function fadein(element, ms) {
  var opacity = 0;
  var delay = 20;
  var delta = 1 / (ms / delay);
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
function fadeout(element, ms) {
  var opacity = 1;
  var delay = 20;
  var delta = 1 / (ms / delay);
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
