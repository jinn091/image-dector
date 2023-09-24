import React, { useState } from "react";
import "./App.css";
import * as ml5 from "ml5";

const generateBase64FromImage = (imageFile) => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
  });

  reader.readAsDataURL(imageFile);
  return promise;
};

function App() {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState("");
  const [fileTypeError, setFileTypeError] = useState(false);
  const [imageResult, setImageResult] = useState();

  const handleFileChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFile(file);

      if (
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/svg+xml"
      ) {
        generateBase64FromImage(file).then((b64) => {
          setPreviewFile(b64);
        });
        setFileTypeError(false);
      } else {
        setFileTypeError(true);
      }
    }
  };

  const preditImage = async () => {
    const classifier = await ml5.imageClassifier("MobileNet");

    const image = document.getElementById("image");

    classifier.predict(image, (err, result) => {
      setImageResult(result);
    });
  };

  return (
    <>
      {fileTypeError && <p className="warning">File type doesn't support!</p>}
      {
        <div className="input-container">
          {!previewFile ? (
            <img src="/images/ai.png" alt="logo" width="400px" height="210px" />
          ) : (
            <>
              <div className="image-detector">
                <img
                  id="image"
                  src={`${previewFile}`}
                  alt="logo"
                  width="320px"
                  height="400px"
                />
                <div className="image-result-container">
                  <button
                    className="go-back"
                    onClick={() => {
                      setFile(null);
                      setPreviewFile("");
                    }}
                  >
                    Go Back
                  </button>
                  <div className="image-result">
                    {imageResult &&
                      imageResult.map((result) => (
                        <div key={result.probability} className="predict-result">
                          <p>Predict Name : {result.className}</p>
                          <p>Probability : {(result.probability * 100).toFixed(2)} % </p>
                        </div>
                      ))}
                  </div>
                  <div>
                    <button onClick={preditImage} className="ai-button">
                      Detect Image
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          <h1>Upload an image or video to predict</h1>
          <div className="relative cursor-pointer mt-3 text-sm font-semibold">
            <input
              className="upload-inner-input"
              type="file"
              name="file"
              onChange={handleFileChange}
            />
            <button className="upload-inner-btn">Upload image or videos</button>
          </div>
        </div>
      }
    </>
  );
}

export default App;
