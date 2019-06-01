import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';



@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  pointsa = null;
  elementsa = null;
  constructor(private router: Router, private loginService: AuthenticationService) { }

  ngOnInit() {
    if (!this.loginService.isUserLoggedIn()) {
      this.router.navigate(['login']);
    }
  }
  

  myFunction(): void {
    console.log('works!');
    alert('DZIAŁAM');

    const reader = new FileReader();
    reader.onload = (e) => {
      alert(reader.result);
      alert('NOPE');
      const lines = reader.result.toString().match(/[^\r\n]+/g);
      let i = 1;
      const points = [];
      let p = 0;
      while (lines[i] !== '*ELEMENT_SOLID') {

        points[p] = [];
        points[p] = lines[i].split(',');
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
      const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth * 0.8, window.innerHeight * 0.8 );


      const camera = new THREE.PerspectiveCamera( 45, window.innerWidth * 0.8 / window.innerHeight * 0.8, 1, 500 );


      let scene = new THREE.Scene();

      this.pointsa = points;
      this.elementsa = elements;
      for ( i = 0 ; i < elements.length ; i++) {
        const geometry = new THREE.Geometry();
        for ( let j = 2; j < elements[i].length ; j++) {
          geometry.vertices.push(new THREE.Vector3(
            points[elements[i][j] - 1][1],
            points[elements[i][j] - 1][2],
            points[elements[i][j] - 1][3]));
          // alert(points[elements[i][j]-1][1]);
        }
        const line = new THREE.Line( geometry, material );
        scene.add( line );
        camera.position.set( 0, 0, 1 );
        camera.lookAt( 0, 0 , 0 );
        renderer.render( scene, camera );
        document.body.appendChild( renderer.domElement );
      }






      // noinspection JSAnnotator


    };
    const x = (document.getElementById('myFile') as HTMLInputElement).files;
    if (x.length > 0) {
      if ((document.getElementById('myFile') as HTMLInputElement).files.length === 0) {
        const txt = 'Select one or more files.';
      } else {
        const file = (document.getElementById('myFile') as HTMLInputElement).files[0];
        reader.readAsText(file, 'UTF-8');

      }
    }

  }
}
