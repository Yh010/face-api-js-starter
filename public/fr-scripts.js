//console.log(faceapi)

const run = async () => {
    
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])
    let refFace = await faceapi.fetchImage('https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Michael_Jordan_in_2014.jpg/220px-Michael_Jordan_in_2014.jpg');
    
    let FacesToCheck = await faceapi.fetchImage('https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/JordanSmithWorthy2.jpg/170px-JordanSmithWorthy2.jpg');
    
    // let faceOne = await faceapi.fetchImage('image_url'); //check this step => how the canvas is being drawn on the image in the DOM, if we are fetching the image , then that fetched object, and the DOM object are 2 different things right ?
    let reffaceData = await faceapi.detectAllFaces(refFace).withFaceLandmarks().withFaceDescriptors();
    let facesToCheckData = await faceapi.detectAllFaces(FacesToCheck).withFaceLandmarks().withFaceDescriptors();

    //console.log(faceData)

    //grabbing the image:
    const canvas = document.getElementById("canvas");
    faceapi.matchDimensions(canvas,FacesToCheck)
    
        //face matching:
    let faceMatcher = new faceapi.FaceMatcher(reffaceData)
    facesToCheckData = faceapi.resizeResults(facesToCheckData, FacesToCheck)
    
    //loop thru all of the faces in our imageToCheck and compare to our reference face data
    facesToCheckData.forEach(face => {
        const { detection, descriptor } = face;
        //make a label , using the default
        let label = faceMatcher.findBestMatch(descriptor).toString() 
        console.log(label)
        if (label.includes("unknown")) {
            return
        }
        let options = { label: "Jordan" }
        const drawBox = new faceapi.draw.DrawBox(detection.box, options);
        drawBox.draw(canvas)
    });
    
}

run()