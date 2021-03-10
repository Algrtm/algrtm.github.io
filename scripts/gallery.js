function hideImage(event) {
    $("#totop").removeClass("blur");
    $("#intro").removeClass("blur");
    $("#gallery").removeClass("blur");
    $("#contacts").removeClass("blur");
    $("#pageoverlay").css("display", "none");
    $("#imageview").removeClass("show");
}

function showImage(event) {
    $("#totop").addClass("blur");
    $("#intro").addClass("blur");
    $("#gallery").addClass("blur");
    $("#contacts").addClass("blur");

    $("#pageoverlay").css("display", "block");

    let image = $("<img>").attr("src", $(event.target).parent().children().get(0).src);

    let imageView = $("#imageview");
    imageView.append(image);
    imageView.append('<div class="overlay"></div>');
    imageView.addClass("show");
    imageView.on("click", (event) => {
        hideImage(event);
        image.remove();
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
