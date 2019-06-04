import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import * as THREE from 'three';
// import { OrbitControls } from 'threnpme-orbitcontrols-ts';
import { HttpClientService, File } from '../service/http-client.service';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';



@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  file: File = new File('', '', '', '');
  files: File[];
  pointsa = null;
  elementsa = null;
  filename = null;

  constructor(private router: Router, private loginService: AuthenticationService,
              private httpClientService: HttpClientService) {
  }

  ngOnInit() {
    if (!this.loginService.isUserLoggedIn()) {
      this.router.navigate(['login']);
    }
    this.file.addedBy = sessionStorage.getItem('username');
  }

  addFile(): void {
    this.file.name = this.filename;
    this.httpClientService.addFile(this.file)
      .subscribe(data => {
        this.getHistory(this.filename);
      });
  }

  getHistory(filename): void {
    this.httpClientService.getFilesByName(this.filename).subscribe(
      response => this.files = response
    );
  }


  myFunction(): void {
    console.log('works!');
    const reader = new FileReader();
    let renderer;
    let scene;
    let camera;
    let material;
    let controls;
    function init() {
      material = new THREE.LineBasicMaterial({color: 0x0000ff});
      // tslint:disable-next-line:variable-name
      const my_canvas = document.getElementById('my_canvas') as HTMLCanvasElement;
      const height = (document.getElementById('my_canvas') as HTMLCanvasElement).height;
      const width = (document.getElementById('my_canvas') as HTMLCanvasElement).width;
      renderer = new THREE.WebGLRenderer({canvas: my_canvas});
      renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
      camera = new THREE.PerspectiveCamera(45, window.innerWidth * 0.8 / window.innerHeight * 0.8, 1, 1000);
      camera.position.set(400, 400, 200);
      scene = new THREE.Scene();

      controls = new TrackballControls(camera, renderer.domElement);
      controls.enableZoom = true;
      // controls.mouseButtons = {
      //   LEFT: THREE.MOUSE.LEFT,
      //   MIDDLE: THREE.MOUSE.RIGHT,
      // };
      console.log('scene ready');
    }
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    reader.onload = (e) => {
      alert(reader.result);
      const lines = reader.result.toString().match(/[^\r\n]+/g);
      let i = 1;
      const points = [];
      let p = 0;
      let maxt = 0;
      let mint = 0;
      while (lines[i] !== '*ELEMENT_SOLID') {
        points[p] = [];
        points[p] = lines[i].split(',');
        if (points[p][4] > maxt) { maxt = points[p][4]; }
        if (points[p][4] < mint) { mint = points[p][4]; }
        p++;
        i++;
      }
      i++;

      const elements = [];
      let ei = 0;

      while (lines[i] !== '*END') {
        elements[ei] = [];
        elements[ei] = lines[i].split(',');
        ei++;
        i++;
      }

      alert('Points array: ' + points[p - 1].length + '\n' + points[p - 1]);
      alert('Elements array: ' + elements[ei - 1].length + '\n' + elements.length + '\n' + elements[ei - 1]);

      this.pointsa = points;
      this.elementsa = elements;
      const scale = 1500;
      const uniforms = THREE.UniformsUtils.clone({uniforms: {
        }});
      const parameters = {vertexColors: THREE.VertexColors,
        fragmentShader: [
          'varying vec3 vColor;',
          'void main( void ) {',
          'gl_FragColor = vec4( vColor.rgb, 1. );',
          '}'
        ].join('\n'),
        vertexShader: [
          'varying vec3 vColor;',
          'void main() {',
          'vColor = color;',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          '}'
        ].join('\n'),
        side: THREE.DoubleSide,
        uniforms};
      let tempcol = 0;
      for (i = 0; i < elements.length; i++) {
        const geometry = new THREE.Geometry();
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 3, 2));
        geometry.faces.push(new THREE.Face3(0, 5, 4));
        geometry.faces.push(new THREE.Face3(0, 1, 5));
        geometry.faces.push(new THREE.Face3(3, 0, 7));
        // geometry.faces.push(new THREE.Face3(4, 2, 5));
        for (let j = 2; j <= elements[i].length; j++) {
          if (j !== elements[i].length) {
            geometry.vertices.push(new THREE.Vector3(
              points[elements[i][j] - 1][1] * scale,
              points[elements[i][j] - 1][2] * scale,
              points[elements[i][j] - 1][3] * scale));

            tempcol = 255 * points[elements[i][j] - 1][4] / maxt;
            tempcol = Math.round(tempcol);
            geometry.faces[0].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
            geometry.faces[1].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
            geometry.faces[2].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
            geometry.faces[3].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
            geometry.faces[4].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
           // geometry.faces[3].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
          } else {
            geometry.vertices.push(new THREE.Vector3(
              points[elements[i][2] - 1][1] * scale,
              points[elements[i][2] - 1][2] * scale,
              points[elements[i][2] - 1][3] * scale));
            tempcol = 255 * points[elements[i][2] - 1][4] / maxt;
            tempcol = Math.round(tempcol);
            geometry.faces[0].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
            geometry.faces[1].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
            geometry.faces[2].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
            geometry.faces[3].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
            geometry.faces[4].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
          //  geometry.faces[3].vertexColors[j - 2] = new THREE.Color('rgb(255,0,0)');
          }
          const material2 = new THREE.ShaderMaterial(parameters);
          const mesh = new THREE.Mesh(geometry, material2);
          scene.add(mesh);
          // alert(points[elements[i][j]-1][1]);
        }
        // console.log(elements);
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        // document.body.appendChild(renderer.domElement);
        // THREE.VertexColorShader = {
        //
        //   uniforms: {
        //   },
        //   vertexShader: [
        //     'varying vec3 vColor;',
        //     'void main() {',
        //     'vColor = color;',
        //     'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        //     '}'
        //   ].join('\n'),
        //   fragmentShader: [
        //     'varying vec3 vColor;',
        //     'void main( void ) {',
        //     'gl_FragColor = vec4( vColor.rgb, 1. );',
        //     '}'
        //   ].join('\n')
        // };
        // const shader = THREE.WebGLShader;


        // mesh.position.y = 1;

      }


      // noinspection JSAnnotator
    };
    const x = (document.getElementById('myFile') as HTMLInputElement).files;
    if (x.length > 0) {
      if ((document.getElementById('myFile') as HTMLInputElement).files.length === 0) {
        const txt = 'Select one or more files.';
      } else {
        const file = (document.getElementById('myFile') as HTMLInputElement).files[0];
        this.filename = file.name;
        this.getHistory(file.name);
        reader.readAsText(file, 'UTF-8');
      }
    }
    init();
    animate();
  }
}

