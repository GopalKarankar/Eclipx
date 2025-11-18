import { useState, useRef } from 'react';
import styled from 'styled-components';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {filesize} from "filesize";
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
        top: 0;
        background-color: #000000a7;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 998;
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
    


export const Edit = ({setOpenVideoId,setOpenEdit , ...video}) => {


    const [videoFile, setVideoFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    // const [videoPublicUrl, setVideoPublicUrl] = useState(video.video.videoUrl);
    // const [imagePublicUrl, setImagePublicUrl] = useState(video.video.imageUrl);

    const [videoFileSize, setVideoFileSize] = useState(0);
    
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState(video?.video?.title || "");

    const [desc, setDesc] = useState(video?.video?.desc || "");

    const [tags, setTags] = useState(video?.video?.tags.join(",") || []);

    // for canceling upload
    const uploadAbortRef = useRef(null);

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
            // if (!videoFile && !imageFile) return;

            setLoading(true);

            // sets fileVideoName
            const fileVideoName = uuidv4() + ".mp4";

            // sets fileImageName
            const fileImageName = uuidv4() + ".jpg";
            

            // For video
            if (videoFile) {


                // upload
                const { dataVid, errorVid } = await supabase.storage
                .from('video')
                .upload(fileVideoName, videoFile, {
                
                    cacheControl: '3600',
                    upsert: false,
                
                } );
             
                
            }


            // For image
            if (imageFile) {                        
                
                // upload
                const { dataImg, errorImg } = await supabase.storage
                .from('video')
                .upload(fileImageName, imageFile, {
                
                    cacheControl: '3600',
                    upsert: false,
                
                } );

                console.log(dataImg);
                console.log(errorImg);

            }
            
                                                        // new                   // old
           const videoPublicUrl = videoFile ? (CDNURL + fileVideoName)  : (video.video.videoUrl) ; 

            const  imagePublicUrl = imageFile ? (CDNURL + fileImageName)  : (video.video.imageUrl) ; 


            // const videoPublicUrl = CDNURL + fileVideoName;

            // const imagePublicUrl = CDNURL + fileImageName;



                console.log("Details uploaded successfully.");

                await axios.put(`eclipx-phi.vercel.app/api/videos/updatevideo/${video?.video?._id}`,
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

                alert("video updated successfully.");

                setVideoFile("");
                setImageFile("");

                setOpenVideoId(null);
                setOpenEdit(false);

                navigate("/myvideos");

    };

  
  const handleCancel = () => {

    // Mark abort state
    if (uploadAbortRef.current) {
      uploadAbortRef.current.aborted = true;
    }
    setLoading(false);

  };

  
  return (
    <Container>
        <Wrapper>

            {/* Open or close the window */}
            <Close onClick={()=>{setOpenVideoId(null); setOpenEdit(false) } } >
                <i className="fa-solid fa-xmark fa-2x"></i>
            </Close>

            {/* Upload video */}
            <Title>Edit video</Title>

            <Label htmlFor="">Video :</Label>

            {/* Video file */}
            <InputFile type="file" accept="video/*" onChange={(e) =>{ setVideoFile(e.target.files[0]); setVideoFileSize(e.target.files[0].size)  }} />
          
            
            {/* Selected file size */}
            {videoFileSize > 0 &&
                    <span style={{ color:"green" }} >Selected file size : {filesize(videoFileSize)}</span>
            }

            {/* File size warning */}
            { videoFileSize > 45000000 &&
                    <span style={{ color:"red" }} >Video file size should be less than 45 MB.</span>
            }

            {/* Title */}
            <InputText type="text" placeholder="Title" onChange={(e)=>setTitle(e.target.value)}  value={title}  />
            
            {/* Description */}
            <InputTextarea  placeholder="Description"  rows={8}  onChange={(e)=>setDesc(e.target.value)} value={desc}    />
            
            {/* Tags of video */}
            <InputText2 type="text" placeholder="Saparate the tags with commas" onChange={(e) => handleTags(e)} value={tags} />

            {/* Upload image */}
            <Label htmlFor="">Thumbnail image :</Label>
            <InputFile2 type="file" accept="image/*"  onChange={(e) => setImageFile(e.target.files[0])} />

            {/* button to upload */}
            { videoFileSize < 45000000 &&
                <Button onClick={uploadFile} >
                    {loading ? "Uploading..." : "Update"}
                </Button>                        
             }


             {loading &&
                    <Button onClick={handleCancel} >
                            Cancel Upload
                    </Button>             
             }


        </Wrapper>
    </Container>
  )

}
