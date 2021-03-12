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

function instagramGallery() {
    let gallery = $("#gallery");

    instagram.forEach(artwork => {
        let label = $(`<h2>${artwork.catergory.replace("_", " ")}</h2>`);
        let artset = $("<div>")
        .addClass("artset");

        artwork.embed.forEach(code => {
            artset.append(code);
        });

        let section = $("<section>")
        .attr('id', artwork.catergory)
        .addClass("artsection")
        .addClass("fade");

        section.append(label);
        section.append(artset);

        gallery.append(section);
    });

    checkVisibility($(".artset"));
    window.onscroll = function() {
        checkVisibility($(".artset"));
    };

    let checkEmbedExist = setInterval(function() {
        if ($(".instagram-media-rendered").length) {
            $(".artsection").each(function(i, section) {
                $(section).removeClass("fade");
            });
           clearInterval(checkEmbedExist);
        }
     }, 100);

};