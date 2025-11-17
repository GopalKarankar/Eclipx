import React,{useState, useEffect} from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
`;

const Home = ({type}) => {
  
  
  axios.defaults.withCredentials = true;
  
   const [openVideoId, setOpenVideoId] = useState(null);

  const currentVideo = useSelector(state=> state?.video?.currentVideo);
  
  const currentUser = useSelector(state=> state?.user?.currentUser);
   
  const [video, setVideo]= useState([]);

  const location = useLocation();

  const videoData = location.state;




  useEffect(() => {
    
    if (videoData) {

      const handleSearch = async () => {

          // setVideo(res.data);
          setVideo(videoData);

      }

      handleSearch();

    } else {

      const fetchVideos = async () => {

<<<<<<< HEAD
          const res = await axios.get(`${process.env.BACKEND_URI}/api/videos/${type}/`);
=======
          const res = await axios.get(`${process.env.VITE_BACKEND_URI}/api/videos/${type}/`);
>>>>>>> fa699c2cf901c197cb7d936a50339fb2373749b5

          setVideo(res.data);

      }

        fetchVideos();
      
    }

  }, [ location, videoData, currentVideo, currentUser]);


  
  if (video.length===0) {
    return  <center>
                <p style={{color:"red"}}>No videos Found</p>
            </center>;
  }


    return (
      <Container>
          { 
                video.map( (video) => {
                  return  <Card key={video._id} video={video} type={type}  openVideoId={openVideoId} setOpenVideoId={setOpenVideoId} />
                }
              )
          }
      </Container>
  );

  
};

export default Home;
