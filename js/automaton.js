//bool for whether an alg is running already
let running;

//dimensions, in cells, of the world
let size;

//objects
let scene;
let renderer;
let camera;

let mainAmbientLight;
let mainDirectionalLight;
let stageBox;



let boardState;
let newState;
let boardDisplay;

// cellinput canvas
let cInput;
let ctxInput;
let inDepth = 0;



window.onload = (event) =>{
  setupThree();
  setupStage();
  animate();
  setupControls();
}



//animate function
function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene , camera);

  stageBox.rotation.y += 0.002;
  // stageBox.rotation.x += 0.005;
}


//set up the canvas
function setupThree(){
  //set up the scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75 , window.innerWidth/window.innerHeight , 0.1 , 1000 );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.background = new THREE.Color( 0xc0c0c0 );
  document.body.appendChild(renderer.domElement);
}

//set up the parent box
function setupStage(){
  let geometry = new THREE.BoxGeometry();
  let material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe:true,
  });

  stageBox = new THREE.Mesh( geometry , material );

  camera.position.z = 1.25;
  camera.position.y = .55;
  camera.rotation.x = -.5;

  mainAmbientLight = new THREE.AmbientLight( 0xd6d6d6 , 0.9 );
  mainDirectionalLight = new THREE.DirectionalLight( 0xffffff, 0.4 );

  mainDirectionalLight.position.set(4,4,-4);

  scene.add( stageBox , mainAmbientLight , mainDirectionalLight );

  renderer.render( scene , camera );
}



function fillStage(){
  //creates: array boardState, array newState, array boardDisplay
  //populates boardState and newState binary, populates boardDisplay with cell meshes

  // create arrays
  boardState = new Array(size);
  newState = new Array(size);
  boardDisplay = new Array(size);
  for (let i = 0; i < size; i++){
    boardState[i] = new Array(size);
    newState[i] = new Array(size);
    boardDisplay[i] = new Array(size);
    for (let j = 0; j < size; j++){
      boardState[i][j] = new Array(size);
      newState[i][j] = new Array(size);
      boardDisplay[i][j] = new Array(size);
    }
  }

  // populate arrays
  let geometry = new THREE.BoxGeometry( 1/size , 1/size , 1/size );
  let material = new THREE.MeshLambertMaterial({
    color:0x789cd6,
  });
  for (let i = 0; i < size; i++){
    for (let j = 0; j < size; j++){
      for (let k = 0; k < size; k++){
        boardState[i][j][k] = 0;
        newState[i][j][k] = 0;
        boardDisplay[i][j][k] = new THREE.Mesh( geometry , material );
        boardDisplay[i][j][k].position.set( (1/size * i) - (.5 - .5/size) , (1/size * j) - (.5 - .5/size) , (1/size * k) - (.5 - .5/size) );
        stageBox.add( boardDisplay[i][j][k] );
      }
    }
  }


}




//run the sim
function runSim(ruleSet, speed, p1,p2,p3,p4){
  running = true;
  var runID = setInterval(function(){

    ruleSet(p1,p2,p3,p4);
    boardState = newState;
    updateDisplay();


  },speed);
  document.getElementById('btn-stop').remove();
  document.getElementById('stop-wrapper').innerHTML += '<button type="button" id="btn-stop">Stop</button>'
  let btnStop = document.getElementById('btn-stop');
  btnStop.addEventListener('click', () =>{
    running = false;
    clearInterval(runID);
    console.log('stopped');
  });
}


function updateDisplay(){
  for (let i = 0; i < size; i++){
    for (let j = 0; j < size; j++){
      for (let k = 0; k < size; k++){
        if(boardState[i][j][k] == 0){
          boardDisplay[i][j][k].visible = false;
        }else{
          boardDisplay[i][j][k].visible = true;
        }
      }
    }
  }
}





