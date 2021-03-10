function hideImage(event) {
    $("#totop, #intro, #gallery, #contacts, hr").removeClass("blur");
    $("#totop").css("display", "block");
    $("#imageview").removeClass("show");
    $("#pageoverlay").css("display", "none");
}

function showImage(event) {
    $("#totop, #intro, #gallery, #contacts, hr").addClass("blur");
    $("#totop").css("display", "none");
    $("#pageoverlay").css("display", "block");

    let image = $("<img>").attr("src", $(event.target).parent().children().get(0).src);
    let overlay = $('<div class="overlay"></div>');

    let imageView = $("#imageview");
    imageView.append(image);
    imageView.append(overlay);
    imageView.addClass("show");
    imageView.on("click", (event) => {
        hideImage(event);
        setTimeout(function() {
            image.remove();
            overlay.remove();
        }, 300);
    });
}

function gallery() {
    let gallery = $("#gallery");

    artworks.forEach(artwork => {
        let label = $(`<h2>${artwork.catergory.replace("_", " ")}</h2>`);
        let artset = $("<div>")
        .addClass("artset");

        artwork.links.forEach(link => {
            let img = $("<div>")
            .attr('class', "image")
            .append(`<img src="resources/portfolio/${artwork.catergory}/${link}.png"></img>`)
            .append('<div class="overlay"></div>');

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

    setTimeout(function() {
        $(".artsection").each(function(i, section) {
            $(section).removeClass("fade");
        });
    }, 500);

    gallery.on("click", ".image", (event) => showImage(event));

};
