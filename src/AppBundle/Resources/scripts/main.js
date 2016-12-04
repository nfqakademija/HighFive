$(document).ready(function () {
    if(typeof bonesJsonDir !== 'undefined' && typeof bonesImagesBaseDir !== 'undefined') {
        $.getJSON(bonesJsonDir, loadGame);
    }

    if($('#ThreeJs').length) {
        if(typeof boneModelName !== 'undefined') {
            $.getJSON(boneJsonDir, loadFullThreeDFromJson);
        } else if(typeof boneId !== 'undefined') {
            $.getJSON(boneJsonDir, loadSingleThreeDFromJson);
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

function loadFullThreeDFromJson(data) {
    if(data.bones != undefined) {
        loadThreeD(bonesModelsBaseDir, boneModelName, data.bones, false);
    }
}

function loadSingleThreeDFromJson(data) {
    if(data.bones != undefined) {
        var bone = data.bones[boneId - 1];
        if(bone != null) {
            var name = bone.image.split('.png');

            loadThreeD(bonesModelsBaseDir, name[0], data.bones, true);
        }
    }
}

function loadThreeD(dir, name, bonesData, disableClick) {
    var threeD = new skeletOnThreeD({
        id: "ThreeJs",
        path: dir,
        model: name,
        bones: bonesData,
        disableClickEvents: disableClick,
        debug: false
    });

    threeD.init();
}