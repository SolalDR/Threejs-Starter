
import OrbitControls from "./helpers/OrbitControls.js"
import Dat from "dat-gui"
import Clock from "./helpers/Clock.js"

export default class App {

    constructor() {
        
        // Events
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        document.body.addEventListener("click", this.updateMousePosition.bind(this), false);
        
        // Init
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor ( 0xEEEEEE, 1 )
        this.container.appendChild( this.renderer.domElement );

        // Camera and control
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(5, 1, 5);
        this.controls = new OrbitControls( this.camera );
        this.controls.maxZoom = 50; 
        this.controls.minZoom = 50; 
        

        this.initConfig();

        // Init Clock
        this.clock = new Clock();
        

    	this.scene = new THREE.Scene();

        let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh( geometry, material );
        this.scene.add( this.mesh );

        this.onWindowResize();
        this.renderer.animate( this.render.bind(this) );
    }


    // -----------------------------------------

    // Config and DatGUI
    initConfig(){
        this.config = {
            animationDuration: 5000
        };
        this.initDatGUI();
    }

    initDatGUI() {
        var self = this;
        var gui = new Dat.GUI();
        
        gui.add(this.config, 'animationDuration', 0, 20000);
       
    }

    // -----------------------------------------


    render() {
        this.clock.update();

        this.mesh.rotation.y = (this.clock.elapsed / this.config.animationDuration) * Math.PI*2;

    	this.renderer.render( this.scene, this.camera );
    }


    // -----------------------------------------
        
    updateMousePosition( event ) { 
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    onWindowResize() {
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
