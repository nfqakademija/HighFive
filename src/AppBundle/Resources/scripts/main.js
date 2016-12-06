/** global: boneJsonDir */
/** global: bonesJsonDir */
/** global: levelsJsonDir */
/** global: bonesImagesBaseDir */
/** global: bonesModelsBaseDir */
/** global: boneModelName */
/** global: boneId */
/** global: canvasType */
/** global: skeletOnGame */
/** global: skeletOnThreeD */

$(document).ready(function () {
    // canvas
    if(typeof bonesJsonDir !== 'undefined' && typeof bonesImagesBaseDir !== 'undefined') {
        $.getJSON(bonesJsonDir, function(bones) {
            $.getJSON(levelsJsonDir, function(levels) {
                loadGame(bones, levels);
            });
        });
    }

    // 3D
    if($('#ThreeJs').length) {
        if(typeof boneModelName !== 'undefined') {
            $.getJSON(boneJsonDir, loadFullThreeDFromJson);
        } else if(typeof boneId !== 'undefined') {
            $.getJSON(boneJsonDir, loadSingleThreeDFromJson);
        }
    }
});

function loadGame(bonesData, levelsData) {
    if(bonesData.bones != undefined && levelsData.levels != undefined) {
        var game = new skeletOnGame({
            canvas: {
                id: 'canvas',
                width: $('.main-content > .container').width(),
                height: 500
            },
            objects: {
                path: bonesImagesBaseDir,
                images: bonesData.bones
            },
            game: {
                levels: levelsData.levels
            },
            animate: (canvasType == 'learn') ? true : false,
            debug: false
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