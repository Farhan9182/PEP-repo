const imageUpload = document.getElementById('imageUpload');
const video = document.getElementById('video');
const modal = document.querySelector('.modal');
const reader = new FileReader();
const label = ["Farhan"];

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

document.getElementById('verify-button').addEventListener('click',function(){
  let element = document.querySelector('.modal');
  element.classList.add('open');

  if(element.classList.contains('open'))
  {
    document.querySelector('.front').classList.add('blur');
  }
  document.querySelector('.close').addEventListener('click', function(){
    document.querySelector('.modal').classList.remove('open');
    document.querySelector('.front').classList.remove('blur');
  })

  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  
  video.addEventListener('play', () => {
    
    (async () => {
      const canvas1 = faceapi.createCanvasFromMedia(video)
      document.querySelector('.content2').appendChild(canvas1);
      canvas1.style.width = '100%';
      canvas1.style.height = '100%';

      canvas1.width  = canvas1.offsetWidth;
      canvas1.height = canvas1.offsetHeight;
      const displaySize1 = { width: video.videoWidth, height: video.videoHeight }
      faceapi.matchDimensions(canvas1, displaySize1)

      const detections1 = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
      const resizedDetections1 = faceapi.resizeResults(detections1, displaySize1)
      canvas1.getContext('2d').clearRect(0, 0, canvas1.width, canvas1.height)
      faceapi.draw.drawDetections(canvas1, resizedDetections1)
      faceapi.draw.drawFaceLandmarks(canvas1, resizedDetections1)
      // faceapi.draw.drawFaceExpressions(canvas1, resizedDetections1)
      const labeledFaceDescriptors = await Promise.all(
        label.map(async label => {
          const img = await faceapi.fetchImage(reader.result);
          
          detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          if (!detections) {
            throw new Error(`no faces detected for ${label}`)
          }
        const faceDescriptors = [detections.descriptor]
        return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
      })
      )
      const maxDescriptorDistance = 0.6;
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);
      
      const results = resizedDetections1.map(fd => faceMatcher.findBestMatch(fd.descriptor))
      
      results.forEach((bestMatch, i) => {
        const box = resizedDetections1[i].detection.box
        const text = bestMatch.toString()
        console.log(text);
        const drawBox = new faceapi.draw.DrawBox(box, { label: text })
        drawBox.draw(canvas1)
        if(text.includes(label[0])){
          alert("Matching Successful");
          document.querySelector('button[type="submit"]').style.display = "block";
          document.getElementById('verify-button').style.display = "none";
          document.querySelector('.close').click();
        }
        else{
          alert("Try again");
          document.querySelector('.close').click();
        }
      })
      image = await faceapi.bufferToImage(imageUpload.files[0])
      canvas = faceapi.createCanvasFromMedia(image)
      document.querySelector('.content1').appendChild(canvas);
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const displaySize = { width: image.width, height: image.height }
      faceapi.matchDimensions(canvas, displaySize)
      const detections2 = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
      const resizedDetections = faceapi.resizeResults(detections2, displaySize)
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      // faceapi.draw.drawDetections(canvas, resizedDetections)
      // console.log(detections);
      // console.log(detections1);
      // const distance = faceapi.euclideanDistance(resizedDetections,resizedDetections1);
      // console.log(distance);
    })();
  });

  
    
    
});

function start() {

  // const container = document.querySelector('.image-container');
  // container.style.position = 'relative';
  // const labeledFaceDescriptors = await loadLabeledImages()
  // const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  // let image
  // let canvas
  
  imageUpload.addEventListener('change', async () => {
    
    
    reader.onload = function(){
      var output = document.getElementById('profile-image');
      var selected_image = document.querySelector('.uploaded-image');
      output.src = reader.result;
      selected_image.src = reader.result;
    };
    reader.readAsDataURL(imageUpload.files[0]);

    //document.querySelector(".image-container").style.backgroundImage = imageUpload.files[0];
    // if (image) image.remove()
    // if (canvas) canvas.remove()
    
  })
}

document.querySelector('button[type="submit"]').addEventListener('click',function(){
  alert("Thank You for your response");
  window.location.href = "http://127.0.0.1:5500/index.html";
})