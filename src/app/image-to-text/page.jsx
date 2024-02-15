"use client";
import React, { useEffect, useState } from "react";
import { HfInference } from "@huggingface/inference";
import axios from "axios";

const page = () => {
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const onUploadImage = (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mivjmkcg");
    axios
      .post("https://api.cloudinary.com/v1_1/dvuphar2o/image/upload", formData)
      .then((res) => {
        setImg(res.data.url);
        setLoading(false);
      });
  };

  const [result, setResult] = useState("");
  const token = process.env.HF_ACCESS_TOKEN;
  const inference = new HfInference(token);
  const modal = "nlpconnect/vit-gpt2-image-captioning";

  const DetectImg = async () => {
    if (img == "") {
      return alert("Please select an image");
    }
    setLoading(true);
    const res = await fetch(img);
    const imgBlob = await res.blob();
    const result = await inference.imageToText({
      data: imgBlob,
      model: modal,
    });
    setResult(result?.generated_text);
    setLoading(false);
  };

  const generateResponse = async (messageObject) => {
    const model = "stabilityai/stable-cascade";
    const result = await inference.textToImage({
      model,
      data: "Create a photo a money in the place of the person in front of the camera",
    });
    console.log(result);
  };

  useEffect(() => {
    generateResponse();
  }, []);

  return (
    <div>
      <input
        type="file"
        id="photo"
        name="photo"
        onChange={(e) => onUploadImage(e.target.files[0])}
        className="form-control"
        defaultValue=""
        placeholder="Choose Photo"
        required=""
        data-error="Please select a photo"
      />
      <button
        style={{ border: "1px solid grey" }}
        onClick={DetectImg}
        disabled={loading}
      >
        {loading ? "Loading..." : "Generate Text"}
      </button>
      <h1>{result}</h1>
    </div>
  );
};

export default page;