//set up canvas for drawing cells:
function setupControls(){
  cInput = document.getElementById('cell-draw');
  ctxInput = cInput.getContext('2d');
  ctxInput.fillStyle = 'white';
  ctxInput.fillRect(0,0,200,200);

  //event handler for clicks on canvas
  cInput.addEventListener('click', (e) => {
    let rect = cInput.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let gX = Math.floor( x / (cInput.width / size) );
    let gY = Math.floor( y / (cInput.height / size) );

    if(boardState[gX][inDepth][gY] == 1){
      boardState[gX][inDepth][gY] = 0;
    }else{
      boardState[gX][inDepth][gY] = 1;
    }
    updateDisplay();
    updateInputCanvas();

  })


  let btnMinus = document.getElementById('depth-minus');
  let btnPlus = document.getElementById('depth-plus')

  btnMinus.addEventListener('click', () =>{
    if (inDepth > 0){
      inDepth --;
      updateInputCanvas();
    }
  })
  btnPlus.addEventListener('click', () =>{
    if (inDepth < size-1){
      inDepth ++;
      updateInputCanvas();
    }
  })


  let btnInitialize = document.getElementById('btn-initialize');
  btnInitialize.addEventListener('click', () => {
    clearState();
    size = parseInt(document.getElementById('input-size').value);
    fillStage();
    updateDisplay();
    updateInputCanvas();
  })

  let btnStart = document.getElementById('btn-start');
  btnStart.addEventListener('click', () => {
    if (!running){
      let rules = document.getElementById('select-rules').value;
      console.log(rules);
      let speed = document.getElementById('input-speed').value;

      switch(rules){
        case 'life-trad':
          runSim(customLife, speed, 2,3,3,3);
          break;
        case 'life-vn':
          runSim(vnLife, speed);
          break;
        case 'life-4555':
          runSim(customLife, speed, 4,5,5,5);
          break;
        case 'life-4666':
          runSim(customLife, speed, 4,6,6,6);
          break;
        case 'life-5766':
          runSim(customLife, speed, 5,7,6,6);
          break;
        case 'life-6877':
          runSim(customLife, speed, 6,8,7,7);
          break;
        default:
          alert('Not yet implemented.');
      }
    }else{
      alert('Please stop current simulation first.')
    }
  })

}
function updateInputCanvas(){
  document.getElementById('lbl-depth').innerHTML = inDepth;

  let ratioSize = cInput.width / size;
  ctxInput.strokeStyle = '#ffffff'
  for (let i = 0; i < size; i++){
    for (let j = 0; j < size; j++){
      if (boardState[i][inDepth][j] == 1){
        ctxInput.fillStyle = '#789cd6';
      }else{
        ctxInput.fillStyle = '#c0c0c0';
      }
      ctxInput.beginPath();
      ctxInput.rect(i * ratioSize , j * ratioSize , ratioSize , ratioSize);
      ctxInput.fill();
      ctxInput.stroke();
    }
  }
}




function clearState(){
  if (size > 0){
    for (let i = 0; i < size; i++){
      for (let j = 0; j < size; j++){
        for (let k = 0; k < size; k++){
          stageBox.remove(boardDisplay[i][j][k]);
        }
      }
    }
  }
}




//functions for neighbor checks

function vnNeighbors3D(x,y,z){//von neumann (in 3d, checks in 6 cells)
  let sum = 0;
  for (let i = -1; i < 2; i++){
    if (i != 0){
      sum += boardState[(size + x + i) % size][y][z];
      sum += boardState[x][(size + y + i) % size][z];
      sum += boardState[x][y][(size + z + i) % size];
    }
  }
  return sum;
}

function mooreNeighbors3D(x,y,z){// moore neighborhood, "life - style" - in 3d - checks 26 cells
  let sum = 0;
  for (let i = -1; i < 2; i++){
    for (let j = -1; j < 2; j++){
      for (let k = -1; k < 2; k++){
        if(!(i == 0 && j == 0 && k == 0)){//don't count self!
          sum += boardState[(size + x + i) % size][(size + y + j) % size][(size + z + k) % size];
        }
      }
    }
  }
  return sum;
}



//functions for rulesets
//NOTE: ruleset functions only update the boardState into the newState array.
//      They don't update the board appearance or modify the  boardState array.

function gameOfLife(){// Conway's Life (1970) - Standard ruleset
  for (let i = 0; i < size; i++){
    for (let j = 0; j < size; j++){
      for (let k = 0; k < size; k++){
        if (mooreNeighbors3D(i,j,k) == 3 || (boardState[i][j][k] == 1 && mooreNeighbors3D(i,j,k) == 2)){
          newState[i][j][k] = 1;
        }else{
          newState[i][j][k] = 0;
        }
      }
    }
  }
}


function vnLife(){// Conway's Life cell rules, using Von Neumann neighbors
  for (let i = 0; i < size; i++){
    for (let j = 0; j < size; j++){
      for (let k = 0; k < size; k++){
        if (vnNeighbors3D(i,j,k) == 3 || (boardState[i][j][k] == 1 && vnNeighbors3D(i,j,k) == 2)){
          newState[i][j][k] = 1;
        }else{
          newState[i][j][k] = 0;
        }
      }
    }
  }
}

function customLife(p1,p2,p3,p4){
  for (let i = 0; i < size; i++){
    for (let j = 0; j < size; j++){
      for (let k = 0; k < size; k++){
        if ( (boardState[i][j][k] == 1 && (mooreNeighbors3D(i,j,k) >= p1 && mooreNeighbors3D(i,j,k) <= p2)) || (boardState[i][j][k] == 0 && (mooreNeighbors3D(i,j,k) >= p3 && mooreNeighbors3D(i,j,k) <= p4) ) ){
          newState[i][j][k] = 1;
        }else{
          newState[i][j][k] = 0;
        }
      }
    }
  }
}
