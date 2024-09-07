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
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const rockMat = new BABYLON.StandardMaterial("terrainMat");
    rockMat.diffuseTexture = new BABYLON.Texture("https://nestorotzx.github.io/BabylonTest/textures/rock.jpg", scene);
    rockMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    rockMat.emissiveColor = new BABYLON.Color3(0.2, 0, 1);

    BABYLON.SceneLoader.ImportMeshAsync("", "https://nestorotzx.github.io/BabylonTest/", "models/mountain.glb").then((result) => {
    	result.meshes[1].position.x = 0;
        result.meshes[1].material = rockMat;
        result.meshes[1].rotate  = new BABYLON.Vector3(0, 0, 0);
        result.meshes[1].scaling = new BABYLON.Vector3(1, 1, 1);
    });

    BABYLON.SceneLoader.ImportMeshAsync("", "https://nestorotzx.github.io/BabylonTest/", "models/dinamita.glb").then((result) => {
    	result.meshes[1].position.y = -5;
        result.meshes[1].position.x = 20;
        result.meshes[1].scaling = new BABYLON.Vector3(2, 2, 2);
    });

    //Hobbit central
    BABYLON.SceneLoader.ImportMeshAsync("", "https://nestorotzx.github.io/BabylonTest/", "models/hobbit.glb").then((result) => {
    	result.meshes[1].position.y = 20;
        result.meshes[1].position.x = -100;
        result.meshes[1].scaling = new BABYLON.Vector3(3, 3, 3);
    });

    //Hobbit izquierdo
    BABYLON.SceneLoader.ImportMeshAsync("", "https://nestorotzx.github.io/BabylonTest/", "models/hobbit.glb").then((result) => {
    	result.meshes[1].position.y = 10;
        result.meshes[1].position.x = -150;
        result.meshes[1].position.z = -50;
        result.meshes[1].scaling = new BABYLON.Vector3(3, 3, 3);
    });

    //Hobbit derecho
    BABYLON.SceneLoader.ImportMeshAsync("", "https://nestorotzx.github.io/BabylonTest/", "models/hobbit.glb").then((result) => {
    	result.meshes[1].position.y = 10;
        result.meshes[1].position.x = -150;
        result.meshes[1].position.z = 50;
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