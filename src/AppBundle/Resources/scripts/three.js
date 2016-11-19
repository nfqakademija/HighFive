(function() {
    var _this = this;

    /**
     * @Constructor
     */
    _this.skeletOnThree = function () {

    }

    /**
     * @Public
     */
    skeletOnThree.prototype.init = function() {
        init();
        animate();
    }

    var container, stats;

    var camera, scene, renderer;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    // var loadObject = 'Heart';
    var loadObject = 'skeleton';

    function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        // container = document.getElementById('3D-container')

        // set variables
        var
            width = window.innerWidth,
            height = window.innerHeight,
            // width = $('#3D-container').width(),
            // height = $('#3D-container').height(),
            viewAngle = 75,
            aspectRatio = width / height,
            nearPlane = 0.1,
            farPlane = 1000;

        camera = new THREE.PerspectiveCamera( viewAngle, aspectRatio, nearPlane, farPlane );
        camera.position.z = 50;

        // scene

        scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight( 0x444444 );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 0, 1 ).normalize();
        scene.add( directionalLight );

        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 0, -1 ).normalize();
        scene.add( directionalLight );

        // model

        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                var percent = Math.round(percentComplete, 2);
                console.log( percent + '% downloaded' );

                if(percent == 100) {
                    $('#preloader').hide();
                    console.log('done');
                }
            }
        };

        var onError = function ( xhr ) { };

        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath( 'models/' );
        mtlLoader.load( loadObject + '.mtl', function( materials ) {

            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( 'models/' );
            objLoader.load( loadObject + '.obj', function ( object ) {
                // object.position.y = - 95;
                // object.position.z = 95;
                scene.add( object );

            }, onProgress, onError );

        });

        // renderer

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        // controls

        controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = false;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.autoRotate = true;

        // window.addEventListener( 'resize', onWindowResize, false );
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
        requestAnimationFrame( animate );

        render();

        controls.update();
    }

    function render() {
        // camera.lookAt( scene.position );

        renderer.render( scene, camera );
    }

})();