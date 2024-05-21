import React from 'react';
import ErrorBoundary from "./ErrorBoundary";

import AWS from "aws-sdk"

function App() {

    const S3_BUCKET_NAME = "tickettomorrowstaticbucket192143-test";
    const REGION = "ap-southeast-1";
    const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
    const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;


    console.log("check env",ACCESS_KEY, SECRET_KEY)
    AWS.config.update({
        region: REGION,
        credentials: new AWS.Credentials(ACCESS_KEY as string, SECRET_KEY as string),
    });
    const handleChange = async (e: any) => {
        console.log("dataaaa", e.target.files[0])
        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: e.target.files[0].name,
            Body: e.target.files[0],
            ContentType: e.target.files[0].type,
            CacheControl: "no-cache",
        };

        try {
            const S3 = new AWS.S3();
            const data = await S3.upload(params).promise();
            console.log(data)
            alert('File uploaded successfully.');
            return data
        } catch (e) {
            console.error("image error", e);
            // alert('Error uploading file.');
            return "";
        }
    }

  return (
    <ErrorBoundary>
        <input onChange={handleChange} type={"file"}/>
      {/*<BrowserRouter>*/}
      {/*  <Routes>*/}

      {/*      <Route path={"/"} element={<Home/>}/>*/}
      {/*      <Route/>*/}
      {/*  </Routes>*/}
      {/*</BrowserRouter>*/}

    </ErrorBoundary>
  );
}

export default App;
