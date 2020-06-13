precision mediump float;

varying vec2 fragTexCoord;

void main() 
{
    gl_FragColor = vec4(fragTexCoord, 0 , 1.0);
}