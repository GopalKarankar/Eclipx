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

    const currentVideo = useSelector(state=> state?.video?.currentVideo);
  
    const currentUser = useSelector(state=> state?.user?.currentUser);

   const [openVideoId, setOpenVideoId] = useState(null);

    const [isLoading, setLoading] = useState(false);

    const [video, setVideo]= useState([]);

    const location = useLocation();

    const videoData = location.state;




  useEffect(() => {
    
    if (videoData) {

      setLoading(true);

      const handleSearch = async () => {

          // setVideo(res.data);
          setVideo(videoData);
        
          setLoading(false);
      }

      handleSearch();

    } else {

      setLoading(true);

      const fetchVideos = async () => {          

          const res = await axios.get(`https://eclipx.onrender.com/api/videos/${type}/`);

          setVideo(res.data);

          setLoading(false);

      }

        fetchVideos();

      
    }

  }, [ location, videoData, currentVideo, currentUser]);


  
  if (isLoading === true) {
    return  <div style={{textAlign: "center"}}>
                <p style={{color:"Green"}}>Loading...</p>
            </div>;    
  }

  if (video.length===0) {
    return  <div style={{textAlign: "center"}}>
                <p style={{color:"red"}}>No videos Found</p>
            </div>;
  }


    return (
      <Container>
          { 
                video.map( (video) => {
                  return  <Card key={video._id} video={video} type={type}  openVideoId={openVideoId} setOpenVideoId={setOpenVideoId} />
                })
          }
      </Container>
  );

  
};

export default Home;
