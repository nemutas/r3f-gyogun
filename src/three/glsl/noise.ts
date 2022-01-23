export const random33 = `
vec3 random33(vec3 c) {
  float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
  vec3 r;
  r.z = fract(512.0*j);
  j *= .125;
  r.x = fract(512.0*j);
  j *= .125;
  r.y = fract(512.0*j);
  return r-0.5;
}
`

export const snoise31 = `
${random33}

const float F3 =  0.3333333;
const float G3 =  0.1666667;

float snoise31(vec3 p) {
  vec3 s = floor(p + dot(p, vec3(F3)));
  vec3 x = p - s + dot(s, vec3(G3));
    
  vec3 e = step(vec3(0.0), x - x.yzx);
  vec3 i1 = e*(1.0 - e.zxy);
  vec3 i2 = 1.0 - e.zxy*(1.0 - e);
    
  vec3 x1 = x - i1 + G3;
  vec3 x2 = x - i2 + 2.0*G3;
  vec3 x3 = x - 1.0 + 3.0*G3;
    
  vec4 w, d;
    
  w.x = dot(x, x);
  w.y = dot(x1, x1);
  w.z = dot(x2, x2);
  w.w = dot(x3, x3);
    
  w = max(0.6 - w, 0.0);
    
  d.x = dot(random33(s), x);
  d.y = dot(random33(s + i1), x1);
  d.z = dot(random33(s + i2), x2);
  d.w = dot(random33(s + 1.0), x3);
    
  w *= w;
  w *= w;
  d *= w;
    
  return dot(d, vec4(52.0));
}
`

export const snoise33 = `
${snoise31}

vec3 snoise33(vec3 x) {
  float s  = snoise31(vec3( x ));
  float s1 = snoise31(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = snoise31(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  vec3 c = vec3( s , s1 , s2 );
  return c;
}
`

export const curlNoise33 = `
${snoise33}

vec3 curlNoise33(vec3 p) {
  const float e = .1;
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  vec3 p_x0 = snoise33( p - dx );
  vec3 p_x1 = snoise33( p + dx );
  vec3 p_y0 = snoise33( p - dy );
  vec3 p_y1 = snoise33( p + dy );
  vec3 p_z0 = snoise33( p - dz );
  vec3 p_z1 = snoise33( p + dz );

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}
`
