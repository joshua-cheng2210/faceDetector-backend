const USER_ID = 'chen7647';
const APP_ID = 'my-first-application-ddxi3q';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
const PAT = '1165295fdb9c481aacbfc38c59efc702';

const getClarifyRequest = ((imageURL) => {
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
          "app_id": APP_ID
        },
      "inputs": [
        {
          "data": {
            "image": {
              "url": imageURL
            }
          }
        }
      ]
    });
    // console.log("body: ", JSON.parse(raw))
  
    const requestOptions = {
        method: 'POST',
        headers: {
            // 'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT,
            // 'Access-Control-Allow-Origin' : "*",
            // "origin" : "*"
        },
        body: raw
    };
  
    return requestOptions
})

// export const getoutput = (req, res) => {
//     // https://www.shutterstock.com/image-photo/happy-businessman-enjoying-home-office-600nw-2257033579.jpg
//     // console.log("req.body: ", req.body)
//     const { imgURL } = req.body

//     const requestOptions = getClarifyRequest(imgURL);
//     const url = "https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID  + "/outputs";

//     fetch(url, requestOptions)
//     .then((response) => {
//         // console.log("response: ", response)
//         return response.json()
//     }).then(data => {
//         // console.log("\n\n------------------------\n\n")
//         // console.log("data: ", data);
//         console.log("data.status.code: ", data.status.code);
//         // console.log("\n\ndata.outputs[0].regions: ", data.outputs[0].data.regions);
//         // console.log("\n\ndata.outputs[0].regions.region_info: ", data.outputs[0].data.regions[0].region_info);
//         // console.log("\n\ndata.outputs[0].regions.data: ", data.outputs[0].data.regions[0].data);
        
//         res.status(200).json(data);
//     }).catch(error => {
//         console.log("\n\n---------------there is an error----------\n\n")
//         console.log('error', error)
//         return res.status(500).json(error)
//     });
// }

const input = {imgURL: "https://www.shutterstock.com/image-photo/happy-businessman-enjoying-home-office-600nw-2257033579.jpg"} // input your testing image url here
const requestOptions = getClarifyRequest(input.imgURL);
console.log("requestOptions: ", requestOptions)
const url = "https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID  + "/outputs";
fetch(url, requestOptions).then((response) => {
    console.log("response: ", response)
    return response.json()
}).then(data => {
    console.log("\n\n------------------------\n\n")
    console.log("data: ", data);
    console.log("data.status.code: ", data.status.code);
    if (data.status.code === 10000){
        console.log("\n\ndata.outputs[0].regions: ", data.outputs[0].data.regions);
        console.log("\n\ndata.outputs[0].regions.region_info: ", data.outputs[0].data.regions[0].region_info);
        console.log("\n\ndata.outputs[0].regions.data: ", data.outputs[0].data.regions[0].data);
    }
}).catch(error => { 
    console.log("\n\n---------------there is an error----------\n\n")
    console.log('error', error)
});