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

    // custom global variables
    var targetList = [];
    var projector, mouse = { x: 0, y: 0 };

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    // var loadObject = 'Heart';
    var loadObject = 'skeleton';
    // var loadObject = 'skull';

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

            // console.log(materials);

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( 'models/' );
            objLoader.load( loadObject + '.obj', function ( object ) {

                object.traverse( function ( child ) {
                    if ( child instanceof THREE.Mesh ) {
                        //The child is the bit needed for the raycaster.intersectObject() method
                        // console.log(child);
                        targetList.push(child);
                    }
                } );

                console.log(object);

                // object.position.y = - 95;
                // object.position.z = 95;
                scene.add( object );

                // targetList.push(object);

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

        // initialize object to perform world/screen calculations
        projector = new THREE.Projector();

        // window.addEventListener( 'resize', onWindowResize, false );

        // when the mouse moves, call the given function
        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
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

    function onDocumentMouseDown( event )
    {
        // the following line would stop any other event handler from firing
        // (such as the mouse's TrackballControls)
        // event.preventDefault();

        console.log("Click.");

        // update the mouse variable
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // find intersections

        // create a Ray with origin at the mouse position
        //   and direction into the scene (camera direction)
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        vector.unproject( camera );
        var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects( targetList, true );

        // if there is one (or more) intersections
        if ( intersects.length > 0 )
        {
            console.log("Hit @ " + toString( intersects[0].point ) );

            for( var i = 0, length = intersects.length; i < length; i++ ) {
                intersects[ i ].object.geometry.colorsNeedUpdate = true;

                if(intersects[ i ].object.material.color != undefined) {
                    // change the color of the closest face.
                    intersects[i].object.material.color.setHex(Math.random() * 0xffffff);
                }
            }
        }
    }

    function toString(point) {
        return point.x + " " + point.y + " " + point.z;
    }

})();