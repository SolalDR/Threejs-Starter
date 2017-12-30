#if NUM_DIR_LIGHTS > 0
    struct DirectionalLight {
        vec3 direction;
        vec3 color;
        int shadow;
        float shadowBias;
        float shadowRadius;
        vec2 shadowMapSize;
     };
     uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

varying vec4 color;
uniform float space;
uniform float time;
uniform float duration;

uniform float distImpactMax;

attribute float lastAnimate;

attribute float distImpact;
 

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

void main() {
	float r = max(0.1, dot(directionalLights[0].direction, normal));
	
	vec3 decal = vec3(0.);
	float alpha = 1.; 
	float advanced = min(1., (time - lastAnimate) / duration); 
	// float diform = 1.;

	// if(distImpact > distImpactMax){
	float diform = 1. - (distImpact/distImpactMax);
	// }

	if(advanced < 0.4){

		decal = normal * advanced * diform; 

	} else if( advanced >= 0.4 && advanced < 0.6){

		decal = normal * advanced * diform; 
		alpha = 1. - (advanced - 0.4) * 5.0; 

	} else if(advanced < 1.) {

		alpha = (advanced - 0.6) * 2.5; 
	
	}


	vec3 green = vec3(0.58, 0.85, 0.69);
	vec3 black = vec3(1., 1., 1.);
	color = vec4(black*max(.6, r), alpha);

	vec3 newPosition = position + decal;


	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition , 1.0);
}