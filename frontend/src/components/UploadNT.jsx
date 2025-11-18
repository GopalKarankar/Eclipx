import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

// Supabase constants
const SUPABASE_URL = "https://qaptekeguowshtiumgnb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcHRla2VndW93c2h0aXVtZ25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNTQzMDgsImV4cCI6MjA3NTczMDMwOH0.CZzwUa5CKRD0idV2bUvuzxZcpNH48oc-OFUKx87HxYM";
const BUCKET = "video"; // same bucket

// Styled components
const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 1000px;
  background-color: ${({ theme }) => theme.bgLighter};
  margin-top: 30px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Close = styled.div`
  color: white;
  right: 20px;
  cursor: pointer;
  align-self: flex-end;
`;

const Title = styled.h1`
  color: white;
  font-weight: 500;
`;

const InputFile = styled.input`
  color: white;
  width: 70%;
`;

const InputText = styled.input`
  width: 70%;
`;

const InputTextarea = styled.textarea`
  width: 70%;
`;

const Button = styled.button`
  display: inline;
  background-color: gray;
  color: white;
  cursor: pointer;
`;

const Label = styled.label`
  color: white;
`;

function UploadNT({ setOpen }) {

  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState([]);

  const [videoUploading, setVideoUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [videoProgress, setVideoProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);

  const [videoPath, setVideoPath] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const videoXhrRef = useRef(null);
  const imageXhrRef = useRef(null);

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  // Function to send video details to backend
  const postVideoDetails = async (videoUrl, imageUrl) => {
    try {
      await axios.post(
        "https://eclipx-six.vercel.app//api/videos/",
        {
          title,
          desc,
          tags,
          videoUrl,
          imageUrl,
        },
        {
          withCredentials: true,
        }
      );
      console.log("✅ Video details uploaded successfully!");
      alert("Video details saved successfully!");
    } catch (error) {

      console.error("❌ Error saving video details:", error);
      alert("Error saving video details");

    }
  };

  // Watch for both uploads to complete
  useEffect(() => {
    if (videoPath && imagePath) {
      const videoPublicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${videoPath}`;
      const imagePublicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${imagePath}`;
      postVideoDetails(videoPublicUrl, imagePublicUrl);
    }
  }, [videoPath, imagePath]);

  // Upload file (video or image)
  const uploadFile = (file, type) => {
    const isVideo = type === "video";
    const setUploading = isVideo ? setVideoUploading : setImageUploading;
    const setProgress = isVideo ? setVideoProgress : setImageProgress;
    const setPath = isVideo ? setVideoPath : setImagePath;
    const xhrRef = isVideo ? videoXhrRef : imageXhrRef;

    setUploading(true);
    setProgress(0);
    setPath(null);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    const folder = isVideo ? "Videos" : "Thumbnails";
    const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${folder}/${file.name}`;

    xhr.open("POST", url);
    xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);
    xhr.setRequestHeader("Authorization", `Bearer ${SUPABASE_ANON_KEY}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200 || xhr.status === 201) {
        setPath(`${folder}/${file.name}`);
        console.log(`${type} upload successful`);
      } else {
        console.error(`${type} upload failed`, xhr.responseText);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      console.error(`${type} upload error`);
    };

    xhr.onabort = () => {
      setUploading(false);
      setProgress(0);
      console.log(`${type} upload cancelled`);
    };

    xhr.send(file);
  };

  const cancelVideoUpload = () => {
    if (videoXhrRef.current) videoXhrRef.current.abort();
  };

  const cancelImageUpload = () => {
    if (imageXhrRef.current) imageXhrRef.current.abort();
  };

  return (
    <Container>
      <Wrapper>

        <Close onClick={() => setOpen(false)}>
          <i className="fa-solid fa-xmark fa-2x"></i>
        </Close>

        <Title>Upload a new video</Title>

        {/* Video File */}
        <Label>Video File:</Label>
        <InputFile
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          disabled={videoUploading}
        />
        {videoUploading && (
          <>
            <progress value={videoProgress} max="100" />
            <Button onClick={cancelVideoUpload}>Cancel Video</Button>
          </>
        )}
        {videoPath && <p style={{ color: "lightgreen" }}>Uploaded: {videoPath}</p>}


        {/* Image File */}
        <Label>Thumbnail Image:</Label>
        <InputFile
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          disabled={imageUploading}
        />
        {imageUploading && (
          <>
            <progress value={imageProgress} max="100" />
            <Button onClick={cancelImageUpload}>Cancel Image</Button>
          </>
        )}
        {imagePath && <p style={{ color: "lightgreen" }}>Uploaded: {imagePath}</p>}


        {/* Title */}
        <InputText
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <InputTextarea
          placeholder="Description"
          rows={6}
          onChange={(e) => setDesc(e.target.value)}
        />

        {/* Tags */}
        <InputText
          type="text"
          placeholder="Separate tags with commas"
          onChange={handleTags}
        />


        {/* Upload Buttons */}
        <Button
          onClick={() => uploadFile(videoFile, "video")}
          disabled={!videoFile || videoUploading}
        >
          {videoUploading ? "Uploading..." : "Upload Video"}
        </Button>

        <Button
          onClick={() => uploadFile(imageFile, "image")}
          disabled={!imageFile || imageUploading}
        >
          {imageUploading ? "Uploading..." : "Upload Image"}
        </Button>
      </Wrapper>
    </Container>
  );
}

export default UploadNT;
