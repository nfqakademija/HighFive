$(document).ready(function () {
    var game = new skeletOnGame({
        canvas: {
            id: 'canvas',
            width: $('body > .container').width(),
            height: 500
        },
        objects: {
            path: bonesImagesBaseDir,
            images: bonesImagesFilenames
        }
    });

    game.init();
});