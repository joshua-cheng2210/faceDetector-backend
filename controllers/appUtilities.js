export const getProfile = (req, res, db) => {
    // console.log("req.param", req.params)
    const { id } = req.params
    db.select("*").from("users").where({
        id: id
    }).then(response => {
        // console.log("printing get users: ", response, "response.length: ", response.length)
        if (response.length != 1){
            return res.status(400).json("unable to get profile")
        }
        return res.json(response)
    }).catch(() => {res.status(400).json("unable to get profile")})
}

export const updateUserRank = (req, res, db) => {
    const { id } = req.body
    db("users").where({
        id: id
    }).increment("entries", 1).returning("entries").then(data => {
        // console.log(data)
        return res.json(data[0])
    }).catch(() => {
        return res.json("failed to update rank")
    })
}

const USER_ID = 'chen7647';
const APP_ID = 'my-first-application-ddxi3q';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

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
            'Content-Type': 'application/json',
            // 'Accept': 'application/json',
            'Authorization': 'Key ' + PAT,
            // 'Access-Control-Allow-Origin' : "*",
            // "origin" : "*"
        },
        body: raw
    };
  
    return requestOptions
})

export const getoutput = (req, res) => {
    // https://www.shutterstock.com/image-photo/happy-businessman-enjoying-home-office-600nw-2257033579.jpg
    // console.log("req.body: ", req.body)
    const { imgURL } = req.body

    const requestOptions = getClarifyRequest(imgURL);
    const url = "https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID  + "/outputs";

    fetch(url, requestOptions)
    .then((response) => {
        // console.log("response: ", response)
        return response.json()
    }).then(data => {
        // console.log("\n\n------------------------\n\n")
        // console.log("data: ", data);
        console.log("data.status.code: ", data.status.code);
        // console.log("\n\ndata.outputs[0].regions: ", data.outputs[0].data.regions);
        // console.log("\n\ndata.outputs[0].regions.region_info: ", data.outputs[0].data.regions[0].region_info);
        // console.log("\n\ndata.outputs[0].regions.data: ", data.outputs[0].data.regions[0].data);
        
        res.status(200).json(data);
    }).catch(error => {
        // console.log("\n\n---------------there is an error----------\n\n")
        console.log('error', error)
        return res.status(500).json(error)
    });

    
    // .then(result => {
    //   console.log("result:", result)
    // //   this.getBoundingBoxes(result.outputs[0].data.regions);
    // //   this.updateNumEntries()
    // })

    // try {
    //     const response = await fetch(url, requestOptions);
    //     const data = await response.json();
    //     console.log("data: ", data)
    //     console.log("\n\ndata.outputs[0]: ", data.outputs[0].data.regions)
    //     res.json(data); // Send the Clarifai API response back to the frontend
    // } catch (error) {
    //     console.error('Error communicating with Clarifai API:', error);
    //     res.status(500).json({ error: 'Failed to fetch data from Clarifai API' });
    // }
}