
const getFrame = async (stream) => {
    const track = stream.getVideoTracks()[0];
    let imageCapture = new ImageCapture(track);
    return imageCapture.grabFrame();
}

const changeImageBrigthness = (frame, ctx, brightness) =>{
    let image = getImageData(canvas, ctx, frame);
    let pixels = image.data;

    for (var i = 0; i < pixels.length; i += 4) {
            let red =  pixels[i];
            let green = pixels[i+1];
            let blue = pixels[i+2];
            
            pixels[i]  =    (red * brightness) ;
            pixels[i+1]  =   ( green * brightness);
            pixels[i+2] =  (blue * brightness);
    }
    return image;
}

const getImageData = (canvas, ctx, frame) => {
    let ratio  = Math.min(canvas.width / frame.width, canvas.height / frame.height);
    
    let x = (canvas.width - frame.width * ratio) / 2;
    let y = (canvas.height - frame.height * ratio) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0, frame.width, frame.height,x, y, frame.width * ratio, frame.height * ratio);

    return ctx.getImageData(0, 0, frame.width, frame.height);
}
