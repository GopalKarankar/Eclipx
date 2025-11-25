import React, { useState, useRef } from "react";
import styled from 'styled-components';

// const SUPABASE_URL = "YOUR_SUPABASE_URL";
// const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
// const BUCKET = "your-bucket-name";

const SUPABASE_URL = `${process.env.REACT_APP_SUPABASE_PUBLIC_URL}`;
const SUPABASE_ANON_KEY = `${process.env.REACT_APP_SUPABASE_ANON_KEY}`;
const BUCKET = "video";




    const Container = styled.div`
        width:100%;
        height:100%;
        position:absolute;
        left:0;
        background-color: #000000a7;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    `

    const Wrapper = styled.div`
        width: 600px;
        height: 900px;
        background-color: ${ ({theme}) => theme.bgLighter};
        margin-top: 30px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: relative;
    `

    const Close = styled.div`
        color: white;
        
        right: 20px;
    `

    const Title = styled.h1`
        color: white;
        font-weight: 500;
        
        display: block;
        align-items: center;
        `

    const InputFile = styled.input`
        color: white;
        width: 70%;
        
    `    
        
    const InputText = styled.input`
        width: 70%;
        
        /* background-color: black; */
    `    
    const InputTextarea = styled.textarea`
        width: 70%;
        
        /* background-color: black; */
    `    
        
    const InputText2 = styled.input`
        width: 70%;
        
        /* background-color: black; */
    `    

    const InputFile2 = styled.input`
        color: white;
        width: 70%;
        
    `    

    const Button = styled.button`
            background-color: gray;
            color:white;
    `

    const Label = styled.label`
        color: white;
    `



function UploadN({setOpen}) {

  
      const [imageFile, setImageFile] = useState(null);
  
      const [loading, setLoading] = useState(false);
      const [title, setTitle] = useState("");
  
      // Description
      const [desc, setDesc] = useState("");
  
      const [tags, setTags] = useState([]);
  
  
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedPath, setUploadedPath] = useState(null);
  const [videoFile, setVideoFile] = useState("");

  const xhrRef = useRef(null);

  
    // to assign Tags
    const handleTags = (e) => {
        try {

            setTags(e.target.value.split(","));
        
        } catch (error) {
            
            console.log(error);
        
        }
    }


    //   Upload file
  const uploadFile = (file) => {

    setUploading(true);
    setProgress(0);
    setUploadedPath(null);

    // Set object
    const xhr = new XMLHttpRequest();

    xhrRef.current = xhr;

    const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/video files/${file.name}`;

    // Send request using POST 
    xhr.open("POST", url);

    // Set Supabase auth headers
    xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);
    xhr.setRequestHeader("Authorization", `Bearer ${SUPABASE_ANON_KEY}`);


    // set percent progress
    xhr.upload.onprogress = (event) => {

      if (event.lengthComputable) {
    
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);

        }
        
    };


    // Upload completion
    xhr.onload = () => {

      setUploading(false);
      
      if (xhr.status === 200 || xhr.status === 201) {
      
        setUploadedPath(`public/${file.name}`);
        console.log("Upload succeeded");
     
        } else {

            console.error("Upload failed", xhr.responseText);
        }
    };

    // upload error
    xhr.onerror = () => {

      setUploading(false);
      console.error("Upload error");

    };


    // cancel uploading
    xhr.onabort = () => {

      setUploading(false);
      setProgress(0);
      console.log("Upload cancelled");

    };

    xhr.send(file);
    
  };


    //   Cancel upload
  const cancelUpload = () => {

    if (xhrRef.current) {
      xhrRef.current.abort();
    }

  };



  return (
    <Container>
      <Wrapper>


      {/* Open or close the window */}
      <Close onClick={()=>setOpen(false)} >X</Close>

      {/* Upload video */}
      <Title>Upload a new video</Title>

      <Label htmlFor="">Video :</Label>

      <input type="file" onChange={(e)=>setVideoFile(e.target.files[0])} disabled={uploading} />
    
      {uploading && (
        <>
          <progress value={progress} max="100" />
          <button onClick={cancelUpload}>Cancel Upload</button>
        </>
      )}
    
      {uploadedPath && <p style={{color:"green"}}>File uploaded to: {uploadedPath}</p>}

            
            {/* Title */}
            <InputText type="text" placeholder="Title" onChange={(e)=>setTitle(e.target.value)}  />
            
            {/* Description */}
            <InputTextarea  placeholder="Description"  rows={8}  onChange={(e)=>setDesc(e.target.value)}   />
            
            {/* Tags of video */}
            <InputText2 type="text" placeholder="Saparate the tags with commas" onChange={(e) => handleTags(e)} />

            {/* Upload image */}
            <Label htmlFor="">Thumbnail image :</Label>
            <InputFile2 type="file" accept="image/*"  onChange={(e) => setImageFile(e.target.files[0])} />

            {/* button to upload */}
            <Button  onClick={()=>uploadFile(videoFile)} disabled={loading}>
                {loading ? "Uploading..." : "Upload Video"}
            </Button>

      </Wrapper>
    </Container>
  );
}

export default UploadN;
