var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(65), 250, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    //var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    //light.intensity = 0.7;

    const sun = new BABYLON.DirectionalLight("Sun", new BABYLON.Vector3(-0.5, -0.5, 0), scene);
    sun.intensity=0.4;

    const rockMat = new BABYLON.StandardMaterial("terrainMat");
    rockMat.diffuseTexture = new BABYLON.Texture("https://nestorotzx.github.io/BabylonTest/textures/rock.png", scene);
    rockMat.bumpTexture = new BABYLON.Texture("https://nestorotzx.github.io/BabylonTest/textures/rock_nm.png", scene);
    rockMat.specularColor = new BABYLON.Color3(0, 0, 0);
    rockMat.emissiveColor = new BABYLON.Color3(0.2, 0, 1);
    rockMat.ambientColor = new BABYLON.Color3(0.2, 0.1, 1);

    BABYLON.SceneLoader.ImportMeshAsync("", "https://nestorotzx.github.io/BabylonTest/", "models/mountain.glb").then((result) => {
    	result.meshes[1].position.x = 0;
        result.meshes[1].material = rockMat;
        result.meshes[1].rotate  = new BABYLON.Vector3(0, 0, 0);
        result.meshes[1].scaling = new BABYLON.Vector3(1, 1, 1);
    });


    const dinMaterial = new BABYLON.StandardMaterial("dinMat", scene);
    dinMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);

    BABYLON.SceneLoader.ImportMeshAsync("", "https://nestorotzx.github.io/BabylonTest/", "models/dinamita.glb").then((result) => {
    	result.meshes[1].position.y = -5;
        result.meshes[1].position.x = 5;
        result.meshes[1].material = dinMaterial;
        result.meshes[1].scaling = new BABYLON.Vector3(2, 2, 2);
    });

   

    var hobbitlight = new BABYLON.PointLight("hobbitlight", new BABYLON.Vector3( 200, 10, 0), scene);
    hobbitlight.intensity = 4;
    hobbitlight.range = 200;
    hobbitlight.diffuse = new BABYLON.Color3(0.25, 1, 1);
    hobbitlight.specular = new BABYLON.Color3(0.25, 1, 1);

    var fireworkLight = new BABYLON.PointLight("fireworkLight", new BABYLON.Vector3( 20, -5, 0), scene);
    fireworkLight.intensity = 25;
    fireworkLight.range = 200;
    fireworkLight.diffuse = new BABYLON.Color3(1, 0, 0);
    fireworkLight.specular = new BABYLON.Color3(1, 0.01, 0);

    //Hobbit central
    const hobbitMaterial = new BABYLON.StandardMaterial("hobbitMaterial", scene);
    hobbitMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);

    BABYLON.SceneLoader.ImportMeshAsync("", "https://nestorotzx.github.io/BabylonTest/", "models/hobbit.glb").then((result) => {
    	result.meshes[1].position.y = 20;
        result.meshes[1].position.x = -100;
        result.meshes[1].material = hobbitMaterial;
        result.meshes[1].scaling = new BABYLON.Vector3(3, 3, 3);
    });

    //Hobbit izquierdo
    BABYLON.SceneLoader.ImportMeshAsync("", "https://nestorotzx.github.io/BabylonTest/", "models/hobbit.glb").then((result) => {
    	result.meshes[1].position.y = 10;
        result.meshes[1].position.x = -150;
        result.meshes[1].position.z = -50;
        result.meshes[1].material = hobbitMaterial;
        result.meshes[1].scaling = new BABYLON.Vector3(3, 3, 3);
    });

    //Hobbit derecho
    BABYLON.SceneLoader.ImportMeshAsync("", "https://nestorotzx.github.io/BabylonTest/", "models/hobbit.glb").then((result) => {
    	result.meshes[1].position.y = 10;
        result.meshes[1].position.x = -150;
        result.meshes[1].position.z = 50;
        result.meshes[1].material = hobbitMaterial;
        result.meshes[1].scaling = new BABYLON.Vector3(3, 3, 3);
    });

    //BABYLON.SceneLoader.ImportMeshAsync("semi_house", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon");
    return scene;
};

window.initFunction = async function() {            
    var asyncEngineCreation = async function() {
        try {
        return createDefaultEngine();
        } catch(e) {
        console.log("the available createEngine function failed. Creating the default engine instead");
        return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};

initFunction().then(() => {sceneToRender = scene});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});