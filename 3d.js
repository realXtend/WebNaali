/*
  3d.js - Drawing avs in three dimensions. Handles input also.
*/

var scene;
var renderer;
var camera;
var keys;
var mouse;
var hoverobject;
var mouseovercanvas;
var lasttime=0;
var frameratebuffer=60;
var start=parseInt(new Date().getTime());
var now;

function initGraffa() {

    canvas = document.getElementById('graffa');

    canvas.onmouseover = function(event) {
        mouseovercanvas = true;
    };

    canvas.onmousemove = function(event) {
        mouseovercanvas = true;
    };

    canvas.onmouseout = function(event) {
        mouseovercanvas = false;
    };

    //disable context menu for canvas
    canvas.oncontextmenu = function(event) {
        return false;
    }

    renderer = new GLGE.Renderer(canvas);
    scene = new GLGE.Scene();

    // temp testing
    var static_scene = new GLGE.Collada();
    if (url_to_static != "") {
        static_scene.setDocument(url_to_static);
        static_scene.docURL = asset_baseurl;
        static_scene.setRot(0, 0, 0);
        scene.addCollada(static_scene);
    }

    keys = new GLGE.KeyInput();
    mouse = new GLGE.MouseInput(canvas);

    scene.setAmbientColor('#fff');
    
    renderer.setScene(scene);

    camera = new GLGE.Camera();
    camera.setType(GLGE.C_PERSPECTIVE);
    camera.setAspect(16/9.0);
    camera.setLocX(2.790530635509013);
    camera.setLocY(0.857142857142857);
    camera.setLocZ(9.75832300189141);
    camera.setRotY(7.200000000000014);

    // startloc and rot are used only in scenetest. in ws3dclient all
    // location and rotation data comes from server (for now)
    if (startloc) {
        camera.setLocX(startloc.x);
        camera.setLocY(startloc.y);
        camera.setLocZ(startloc.z);
    }

    if (startrot) {
        camera.setRotX(startrot.x);
        camera.setRotY(startrot.y);
        camera.setRotZ(startrot.z);
    }

    scene.setCamera(camera); 
    startRender()
}

function startRender() {
    rendertimerid = setInterval(render, 50);
}

function render() {
    renderer.render();
    checkkeys();
    checkmouse();

    now=parseInt(new Date().getTime());
    frameratebuffer = Math.round(((frameratebuffer * 9) + 1000/ (now - lasttime)) / 10);
    var fpsdisplay = document.getElementById("fps");
    if (fpsdisplay) {
        fpsdisplay.innerHTML = "FPS: " + frameratebuffer+ " #obj: " + scene.getObjects().length;
    }

    //document.getElementById("info").innerHTML="Camera:" + camera.getLocX() +", " + camera.getLocY() + ", " + camera.getLocZ() + " : " + camera.getRotX() + ", " + camera.getRotY() + ", " + camera.getRotZ();

    lasttime = now;
}

function checkkeys() {
    if (!mouseovercanvas) {
        return;
    }

    
    if (keys.isKeyPressed(GLGE.KI_PAGE_UP)) {
        addmove('Move,up');
    }
    if (keys.isKeyPressed(GLGE.KI_PAGE_DOWN)) {
        addmove('Move,down');
    }
    if (keys.isKeyPressed(GLGE.KI_W) || keys.isKeyPressed(GLGE.KI_UP_ARROW)) {
        addmove('Move,forward');
    }
    if (keys.isKeyPressed(GLGE.KI_S) || keys.isKeyPressed(GLGE.KI_DOWN_ARROW)) {
        addmove('Move,back');
    }
    if (keys.isKeyPressed(GLGE.KI_A)) {
        addmove('Move,left');
    }
    if (keys.isKeyPressed(GLGE.KI_D)) {
        addmove('Move,right');
    }
    if (keys.isKeyPressed(GLGE.KI_LEFT_ARROW)) {
        addmove('Rotate,left');
    }
    if (keys.isKeyPressed(GLGE.KI_RIGHT_ARROW)) {
        addmove('Rotate,right');
    }

    checkmove();

}

function checkmouse() {
    if (mouseovercanvas) {
        var mouseposition = mouse.getMousePosition();
        mouseposition.x -= document.getElementById("container").offsetLeft;
        mouseposition.y -= document.getElementById("container").offsetTop;
        
        if (mouse.isButtonDown(GLGE.MI_RIGHT) & mouseposition.x && mouseposition.y) {

            var dx = old_mousex - mouseposition.x;
            if (dx < 0) {
                addmove('Rotate,right');
            } else if (dx > 0) {
                addmove('Rotate,left');
            }
            
            old_mousex = mouseposition.x;
            old_mousey = mouseposition.y;
        }
    }
}
