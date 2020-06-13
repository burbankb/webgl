precision mediump float;

varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform sampler2D sampler;

void main() 
{
    vec3 ambientColor = vec3(0.15, 0.15, 0.1);
    vec3 sunColor = vec3(1, 1, .98);
    vec3 sunDir = normalize(vec3(1.0, 4.0, 0.0));

    vec4 texel = texture2D(sampler, fragTexCoord);

    vec3 light = ambientColor + max(sunColor * dot(fragNormal, sunDir), 0.0);

    gl_FragColor = vec4 (texel.rgb * light, texel.a);
    //gl_FragColor = texture2D(sampler, fragTexCoord);
}