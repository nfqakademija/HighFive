(function() {
    var _this = this;

    /**
     * @TODO: clean up the code
     * @TODO: add comments
     */

    /**
     * @Constructor
     */
    _this.skeletOnGame = function() {
        // Create global element references
        _this.canvas = null;
        _this.grid = null;

        // _this.game = null;
        // _this.gameStarted = false;
        // _this.gameEnded = false;

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
            debug: false,
            animate: false
        }

        // Create options by extending defaults with the passed in arguments
        if (arguments[0] && typeof arguments[0] === "object") {
            _this.options = extendDefaults(defaults, arguments[0]);
        }
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
        // if (_this.game) {
        //     _this.game.addEventListener('click', _this.close.bind(_this));
        // }
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
            stroke: '#ccc',
            selectable: false,
            hoverCursor: 'default'
        });

        return rect;
    }

    /**
     * @private
     */
    function drawCanvasObjects() {
        for (var i = 0, len = _this.options.objects.images.length; i < len; i++) {
            _drawCanvasObject(_this.options.objects.path, _this.options.objects.images[i]);
        }
    }

    /**
     * @private
     */
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
            img.description = obj.description;

            img.scale(_this.options.objects.scale);

            _this.canvas.add(img);

            _this.canvas.renderAll();

            if(obj.id == 1 || _this.options.animate) {
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

        var grid = _this.options.grid;

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
        }
    }

    function onObjectClick(e) {
        if(e.target) {
            if(e.target.disableMoving == true) {
                showObjectInformation(e.target);
            }
        }
    }

    function showObjectInformation(obj) {
        log(obj.name);
        log(obj.description);
    }

    function log(v) {
        console.log(v);
    }
})();