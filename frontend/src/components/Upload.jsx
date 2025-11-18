import { useState } from 'react';
import styled from 'styled-components';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {filesize} from 'filesize';
import { useNavigate } from 'react-router-dom';



// Initialize Supabase client
const supabase = createClient(
  "https://qaptekeguowshtiumgnb.supabase.co", //public url
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcHRla2VndW93c2h0aXVtZ25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNTQzMDgsImV4cCI6MjA3NTczMDMwOH0.CZzwUa5CKRD0idV2bUvuzxZcpNH48oc-OFUKx87HxYM"
  //Anon key
);

// Base CDN URL for public bucket
const CDNURL = "https://qaptekeguowshtiumgnb.supabase.co/storage/v1/object/public/video/";



    const Container = styled.div`
        width:100%;
        height:100%;
        position:fixed;
        left:0;
        top:0;
        background-color: #000000a7;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1001;
    `

    const Wrapper = styled.div`
        width: 600px;
        height: 650px;
        background-color: ${ ({theme}) => theme.bgLighter};
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: relative;
    `

    const Close = styled.div`
        color: white;
        left: 20px;
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
    


export const Upload = ({setOpen}) => {

    const [videoFile, setVideoFile] = useState(null);
    const [videoFileSize, setVideoFileSize] = useState(0);
    const [imageFile, setImageFile] = useState(null);

    const [loading, setLoading] = useState(false);

    // Title
    const [title, setTitle] = useState("");

    // Description
    const [desc, setDesc] = useState("");

    // Tags
    const [tags, setTags] = useState([]);


    const navigate = useNavigate();


    // to assign Tags
    const handleTags = (e) => {
        try {

            setTags(e.target.value.split(","));
        
        } catch (error) {
            
            console.log(error);
        
        }
    }


    // To upload video and image
    const uploadFile = async () => {
        
            // returns undefined and exits whole function
            if (!videoFile && !imageFile) return;

            setLoading(true);

            // sets fileVideoName
            const fileVideoName = uuidv4() + ".mp4";

            // sets fileImageName
            const fileImageName = uuidv4() + ".jpg";

            // For video
            const { dataVid, errorVid } = await supabase.storage
            .from('video')
            .upload(fileVideoName, videoFile, {
            
                cacheControl: '3600',
                upsert: false,
            
            } );


            // For image
            const { dataImg, errorImg } = await supabase.storage
            .from('video')
            .upload(fileImageName, imageFile, {
            
                cacheControl: '3600',
                upsert: false,
            
            } );

            const videoPublicUrl = CDNURL + fileVideoName;
            const imagePublicUrl = CDNURL + fileImageName;


            if (errorVid && errorImg) {

                console.error('Error loading video:', errorVid.message);
                alert("Error loading video to Supabase");

                console.error('Error loading image:', errorImg.message);
                alert("Error loading image to Supabase");
            
            } else {

                console.log("Details uploaded successfully.");

                await axios.post(`https://eclipx.onrender.com//api/videos/`,
                    {
                        title:title,
                        desc:desc,
                        tags:tags,
                        videoUrl:videoPublicUrl,
                        imageUrl:imagePublicUrl                    
                    },
                    {
                        withCredentials:true
                    }
                );

                setLoading(false);

                setOpen(false);

                navigate("/myvideos");
            
            }


    };

  
  return (
    <Container>
        <Wrapper>

            {/* Open or close the window */}
            <Close onClick={() => setOpen(false)}>
            <i className="fa-solid fa-xmark fa-2x"></i>
            </Close>


            {/* Upload video */}
            <Title>Upload a new video</Title>

            <Label htmlFor="">Video :</Label>

            {/* Video file */}
            <InputFile type="file" accept="video/*" onChange={(e) => { setVideoFile(e.target.files[0]); setVideoFileSize(e.target.files[0].size)} } />
            
            {/* Selected file size */}
            {videoFileSize > 0 &&
                    <span style={{ color:"green" }} >Selected file size : {filesize(videoFileSize)}</span>
            }

            {/* File size warning */}
            { videoFileSize > 45000000 &&
                    <span style={{ color:"red" }} >Video file size should be less than 45 MB.</span>
            }
            
            {/* Title */}
            <InputText type="text" placeholder="Title" onChange={(e)=>setTitle(e.target.value)}  />
            
            {/* Description */}
            <InputTextarea  placeholder="Description"  rows={8}  onChange={(e)=>setDesc(e.target.value)}   />
            
            {/* Tags of video */}
            <InputText2 type="text" placeholder="Saparate the tags with commas" onChange={(e) => handleTags(e)} />

            {/* Upload image */}
            <Label htmlFor="">Thumbnail image :</Label>
            <InputFile2 type="file" accept="image/*"  onChange={(e) => setImageFile(e.target.files[0])} />


            {/* File size warning */}
            {  videoFileSize < 45000000 && 
                    
                    <Button onClick={uploadFile} disabled={loading}>
                        {loading ? "Uploading..." : "Upload Video"}
                    </Button>
            }


        </Wrapper>
    </Container>
  )

}
