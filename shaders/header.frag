precision lowp float;
// precision mediump float;

uniform vec2      resolution;
uniform float     time;
uniform float     channelTime[4];
uniform vec4      mouse;
uniform vec4      date;
uniform vec3      channelResolution[4];
uniform vec4      bands;
uniform sampler2D backbuffer;

const float PI = 3.14159;
const float PI2 = 6.28318;

vec3 black = vec3(0.0);
vec3 white = vec3(1.0);
vec3 red = vec3(0.86,0.22,0.27);   
vec3 orange = vec3(0.92,0.49,0.07);
vec3 yellow = vec3(0.91,0.89,0.26);
vec3 green = vec3(0.0,0.71,0.31);
vec3 blue = vec3(0.05,0.35,0.65);
vec3 purple = vec3(0.38,0.09,0.64);
vec3 pink = vec3(.9,0.758,0.798);
vec3 lime = vec3(0.361,0.969,0.282);
vec3 teal = vec3(0.396,0.878,0.878);

vec2 uv = (gl_FragCoord.xy / resolution * 2.0 -1.0) * vec2(resolution.x/resolution.y, 1.0);
vec2 uvN = gl_FragCoord.xy / resolution;

float rand(float x) {
    return fract(sin(x)*4536.2346);
}
float rand(vec2 p) {
    return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float box(vec2 p,vec2 b,float r,float f) {
    return smoothstep(f, 0.0, length(max(abs(p)-b,0.0))-r);
}

float circle(float x,float y,float r,float f) {
    float d=distance(uv,vec2(x, y))/r;
    return 1.-smoothstep(r-f,r,d);
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0/289.0)) * 289.0;
}
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0/289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

vec3 sexy(void) {
    float star=0.0;
    vec3 cr = black;
    for(int i = 0; i < 150; i++){
    float tTime = float(i) * PI;
    vec2 p = vec2(rand(floor(-tTime * time*.005)), fract(time *0.1 +tTime));
    float   r = rand(uv.x);
    star= r*(0.125*sin(time * (r * 5.0) + 20.0 * r) + 0.25);
    cr += box(uvN-p.yx, vec2(0.005, 0.01), 0.0001, 0.0001) * star;
    cr += circle(uvN.x-p.y, (uvN.y-p.x)*.6, .1, .01)*star;
    cr += circle(uvN.x-p.y+.1, (uvN.y-p.x+.1)*.6, .06, .001)*star;}
    return vec3(cr * 1.5);
}

vec2 nyanFrame(vec2 p, float rr) {
    float v = 40.0/256.0;
    p = clamp(p,0.0,1.0);
    p.x = p.x*v;
    p = clamp(p,0.0,1.0);
    float fr = floor( mod( 20.0*time+rr, 6.0 ) );
    p.x += fr*v;
    return p;
    // return texture2D( channel0, p );
}