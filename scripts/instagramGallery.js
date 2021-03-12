function instagramGallery() {
    let gallery = $("#gallery");

    instagram.forEach(artwork => {
        let label = $(`<h2>${artwork.catergory.replace("_", " ")}</h2>`);
        let artset = $("<div>")
        .addClass("artset");

        artwork.embed.forEach(code => {
            let img = $("<div>")
            .attr('class', "image")
            .append(code);
            artset.append(img);
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