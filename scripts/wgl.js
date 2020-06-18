var webgl_init = function(context, vs, fs) {
    console.log("WEBGL:START")

    var gl = context;
    //var gl:WebGLRenderingContext = context; //for code hinting

    var shaders = { vert:vs, frag:fs };
    //WebGL START ---

    //Clear
    gl.clearColor(.7, .7, 1, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    //Compile Shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, shaders.vert);
    gl.shaderSource(fragmentShader, shaders.frag);
    
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

    var verts = monkey.meshes[0].vertices;

    // var verts = [
    //      // X,Y,Z             R,G,B
    //     -0.5, -0.5, 0.5,   1.0, 0.0, 0.0,
    //      0.5, -0.5, 0.5,   1.0, 1.0, 0.6,
    //      0.5,  0.5, 0.5,   0.0, 1.0, 0.0,
    //     -0.5,  0.5, 0.5,   0.0, 0.0, 1.0,

    //     -0.5, -0.5, -0.5,   1.0, 0.0, 0.0,
    //      0.5, -0.5, -0.5,   1.0, 1.0, 0.6,
    //      0.5,  0.5, -0.5,   0.0, 1.0, 0.0,
    //     -0.5,  0.5, -0.5,   0.0, 0.0, 1.0,
    // ];

    var indices = [].concat.apply([],monkey.meshes[0].faces);

    // var indices = [
    //     //Front
    //     0, 1, 2,
    //     2, 3, 0,

    //     //Back
    //     6, 5, 4,
    //     4, 7, 6,

    //     //Top
    //     3, 2, 6,
    //     6, 7, 3,

    //     //Bottom
    //     5, 1, 0,
    //     0, 4, 5,

    //     //Left
    //     7, 4, 0,
    //     0, 3, 7,

    //     //Right
    //     1, 5, 6,
    //     6, 2, 1

    // ];

    var texCoords = monkey.meshes[0].texturecoords[0];

    var monkeyNormals = monkey.meshes[0].normals;
    

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    var texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    var normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(monkeyNormals), gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.enableVertexAttribArray(positionAttribLocation);


    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    var uvAttribLocation = gl.getAttribLocation(program, 'texCoords');
    gl.vertexAttribPointer(
        uvAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    
    gl.enableVertexAttribArray(uvAttribLocation);


    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    var normalAttribLocation = gl.getAttribLocation(program, 'normalsVect');
    gl.vertexAttribPointer(
        normalAttribLocation,
        3,
        gl.FLOAT,
        gl.TRUE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    
    gl.enableVertexAttribArray(normalAttribLocation);

    //texture setup
    var textureBuffer = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(
        gl.TEXTURE_2D, 
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        monkeytex);

    gl.bindTexture(gl.TEXTURE_2D, null);

    
    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    var mousePosUniformLocation = gl.getUniformLocation(program, 'mousePos');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    var mouseCoord = new Float32Array(2);
    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -500], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, toRadians(45), 8/6, 0.1, 1000.0);

    mouseCoord = [0,0];

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    
    var xRotationMatrix = new Float32Array(16)
    var yRotationMatrix = new Float32Array(16);
    
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var theta;
    /////// RENDER LOOP ///////
    var renderLoop = function () {
        theta = Date.now() / 1000 / 6 * 2 * Math.PI;

        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, theta, [0,1,0])
        glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, theta / 2, [1,0,0])

        glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);

        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)

        mouseCoord = [-mouseCoordinates.x/400 + 1, -mouseCoordinates.y/300 + 1];
        gl.uniform2fv(mousePosUniformLocation, mouseCoord);

        gl.clearColor(.1, .1, .1, 1.0)
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

function toRadians(degrees) {
    return degrees * (Math.PI/180);
}