$(document).ready(function () {
    if(typeof bonesJsonDir !== 'undefined') {
        $.getJSON(bonesJsonDir, loadGame);
    }

    if($('#ThreeJs').length) {
        var threeD = new skeletOnThreeD({
            path: bonesModelsBaseDir,
            model: boneModelName
        });

        threeD.init();
    }
});

function loadGame(data) {
    if(data.bones != undefined) {
        var game = new skeletOnGame({
            canvas: {
                id: 'canvas',
                width: $('.main-content > .container').width(),
                height: 500
            },
            objects: {
                path: bonesImagesBaseDir,
                images: data.bones
            },
            animate: (canvasType == 'learn') ? true : false
        });

        game.init();
    }
}