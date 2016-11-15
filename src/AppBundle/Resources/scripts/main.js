$(document).ready(function () {
    if(typeof bonesJsonDir !== 'undefined') {
        $.getJSON(bonesJsonDir, loadGame);
    }
});

function loadGame(data) {
    if(data.bones != undefined) {
        var game = new skeletOnGame({
            canvas: {
                id: 'canvas',
                width: $('body > .container').width(),
                height: 500
            },
            objects: {
                path: bonesImagesBaseDir,
                //images: bonesImagesFilenames,
                images: data.bones
            },
            animate: (canvasType == 'learn') ? true : false
        });

        game.init();
    }
}