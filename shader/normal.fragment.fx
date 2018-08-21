#ifdef GL_ES
precision highp float;
#endif

uniform float matID;
varying vec4 vPosition;
varying vec3 vNormal;

void main(void) {
    // float depth =  1.0 - (2.0 / (100.0 + 1.0 - gl_FragCoord.z * (100.0 - 1.0)));
    gl_FragColor = vec4(vNormal, vec3(matID));
}