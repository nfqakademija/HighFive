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
        render();
    }

// set variables
    var width = window.innerWidth;
    height = window.innerHeight,
        viewAngle = 75,
        aspectRatio = width / height,
        nearPlane = 0.1,
        farPlane = 1000;

// create a scene
    var scene = new THREE.Scene();

// create a camera
    var camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, nearPlane, farPlane);

// create a WebGL renderer
    var renderer = new THREE.WebGLRenderer();

// start the renderer
    renderer.setSize(width, height);

// attach the render-supplied DOM element
    document.body.appendChild(renderer.domElement);

// get cube object
    var cube = getCube();

// add the cube to the scene
    scene.add(cube);

// get sphere object
    var sphere = getSphere();

// add the sphere to the scene
    scene.add(sphere);


// create a point light
    var pointLight = getPointLight();

// add to the scene
    scene.add(pointLight);

// for cube
// camera.position.z = 5;
// for sphere
    camera.position.z = 300;

    function render() {
        requestAnimationFrame(render);

        // cube.rotation.x += 0.1;
        // cube.rotation.y += 0.1;

        sphere.rotation.x += 0.1;
        sphere.rotation.y += 0.1;

        renderer.render(scene, camera);
    }

    function getSphere() {
        // set up the sphere vars
        var radius = 50,
            segments = 16,
            rings = 16;

        // create sphere's geometry
        var sphereGeometry = new THREE.SphereGeometry(radius, segments, rings);

        // create the sphere's material
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xCC0000});

        // create a new mesh with sphere geometry
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        return sphere;
    }

    function getCube() {
        // create cube's geometry
        var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

        // create the cube's material
        var cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});

        // create a new mesh with sphere geometry
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        return cube;
    }

    function getPointLight() {
        // create a point light
        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        return pointLight;
    }

})();