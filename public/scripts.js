console.log(faceapi)

const run = async () => {
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])
    let faceOne = document.getElementById('face');
    // let faceOne = await faceapi.fetchImage('image_url'); //check this step
    let faceData = await faceapi.detectAllFaces(faceOne).withFaceLandmarks().withFaceDescriptors().withAgeAndGender();
    console.log(faceData)

    //grabbing the image:
    const canvas = document.getElementById("canvas");
    canvas.style.left = faceOne.offsetLeft
    canvas.style.top = faceOne.offsetTop
    canvas.height = faceOne.height
    canvas.width = faceOne.width

    //drawing the box:
    faceData = faceapi.resizeResults(faceData, faceOne)
    faceapi.draw.drawDetections(canvas,faceData)

    //age and gender:
    faceData.forEach(face => {
        const { age, gender, genderProbability } = face;
        const genderText = `${gender} - ${genderProbability}`;
        const ageText = `${Math.round(age)} years`;
        const textfield = new faceapi.draw.DrawTextField([genderText, ageText], face.detection.box.bottomLeft)
        textfield.draw(canvas)
    })
    
    //
}

run()