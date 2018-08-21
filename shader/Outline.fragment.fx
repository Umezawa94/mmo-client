    #ifdef GL_ES
        precision highp float;
    #endif

    // Samplers
    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform sampler2D tDepth;

    // Parameters
    uniform float threshold;
	uniform vec4 uvOffset;
	uniform vec3 visibleEdgeColor;

	float depth(vec2 uv){
		return pow(texture2D(tDepth, uv).g / texture2D(tDepth, uv).r, 0.5) + texture2D(tDepth, uv).b;
	}

    void main(void) 
    {
        vec4 baseColor = texture2D(textureSampler, vUV);
		gl_FragColor = baseColor;

		float c1 = depth( vUV + uvOffset.xy);
		float c2 = depth( vUV - uvOffset.xy);
		float c3 = depth( vUV + uvOffset.xy);
		float c4 = depth( vUV + uvOffset.xy);
		
		float diff1 = (c1 - c2);
		float diff2 = (c3 - c4);
		float d = length( vec2(diff1, diff2));
		vec3 edgeColor = visibleEdgeColor;
		if (d > threshold)
			gl_FragColor.rgb = edgeColor;
    }
