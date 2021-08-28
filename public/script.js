
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');


const ctx = canvas.getContext('2d');
canvas.width = getComputedStyle(canvas).width.split('px')[0];
canvas.height = getComputedStyle(canvas).height.split('px')[0];

const playButton = document.getElementById('play-button');
const redButton = document.getElementById('red-buttom');
const greenButton = document.getElementById('green-buttom');

let brightness = 1;

class Camera {
  constructor(constraints) {
    this.constraints = constraints;
  }
  async getCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  }
}

class Player {
  constructor(camera) {
    this.camera = camera;
    this.streamStarted = false;
  }

  start(){
    if (this.streamStarted) {
      video.play();
      return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
      this.startStream({
        ...this.camera.constraints,
        deviceId: {
          exact: cameraOptions.value
        }
      });
    }
  }

  async startStream (constraints){
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    setInterval(async () => {
     let frame = await getFrame(stream);
     let image  = changeImageBrigthness(frame, ctx, brightness);
     ctx.putImageData(image, 0, 0);
    }, 120);
    
    video.srcObject = canvas.captureStream(120) ; 
  }

}


const camera = new Camera({
  video: {
    width: {
      min: 1280 / 4,
      ideal: 1280  / 4,
      max: 1280  / 4,
    },
    height: {
      min: 720  / 4,
      ideal: 720  / 4,
      max: 720  / 4
    },
  }
})

const player = new Player(camera);

playButton.onclick = () => player.start();

redButton.addEventListener('change', (x) => brightness = x.target.value);




const init  = async () => {
  const cameras = await camera.getCameras();
  return cameras.map(( videoDevice) => `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`);
}

init().then(cameras => {
  cameraOptions.innerHTML = cameras.join('');
})
