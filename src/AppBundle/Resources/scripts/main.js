$(document).ready(function () {
    if(typeof bonesJsonDir !== 'undefined') {
        $.getJSON(bonesJsonDir, loadGame);
    }

    if($('#ThreeJs').length) {
        if(typeof boneModelName !== 'undefined') {
            loadThreeD(bonesModelsBaseDir, boneModelName);
        } else if(boneId != undefined && boneJsonDir != undefined) {
            $.getJSON(boneJsonDir, loadThreeDFromJson);
        }
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
            game: {
                levels: data.levels
            },
            animate: (canvasType == 'learn') ? true : false
        });

        game.init();
    }
}

function loadThreeDFromJson(data) {
    if(data.bones != undefined) {
        var bone = data.bones[boneId - 1];
        if(bone != null) {
            var name = bone.image.split('.png');

            loadThreeD(bonesModelsBaseDir, name[0]);
        }
    }
}

function loadThreeD(dir, name) {
    var threeD = new skeletOnThreeD({
        path: dir,
        model: name
    });

    threeD.init();
}