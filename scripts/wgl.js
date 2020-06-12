var webgl_init = function(context, vs_txt, fs_txt) {
    console.log("WEBGL:START")

    //var gl:WebGLRenderingContext = context; //for code hinting
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
    [ // X,Y,Z             R,G,B
         0.0,  0.5, 0.0,   1, 0, 0,
        -0.5, -0.5, 0.0,   0, 1, 0,
         0.5, -0.5, 0.0,   0, 0, 1
    ]);
    

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -2], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, 45 * (Math.PI/180), 8/6, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


    
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var theta;
    /////// RENDER LOOP ///////
    var renderLoop = function () {
        theta = performance.now() / 1000 / 6 * 2 * Math.PI;

        glMatrix.mat4.rotate(worldMatrix, identityMatrix, theta, [0,1,0])

        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)

        gl.clearColor(.7, .7, 1, 1.0)
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);



}