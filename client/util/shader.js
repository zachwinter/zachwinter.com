import * as THREE from 'three'

var container;
var camera, scene, renderer;
var uniforms;

init();
animate();

function init() {
    container = document.body

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();

    var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() }
    };

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: `
        void main() {
          gl_Position = vec4( position, 1.0 );
        }
        `,
        fragmentShader: `
        uniform vec2 u_resolution;
        uniform float u_time;


        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;

          vec3 wave_color = vec3(0.0);
        
          float wave_width = 0.0;
          uv  = -3.0 + 2.0 * uv;
          uv.y += 0.0;
          for(float i = 0.0; i <= 8.0; i++) {
            uv.y += (0.4+(0.2*sin(u_time/20.) * sin(uv.x + i/2.0 + 2.0 *u_time )));
                uv.x += 1.7* sin(u_time*0.4);
            wave_width = abs(1. / (300.0*(cos(u_time)) * uv.y));
            wave_color += vec3(wave_width *( 0.4+((i+1.0)/1.0)), wave_width * (i / 2.0), wave_width * ((i+1.0)/ 2.0) * 12.9);
          }
        
          gl_FragColor = vec4(wave_color, 1.0);
        }
        `
    } );

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();


    container.appendChild( renderer.domElement );

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );

    document.onmousemove = function(e){
      uniforms.u_mouse.value.x = e.pageX
      uniforms.u_mouse.value.y = e.pageY
    }
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    uniforms.u_time.value += 0.05;
    renderer.render( scene, camera );
}