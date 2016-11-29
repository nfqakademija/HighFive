(function() {
    var _this = this;

    /**
     * @TODO: clean up the code
     * @TODO: add comments
     */

    /**
     * @Constructor
     */
    _this.skeletOnThreeD = function () {
        // Define option defaults
        var defaults = {
            id: 'ThreeJs',
            path: '/models/',
            model: 'full-skelet',
            preloaderId: 'preloader'
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
    var container, scene, camera, renderer, controls, stats;

    // custom global variables
    var targetList = [];
    var projector, mouse = { x: 0, y: 0 }, INTERSECTED;

    // standard global variables
    var width = window.innerWidth,
        height = window.innerHeight,
        pixelRation = window.devicePixelRatio,
        viewAngle = 75,
        aspectRatio = width / height,
        near = 0.1,
        far = 1000;

    /**
     * @Public
     */
    skeletOnThreeD.prototype.init = function() {
        updateVariables();

        init();

        animate();
    }

    /**
     * @Private
     */
    function animate() {
        requestAnimationFrame( animate );

        render();
    }

    /**
     * @Private
     */
    function render() {
        // camera.lookAt( scene.position );

        renderer.render( scene, camera );

        controls.update();
    }

    /**
     * @Private
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

        // EVENTS
        _initEvents();
    }

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

                object.position.y = 5;
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
            renderer = new THREE.WebGLRenderer({ antialias: true });
        } else {
            renderer = new THREE.CanvasRenderer();
        }

        // RENDERER
        renderer.setPixelRatio( pixelRation );
        renderer.setSize( width, height );
    }

    function _initControls() {
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = false;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.autoRotate = true;
    }

    function _initProjector() {
        // initialize object to perform world/screen calculations
        projector = new THREE.Projector();
    }

    function _initEvents() {
        // on window resize
        window.addEventListener( 'resize', onWindowResize, false );

        // on mouse click
        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    }

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
        $('#' + _this.options.preloaderId).hide();
    }

    function updateVariables() {
        var $el = $('#' + _this.options.id);

        width = $el.outerWidth();
        height = $el.outerHeight();
        aspectRatio = width / height;
    }

    function onWindowResize() {
        updateVariables();

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize( width, height );
    }

    function onDocumentMouseDown( event ) {
        // the following line would stop any other event handler from firing
        // (such as the mouse's TrackballControls)
        // event.preventDefault();

        updateVariables();

        // update the mouse variable
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // find intersections
        onIntersect();
    }

    function onIntersect() {
        // create a Ray with origin at the mouse position
        //   and direction into the scene (camera direction)
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        vector.unproject( camera );
        var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects( targetList, true );

        // if there is one (or more) intersections
        if ( intersects.length > 0 ) {
            console.log("Hit @ " + toString( intersects[0].point ) );

            intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
            if(intersects[ 0 ].object.material.color != undefined) {
                // change the color of the closest face.
                intersects[ 0 ].object.material.color.setHex(Math.random() * 0xffffff);
            }

            if(intersects[ 0 ].object.name != undefined) {
                log(intersects[ 0 ].object.name);
            }
        }
    }

    function toString(point) {
        return point.x + " " + point.y + " " + point.z;
    }

    function log(v) {
        console.log(v);
    }
})();