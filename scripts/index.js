function isVisible(element) {
    var rect = element.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function checkVisibility(jqelements) {
    jqelements.each(function(i, element) {
        if (isVisible(element)) {
            $(element).removeClass("fade");
        } else {
            $(element).addClass("fade");
        }
    })
}

function onload() {
    $("body").removeClass("fade");
}

function gallerySwitching() {
    instagramGallery();
    gallery();
}

$(function() {
    onload();
    gallerySwitching();
});