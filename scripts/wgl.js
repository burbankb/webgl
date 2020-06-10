var init = function() {
    console.log("loaded");

    var canvas = document.getElementById('wgl');
    
    var gl = canvas.getContext('webgl');

    if (!gl) {
        gl = canvas.getContext('experimental-webgl');
    }
    
    //Load Shaders
    var vert_shader, frag_shader;

    var vertLoader = new XMLHttpRequest();
    vertLoader.open('GET', 'resources/shaders/frag.glsl');
    vertLoader.onreadystatechange = function() {vert_shader = vertLoader.responseText;}
    vertLoader.send();

    var fragLoader = new XMLHttpRequest();
    fragLoader.open('GET', 'resources/shaders/vert.glsl');
    fragLoader.onreadystatechange = function() {frag_shader = fragLoader.responseText;}
    fragLoader.send();

    var loadChecker = window.setInterval(function(){
        if (vertLoader.readyState == 4 && vertLoader.status == 200 
            && fragLoader.readyState == 4 && fragLoader.status == 200) 
            {
                clearInterval(loadChecker);
                webgl_init(gl);
            };
    }, 500);
}

var webgl_init = function(gl) {
    console.log("WEBGL:START")
    //WebGL START ---

    //Clear
    gl.clearColor(.7, .7, 1, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Shader

}