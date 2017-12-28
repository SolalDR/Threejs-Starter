// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats

import OBJLoader from "./helpers/OBJLoader.js"
import OrbitControls from "./helpers/OrbitControls.js"
import fragment from "./../glsl/model.frag";
import vertex from "./../glsl/model.vert";


import Dat from "dat-gui"


export default class App {

    constructor() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(0, 3, 20);

        this.initConfig();
    	this.scene = new THREE.Scene();

        this.controls = new OrbitControls( this.camera );
        this.controls.maxZoom = 50; 
        // this.camera.lookAt(0, 0, 0);
        // this.controls.update();

    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor ( 0xEEEEEE, 1 )
    	this.container.appendChild( this.renderer.domElement );

        this.onWindowResize();
        this.loadModel();
        this.initEnvironnement();
        this.initDatGUI();
        this.renderer.animate( this.render.bind(this) );
    }


    initEnvironnement(){
        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( light );

        var hemisphere = new THREE.HemisphereLight( 0x000000, 0xAAAAAA, 4.0 );
        hemisphere.position.set(15, 150, 15); 
        this.scene.add(hemisphere);

        // var planeMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, side: THREE.DoubleSide} );
        // var plane = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000, 32, 32 ), planeMaterial );
        // plane.position.set(0, -30, 0);
        // plane.rotation.x = -Math.PI/2;
        // this.scene.add( plane );
    }

    // -----------------------------------------

    // Config and DatGUI
    initDatGUI() {
        var self = this;
        var gui = new Dat.GUI();
        gui.add(this.config.model, 'scale', 0, 100).onChange((value) => {
            self.model.scale.set(value, value, value);    
        });
    }

    initConfig(){
        this.config = {
            model: {
                path: '/app/models/turtle/turtle.obj', 
                scale: 1
            }
        }
    }

    // -----------------------------------------

    // Load and display the model
    loadModel(path){
        var loader = new OBJLoader();
        loader.load( this.config.model.path, ( object ) => { this.addModel(object) },
            function ( xhr ) { console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' ) },
            function ( error ) { console.log( 'An error happened' ) }
        );
    }

    addModel(object){
        console.log(object)
        var material = new THREE.RawShaderMaterial({
            // uniforms: uniforms,
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true
        });

        for(var i=0; i<object.children.length; i++){
            object.children[i].material = material;
        }
        this.model = object;
        this.model.scale.set(this.config.scale, this.config.scale, this.config.scale);
        // this.model.material = new THREE.MeshPhongMaterial( {
        //     color: 0xffffff,
        //     emissive: 0x000000,
        //     specular: 0x000000,
        //     shininess: 50
        // });


        this.model.scale.set(15, 15, 15);
        this.model.rotation.y = Math.PI/8*3;
    
        this.scene.add( this.model );
    }


    // -----------------------------------------


    render() {
    	this.renderer.render( this.scene, this.camera );
    }


    // -----------------------------------------
    

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
