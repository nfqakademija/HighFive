/** global: skeletOnGame */
/** global: fabric */

(function() {
    var _this = this;
    var _game = null;

    /**
     * @Constructor
     */
    _this.skeletOnGame = function() {
        // Create global element references
        _this.canvas = null;

        // Define option defaults
        var defaults = {
            canvas: {
                id: "canvas",
                width: 1000,
                height: 500,
            },
            grid: {
                top: 0,
                left: 0,
                width: 350,
                height: 490,
                stepSize: 70,
                xColumns: 5,
                yColumns: 7
            },
            objects: {
                path: null,
                images: null,
                scale: 0.2,
                test: null
            },
            popover: {
                id: "#popover"
            },
            game: {
                started: true,
                levels: null,
                currentLevel: null,
                level: 1
            },
            modal: {
                modalId: "#levelModal",
                modalTitle: "#modalTitle",
                modalDescription: "#modalDescription",
                restartButtonId: "#restartGame",
                nextLevelButtonId: "#nextGameLevel"
            },
            debug: true,
            animate: false
        }

        // Create options by extending defaults with the passed in arguments
        if (arguments[0] && typeof arguments[0] === "object") {
            _this.options = extendDefaults(defaults, arguments[0]);
        } else {
            _this.options = defaults;
        }

        _game = _this.options.game;

        _setCurrentLevel();
    }

    /**
     * @Private
     * Utility method to extend defaults with user options
     */
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                if(properties[property].constructor === Object) {
                    source[property] = extendDefaults(source[property], properties[property]);
                } else {
                    source[property] = properties[property];
                }
            }
        }
        return source;
    }

    /**
     * @Public
     */
    skeletOnGame.prototype.init = function() {
        // Build out our Game
        initializeGame.call(_this);

        // Initialize our event listeners
        initializeEvents.call(_this);
    }

    /**
     * @Private
     */
    function reinit(reset) {
        if(reset != undefined && reset == true) {
            resetLevel();
        }

        removeCanvasObjects.call(_this);

        drawCanvasObjects.call(_this);
    }

    /**
     * @Private
     */
    function initializeGame() {
        initCanvas.call(_this);

        initCanvasEvents.call(_this);

        drawCanvasGrid.call(_this);

        drawCanvasObjects.call(_this);
    }

    /**
     * @Private
     */
    function initializeEvents() {
        $(_this.options.modal.nextLevelButtonId).on('click', function() {
            hideModal();
            _cleanGrid();
            reinit(false);
        });

        $(_this.options.modal.restartButtonId).on('click', function() {
            hideModal();
            _cleanGrid();
            reinit(true);
        });
    }

    /**
     * Canvas Game
     */

    function initCanvas() {
        _this.canvas = new fabric.Canvas(_this.options.canvas.id, {
            width: _this.options.canvas.width,
            height: _this.options.canvas.height,
            hoverCursor: 'pointer',
            selection: false,
            renderOnAddRemove: false, // speed up canvas rendering
            stateful: false, // speed up element rendering, disables element state history
        });
    }

    function initCanvasEvents() {
        _this.canvas.on({
            'object:moving': function (e) {
                disableMovementOutsideCanvas(e);

                onObjectMove(e);
            },
            'object:modified': function (e) {
                onObjectDrop(e);
            },
            'mouse:down': function (e) {
                onObjectClick(e);
            }
        });
    }

    function drawCanvasGrid() {
        var grid = _this.options.grid;

        for (var i = 0; i < grid.xColumns; i++) {
            for (var j = 0; j < grid.yColumns; j++) {
                _this.canvas.add(_drawCanvasRect(i, j, grid));
            }
        }
    }

    function _drawCanvasRect(i, j, grid) {
        var rect = new fabric.Rect({
            gridColumnId: 'rect' + i + '-' + j,
            x: i,
            y: j,
            left: i * grid.stepSize + grid.left,
            top: j * grid.stepSize + grid.top,
            width: grid.stepSize,
            height: grid.stepSize,
            fill: '#fff',
            angle: 0,
            padding: 0,
            stroke: '#fff',
            selectable: false,
            hoverCursor: 'default'
        });

        return rect;
    }

    function drawCanvasObjects() {
        for (var i = 0, len = _this.options.objects.images.length; i < len; i++) {
            _drawCanvasObject(_this.options.objects.path, _this.options.objects.images[i]);
        }
    }

    function _drawCanvasObject(path, obj) {
        fabric.Image.fromURL(path + obj.image, function (img) {
            var grid = _this.options.grid;
            var imgWidth = img.width * _this.options.objects.scale;
            var imgHeight = img.height * _this.options.objects.scale;

            img.set({
                left: fabric.util.getRandomInt(grid.width + grid.left + imgWidth + grid.stepSize, (_this.options.canvas.width - imgWidth)),
                top: fabric.util.getRandomInt(imgHeight, _this.options.canvas.height - imgHeight),
                angle: fabric.util.getRandomInt(0, 360),
            });

            img.imageId = obj.id;
            img.perPixelTargetFind = true;
            img.targetFindTolerance = 4;
            img.hasControls = img.hasBorders = true;
            img.lockScalingX = true;
            img.lockScalingY = true;

            img.setControlVisible('ml', false);
            img.setControlVisible('mb', false);
            img.setControlVisible('mr', false);
            img.setControlVisible('mt', false);

            img.setControlVisible('bl', false);
            img.setControlVisible('br', false);
            img.setControlVisible('tl', false);
            img.setControlVisible('tr', false);

            img.disableMoving = false;

            img.finalX = obj.coordinates.x;
            img.finalY = obj.coordinates.y;
            img.finalTop = obj.coordinates.top;
            img.finalLeft = obj.coordinates.left;
            img.finalAngle = obj.coordinates.angle;

            img.name = obj.name;
            img.description = obj.summary;

            img.scale(_this.options.objects.scale);

            _this.canvas.add(img);

            _this.canvas.renderAll();

            if(checkIfNeedAnimate(obj.id)) {
                animateObjectInPlace(img, 2000);
            }
        });
    }

    function checkIfObjectInFinalPosition(obj, gridObj) {
        var angleMistake = 5,
            leftMistake = 10,
            topMistake = 10;

        if(obj.finalX == gridObj.x && obj.finalY == gridObj.y) {
            log(gridObj.x + ' ' + gridObj.y);
            log(obj.left + ' ' + obj.top);
            log(obj.angle);

            if (obj.angle <= angleMistake || obj.angle >= (360 - angleMistake)) {
                if (obj.left <= (obj.finalLeft + leftMistake) && obj.left >= (obj.finalLeft - leftMistake)) {
                    if (obj.top <= (obj.finalTop + topMistake) && obj.top >= (obj.finalTop - topMistake)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function shakeObject(obj, i, max) {
        var value = obj.left;
        if(i % 2 == 0) {
            value -= 10;
        } else {
            value += 10;
        }

        obj.animate('left', value, {
            duration: 150,
            onChange: _this.canvas.renderAll.bind(_this.canvas),
            onComplete: function() {
                if(i < max) {
                    shakeObject(obj, ++i, max);
                }
            },
            easing: fabric.util.ease['easeInQuad']
        });
    }

    function animateObjectInPlace(e, duration) {
        _triggerObjectMovement(e);

        if(duration == undefined) {
            duration = 1000;
        }

        animateObject(e, 'left', e.finalLeft, duration);
        animateObject(e, 'top', e.finalTop, duration);
        animateObject(e, 'angle', e.finalAngle, duration);

        // _triggerObjectMovement(e);
    }

    function animateObject(obj, position, value, duration) {
        obj.animate(position, value, {
            duration: duration,
            onChange: _this.canvas.renderAll.bind(_this.canvas),
            onComplete: function() {
                // console.log('done');
            },
            easing: fabric.util.ease['easeInQuad']
        });
    }

    function _triggerObjectDragging(e, bool) {
        e.lockMovementX = bool;
        e.lockMovementY = bool;
        e.lockRotation = bool;
        e.hasControls = bool;
        e.hasBorders = bool;
        e.selectable = bool;
    }

    function _triggerObjectMovement(e) {
        if (!e.disableMoving) {
            _triggerObjectDragging(e, true);
            e.disableMoving = true;
        } else {
            _triggerObjectDragging(e, false);
            e.disableMoving = false;
        }
    }

    function disableMovementOutsideCanvas(e) {
        var obj = e.target;

        // if object is too big ignore
        if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
            return;
        }

        obj.setCoords();

        // top-left corner
        if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
            obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
            obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
        }

        // bottom-right corner
        if(obj.getBoundingRect().top+obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width > obj.canvas.width){
            obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
            obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
        }
    }

    function onObjectMove(e) {
        e.target.setCoords();

        _this.canvas.forEachObject(function(obj){
            if(obj.get('gridColumnId') != null) {
                obj.setCoords();

                if (e.target.intersectsWithObject(obj)) {
                    obj.set('fill', 'yellow');

                    // e.target.set({
                    //     left: Math.round(e.target.left / grid.stepSize) * grid.stepSize,
                    //     top: Math.round(e.target.top / grid.stepSize) * grid.stepSize
                    // });
                } else {
                    obj.set('fill', '#fff');
                }
            }
        });
    }

    function onObjectDrop(e) {
        e.target.setCoords();

        var inPlace = null;

        _this.canvas.forEachObject(function(obj){
            if(obj.get('gridColumnId') != null) {
                obj.setCoords();

                if (e.target.intersectsWithObject(obj)) {
                    if(checkIfObjectInFinalPosition(e.target, obj)) {
                        obj.set('fill', 'green');

                        animateObjectInPlace(e.target);

                        _addObjectToCompletedList(e.target.imageId);

                        inPlace = true;
                    } else {
                        obj.set('fill', '#fff');

                        inPlace = (inPlace != true) ? false : inPlace;
                    }
                }
            }
        });

        if(inPlace == false) {
            shakeObject(e.target, 1, 4);
        } else if(_checkIfAllObjectsInPlace()) {
            completeLevel();
        }
    }

    function onObjectClick(e) {
        if (_this.options.animate) {
            hidePopover();

            if (e.target) {
                if (e.target.disableMoving == true) {
                    showObjectInformation(e);
                }
            }
        }
    }


    /** ========== Popover ========== **/


    function showObjectInformation(e) {
        var pointer = _this.canvas.getPointer(e.e);
        var obj = e.target;

        showPopover(obj.imageId, obj.name, obj.description, pointer);
    }

    function showPopover(id, title, desc, pointer) {
        var $popover = $(_this.options.popover.id);
        var $btn = $popover.find('.btn-more');
        var link = $btn.attr('data-href') + '/' + id;

        $popover.find('.title').html(title);
        $popover.find('.description').html(desc);
        $btn.attr('href', link);

        $popover.css({'left': pointer.x, 'top': pointer.y});
        $popover.show();
    }

    function hidePopover() {
        var $popover = $(_this.options.popover.id);

        $popover.hide();
    }


    /** ========== GAME LEVELS ========== **/


    function removeCanvasObjects() {
        var remove = [];

        _this.canvas.forEachObject(function(obj){
            if(obj != undefined && obj.get('imageId') != null) {
                remove.push(obj);
            }
        });

        for(var i = 0, length = remove.length; i < length; i++) {
            _this.canvas.remove(remove[i]);
        }
    }

    function checkIfNeedAnimate(id) {
        if(_this.options.animate) {
            return true;
        } else if(_game.currentLevel.animateObjects.indexOf(id) > -1) {
            _addObjectToCompletedList(id);
            return true;
        } else {
            return false;
        }
    }

    function _addObjectToCompletedList(id) {
        _game.currentLevel.objectsInPlace.push(id);
    }

    function _removeObjectsFromCompleteList() {
        _game.currentLevel.objectsInPlace = [];
    }

    function _checkIfAllObjectsInPlace() {
        if(_game.currentLevel.objectsInPlace.length == _this.options.objects.images.length) {
            return true;
        }

        return false;
    }

    function completeLevel() {
        _removeObjectsFromCompleteList();

        if(isNextLevel()) {
            showModal(_game.currentLevel, false);

            levelUp();
        } else {
            showModal(_game.currentLevel, true);
        }
    }

    function isNextLevel() {
        if(_game.levels[_game.level] != undefined) {
            return true;
        }

        return false;
    }

    function levelUp() {
        _game.level++;

        _setCurrentLevel();
    }

    function resetLevel() {
        _game.level = 1;

        _setCurrentLevel();
    }

    function _setCurrentLevel() {
        _game.currentLevel = _game.levels[_game.level - 1];
    }

    function _cleanGrid() {
        _this.canvas.forEachObject(function(obj){
            if(obj.get('gridColumnId') != null) {
                obj.set('fill', '#fff');
            }
        });
    }


    /** ========== Modal ========== **/


    function showModal(currentLevel, completed) {
        if(completed) {
            // completed
            $(_this.options.modal.restartButtonId).show();
            $(_this.options.modal.nextLevelButtonId).hide();
        } else {
            // next level
            $(_this.options.modal.restartButtonId).hide();
            $(_this.options.modal.nextLevelButtonId).show();
        }

        $(_this.options.modal.modalTitle).text(currentLevel.level + " " + currentLevel.name);
        $(_this.options.modal.modalDescription).text(currentLevel.description);

        $(_this.options.modal.modalId).modal({
            keyboard: false,
            backdrop: 'static'
        });
    }

    function hideModal() {
        // $(_this.options.modal.modalId).modal('hide');
    }

    function log(v) {
        if(_this.options.debug) {
            console.log(v);
        }
    }
})();