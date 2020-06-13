precision mediump float;

attribute vec3 vertPosition;
attribute vec2 texCoords;
attribute vec3 normalsVect;

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main() 
{
    fragNormal = (mWorld * vec4(normalsVect, 0.0)).xyz;
    fragTexCoord = texCoords;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}