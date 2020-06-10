var webgl_init = function(context, vs_txt, fs_txt) {
    console.log("WEBGL:START")

    //var gl:WebGLRenderingContext = context;
    var gl = context;
    //WebGL START ---

    //Clear
    gl.clearColor(.7, .7, 1, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Compile Shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vs_txt);
    gl.shaderSource(fragmentShader, fs_txt);
    
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
        console.log("VertCompileError:\n", gl.getShaderInfoLog(vertexShader));

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) 
        console.log("FragCompileError:\n", gl.getShaderInfoLog(fragmentShader));


    //Create and link program
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program,fragmentShader);

    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.log("ProgLinkError:\n", gl.getProgramInfoLog(program));

    
    //GEOM Start

    var verts = new Float32Array(
    [ // X,Y          R,G,B
        0.0, 0.5,     1, 0, 0,
        -0.5, -0.5,   0, 1, 0,
        0.5, -0.5,    0, 0, 1
    ]);
    

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);


    /////// RENDER LOOP ///////
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);



}