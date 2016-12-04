(function() {
    var _this = this;

    /**
     * @Constructor
     */
    _this.skeletOnThreeD = function () {
        // Define option defaults
        var defaults = {
            id: 'ThreeJs',
            path: '/models/',
            model: 'full-skelet',
            containers: {
                preloaderId: '#preloader',
                boneTitleId: '#bone-title > b',
                boneLatinId: '#bone-latin > span',
                boneDescId: '#bone-description > span',
                boneMoreBtnId: '#bone-more-btn'
            },
            bones: null,
            disableClickEvents: false,
            debug: true
        }

        // Create options by extending defaults with the passed in arguments
        if (arguments[0] && typeof arguments[0] === "object") {
            _this.options = extendDefaults(defaults, arguments[0]);
        } else {
            _this.options = defaults;
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

    // standard global variables
    var container, scene, camera, renderer, controls;

    // intersection global variables
    var targetList = [];
    var projector, mouse = { x: 0, y: 0 }, INTERSECTED;
    var vector, raycaster;

    // camera global variables
    var width = window.innerWidth,
        height = window.innerHeight,
        pixelRation = window.devicePixelRatio,
        viewAngle = 75,
        aspectRatio = width / height,
        near = 0.1,
        far = 10000;

    /**
     * @Public
     * Initialize the library
     */
    skeletOnThreeD.prototype.init = function() {
        updateVariables();

        if(_this.options.disableClickEvents) {
            showBoneInfo(_this.options.model);
        }

        init();

        animate();
    }

    /**
     * @Private
     * Animation per frame
     */
    function animate() {
        requestAnimationFrame( animate );

        render();
    }

    /**
     * @Private
     * Render objects into canvas
     */
    function render() {
        renderer.render( scene, camera );

        controls.update();
    }

    /**
     * @Private
     * Initialize everything
     */
    function init() {
        // SCENE
        _initScene();

        // CAMERA
        _initCamera();

        // ADD AMBIENT LIGHT
        addToScene( getAmbientLight() );

        // ADD DIRECTIONAL LIGHT FRONT
        addToScene( getDirectionalLight(0, 0, 1) );

        // ADD DIRECTIONAL LIGHT BACK
        addToScene( getDirectionalLight(0, 0, -1) );

        // MODEL
        _loadModel();

        // RENDERER
        _initRenderer();

        // CONTAINER
        _initContainer();

        // CONTROLS
        _initControls();

        // PROJECTOR
        _initProjector();

        // RAYCASTER
        _initRaycaster();

        // EVENTS
        _initEvents();
    }

    // INIT FUNCTIONS

    function _initScene() {
        scene = new THREE.Scene();
    }

    function _initCamera() {
        camera = new THREE.PerspectiveCamera( viewAngle, aspectRatio, near, far );
        camera.position.z = 40;

        camera.lookAt(scene.position);
    }

    function _loadModel() {
        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                var percent = Math.round(percentComplete, 2);

                console.log( percent + '% downloaded' );

                if(percent == 100) {
                    hidePreloader();
                }
            }
        };

        var onError = function ( xhr ) { };

        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath( _this.options.path );

        mtlLoader.load( _this.options.model + '.mtl', function( materials ) {
            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( _this.options.path );

            objLoader.load( _this.options.model + '.obj', function ( object ) {
                object.traverse( function ( child ) {
                    if ( child instanceof THREE.Mesh ) {
                        //The child is the bit needed for the raycaster.intersectObject() method
                        targetList.push(child);
                    }
                });

                addToScene( object );

            }, onProgress, onError );
        });
    }

    function _initContainer() {
        container = document.getElementById(_this.options.id);
        container.appendChild( renderer.domElement );
    }

    function _initRenderer() {
        // DETECTOR
        if (Detector.webgl) {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } else {
            renderer = new THREE.CanvasRenderer();
        }

        // RENDERER
        renderer.setPixelRatio( pixelRation );
        renderer.setSize( width, height );
    }

    function _initControls() {
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.autoRotate = false;
    }

    function _initProjector() {
        // initialize object to perform world/screen calculations
        projector = new THREE.Projector();
    }

    function _initRaycaster() {
        // create a Raycaster with origin at the mouse position
        //   and direction into the scene (camera direction)

        vector = new THREE.Vector3();
        raycaster = new THREE.Raycaster();
    }

    function _initEvents() {
        // on window resize
        window.addEventListener( 'resize', onWindowResize, false );

        if(!_this.options.disableClickEvents) {
            // on mouse click
            document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        }
    }

    // RANDOM FUNCTIONS

    function addToScene(param) {
        scene.add(param);
    }

    function getAmbientLight() {
        var ambient = new THREE.AmbientLight( 0x444444 );

        return ambient;
    }

    function getDirectionalLight(x, y, z) {
        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set(x, y, z).normalize();

        return directionalLight;
    }

    function hidePreloader() {
        $(_this.options.containers.preloaderId).hide();
    }

    function updateVariables() {
        var $el = $('#' + _this.options.id);

        width = $el.outerWidth();
        height = $el.outerHeight();
        aspectRatio = width / height;
    }

    // LISTENER FUNCTIONS

    function onWindowResize() {
        updateVariables();

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize( width, height );
    }

    function onDocumentMouseDown( event ) {
        // the following line would stop any other event handler from firing
        // (such as the mouse's TrackballControls)
        event.preventDefault();

        updateVariables();

        // update the mouse variable
        var rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

        // update raycaster
        vector.set( mouse.x, mouse.y, 0.5 );
        vector.unproject( camera );
        raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

        // required, since you haven't rendered yet
        scene.updateMatrixWorld();

        // find intersections
        onIntersect();
    }

    function onIntersect() {
        // create an array containing all objects in the scene with which the ray intersects
        var intersects = raycaster.intersectObjects( targetList, true );

        // if there is one (or more) intersections
        if ( intersects.length > 0 ) {
            INTERSECTED = intersects[0];

            log("Hit @ " + toString( INTERSECTED.point ) );

            changeMaterialColor();

            if(INTERSECTED.object.name != undefined) {
                showBoneInfo(INTERSECTED.object.name);
            }
        } else {
            INTERSECTED = null;
        }
    }

    // INFO FUNCTIONS

    function showBoneInfo(name) {
        var info = _findBoneInfoFromName(name);

        updateBoneInfo(info);

        log(name);
    }

    function _findBoneInfoFromName(name) {
        var data = _this.options.bones;
        var bone = null;
        name = name.toLowerCase();

        for(var i = 0, length = data.length; i < length; i++) {
            var dataName = data[i].image.split('.png');
            if(name == dataName[0]) {
                bone = data[i];

                break;
            }
        }

        return bone;
    }

    function updateBoneInfo(data) {
        if(data == null) {
            // single bone
            data = _this.options.bones[0];
        } else {
            // full skelet
            var $btn = $(_this.options.containers.boneMoreBtnId);
            var link = $btn.attr('data-href') + '/' + data.id;
            $btn.attr('href', link);
        }

        $(_this.options.containers.boneTitleId).html(data.name);
        $(_this.options.containers.boneLatinId).html(data.latin);
        $(_this.options.containers.boneDescId).html(data.description);
    }

    // DEBUG FUNCTIONS

    function toString(point) {
        return point.x + " " + point.y + " " + point.z;
    }

    function changeMaterialColor() {
        if(_this.options.debug) {
            INTERSECTED.object.geometry.colorsNeedUpdate = true;
            if (INTERSECTED.object.material.color != undefined) {
                // change the color of the closest face.
                INTERSECTED.object.material.color.setHex(Math.random() * 0xffffff);
            }
        }
    }

    function log(v) {
        if(_this.options.debug) {
            console.log(v);
        }
    }
})();