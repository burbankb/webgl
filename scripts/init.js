var monkey;

var init = function() {
    console.log("loaded");

    var canvas = document.getElementById('wgl');
    
    var gl = canvas.getContext('webgl');

    if (!gl) {
        gl = canvas.getContext('experimental-webgl');
    }

    var vertLoader = XHR_get('resources/shaders/vert.glsl')
    var fragLoader = XHR_get('resources/shaders/frag.glsl')
    var monkeyLoader = XHR_get('resources/models/monkey.json')

    var waitForLoad = function(){
        if (XHR_Completed([vertLoader, fragLoader, monkeyLoader])) {
            monkey = JSON.parse(monkeyLoader.response)
            webgl_init(gl, vertLoader.response, fragLoader.response);
        } else 
            setTimeout(waitForLoad, 200); //check again in a little while
    }
    waitForLoad();
}

function XHR_Completed(XHR) {
    if (XHR instanceof XMLHttpRequest){
        return (XHR.readyState == 4 && XHR.status == 200);
    } else if (Array.isArray(XHR)) {
        for (let i = 0; i < XHR.length; i++) {
            if ((XHR[i] instanceof XMLHttpRequest) == false) return false;
            if (XHR[i].readyState != 4 || XHR[i].status != 200) return false;
        }
        return true;
    }
    return false;
}

function XHR_get(url) {
    var XHR = new XMLHttpRequest();
    XHR.open('GET', url);
    XHR.send();
    return XHR;
}