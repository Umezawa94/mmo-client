    #ifdef GL_ES
        precision highp float;
    #endif

    // Samplers
    varying vec2 vUV;
    uniform sampler2D textureSampler;
    uniform sampler2D tNormal;
    uniform sampler2D tDepth;

    // Parameters
    uniform float minDepth;
    uniform float maxDepth;
    uniform float materialThreshold;
    uniform float depthThreshold;
    uniform float normalThreshold;
	uniform vec4 uvOffset;
	uniform vec3 visibleEdgeColor;

	float depth(vec2 uv){
		return pow(texture2D(tDepth, uv).g / texture2D(tDepth, uv).r, 0.5) + texture2D(tDepth, uv).b;
	}
	vec3 normal(vec2 uv){
		return texture2D(tNormal, uv).rgb;
	}
	float matId(vec2 uv){
		return texture2D(tNormal, uv).a;
	}

	float depthDifference(){
		float c1 = depth( vUV + uvOffset.xy);
		float c2 = depth( vUV - uvOffset.xy);
		float c3 = depth( vUV + uvOffset.yw);
		float c4 = depth( vUV - uvOffset.yw);
		float diff1 = (c1 - c2);
		float diff2 = (c3 - c4);
		
		float c5 = depth( vUV + uvOffset.xw);
		float c6 = depth( vUV - uvOffset.xw);
		float c7 = depth( vUV + uvOffset.zw);
		float c8 = depth( vUV - uvOffset.zw);
		float diff3 = (c5 - c6);
		float diff4 = (c7 - c8);
		float d = length( vec4(diff1, diff2, diff3, diff4));
		
		// float d = length( vec2(diff1, diff2));
		return d;
	}
	float normalDifference(){
		vec3 c1 = normal( vUV + uvOffset.xy);
		vec3 c2 = normal( vUV - uvOffset.xy);
		vec3 c3 = normal( vUV + uvOffset.yw);
		vec3 c4 = normal( vUV - uvOffset.yw);
		vec3 diff1 = (c1 - c2);
		vec3 diff2 = (c3 - c4);
		
		vec3 c5 = normal( vUV + uvOffset.xw);
		vec3 c6 = normal( vUV - uvOffset.xw);
		vec3 c7 = normal( vUV + uvOffset.zw);
		vec3 c8 = normal( vUV - uvOffset.zw);
		vec3 diff3 = (c5 - c6);
		vec3 diff4 = (c7 - c8);
		float d = length( vec4(length(diff1), length(diff2), length(diff3), length(diff4)));

		// float d = length( vec2(length(diff1), length(diff2)));
		return d;
	}
	float materialDifference(){
		float c1 = matId( vUV + uvOffset.xy);
		float c2 = matId( vUV - uvOffset.xy);
		float c3 = matId( vUV + uvOffset.yw);
		float c4 = matId( vUV - uvOffset.yw);
		float diff1 = (c1 - c2);
		float diff2 = (c3 - c4);
		
		
		float c5 = matId( vUV + uvOffset.xw);
		float c6 = matId( vUV - uvOffset.xw);
		float c7 = matId( vUV + uvOffset.zw);
		float c8 = matId( vUV - uvOffset.zw);
		float diff3 = (c5 - c6);
		float diff4 = (c7 - c8);
		float d = length( vec4(diff1, diff2, diff3, diff4));

		// float d = length( vec2(diff1, diff2));
		return d;
	}


    void main(void) 
    {
        vec4 baseColor = texture2D(textureSampler, vUV);
		gl_FragColor = baseColor;
        // gl_FragColor.rgb = texture2D(tNormal, vUV).rgb;
		// gl_FragColor = (baseColor.rbga + texture2D(tDepth, vUV)) / 2.;

		vec3 edgeColor = visibleEdgeColor;
		float dep = depth(vUV);
		float normalDifference = normalDifference();
		if(minDepth < dep && dep < maxDepth){
			if(materialDifference()> materialThreshold 
				||normalDifference > normalThreshold){
				// ||depthDifference()> depthThreshold){
				float a = 0.3 + (normalDifference - normalThreshold) * 2.;
				gl_FragColor.rgb = edgeColor * a + baseColor.rgb*(1.-a);
			}
		}

		// gl_FragColor.rgb = vec3(materialDifference());


		// float c1 = depth( vUV + uvOffset.xy);
		// float c2 = depth( vUV - uvOffset.xy);
		// float c3 = depth( vUV + uvOffset.xy);
		// float c4 = depth( vUV + uvOffset.xy);
		
		// float diff1 = (c1 - c2);
		// float diff2 = (c3 - c4);
		// float d = length( vec2(diff1, diff2));
		// if (d > threshold)
		// 	gl_FragColor.rgb = edgeColor;
    }
