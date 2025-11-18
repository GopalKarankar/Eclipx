import React, { useEffect } from "react";
import styled from "styled-components";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import {format} from 'timeago.js';
import { saved, subscription } from "../redux/userSlice";
import ShareButton from "../components/ShareButton";

const Container = styled.div`
  display: flex;
  gap: 24px;
  z-index: 0;
`;

const Content = styled.div`
  flex: 5;
  z-index: 0;
`;
const VideoWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 0;
  `;

const VideoFrame = styled.video`
  max-height: 700px;
  width: 100%;
  object-fit:cover;
    z-index: 0;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
      z-index: 0;
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

      @media(max-width:500px){
        flex-direction: column;
      }
  
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
      z-index: 0;


      @media(max-width:500px){
          width: 100%;
      }

`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-around;
  color: ${({ theme }) => theme.text};
    z-index: 0;

    
      @media(max-width:500px){
        padding-top: 10px;
          width: 100%;
      }

`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;


const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

// const Description = styled.p`
//   font-size: 14px;
// `;

const Subscribe = styled.button`
  background-color: #2c7b7d;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 5px 10px;
  cursor: pointer;
`;


const Video = () => {

  const currentUser = useSelector(state=> state?.user?.currentUser);
  const currentVideo = useSelector(state=> state?.video?.currentVideo);
  const isLoggedIn = useSelector(state=> state?.user?.isLoggedIn);  

  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  const [channel, setChannel] = useState({});

  const [isViewCounted, setIsViewCounted] = useState(false);


          // Increse view count of video
        const incrViewCount = async () => {

            await axios.put(`eclipx-phi.vercel.app/api/videos/view/${currentVideo?._id}`,
              {

              },
              {
                withCredentials:true,
              }
            );

        }
        


  // Run on page visit , or any value change
  useEffect(()=>{

    // Get video by id
    const fetchData = async () =>{

      try{

        const videoRes = await axios.get(`eclipx-phi.vercel.app/api/videos/find/${path}`);
        const channelRes = await axios.get(`eclipx-phi.vercel.app/api/users/find/${videoRes.data.userId}`);

        dispatch(fetchSuccess(videoRes.data));

        // setVideo(videoRes.data);
        setChannel(channelRes.data);

      }catch(error){
          console.log(error);
      }

    }

    fetchData();

  }, [path, dispatch , currentUser, currentVideo]);




  // for liking
  const handleLike = async () => {
    try {
      await axios.put(
        `eclipx-phi.vercel.app/api/users/like/${currentVideo?._id}`,
        {},
        { withCredentials: true } 
      );

      dispatch(like(currentUser?._id));
    
    } catch (error) {
      console.log(error);
    }
  }



  // For disliking
  const handleDislike = async () => {
    
    try {

      await axios.put(
        `eclipx-phi.vercel.app/api/users/dislike/${currentVideo._id}`,
        {},
        { withCredentials: true } 
      );

      dispatch(dislike(currentUser?._id));

    } catch (error) {
      console.log(error);
    }

  }



  // For subscribing, unsubsribing
  const handleSub = async () =>{

    try {

            if (currentUser.subscribedUsers.includes(channel._id)){

                await axios.put(
                  `eclipx-phi.vercel.app/api/users/unsub/${channel._id}`,
                    {},
                    { withCredentials: true } 
                  );

                  dispatch(subscription(channel._id));

            }else{

                  await axios.put(
                  `eclipx-phi.vercel.app/api/users/sub/${channel._id}`,
                    {},
                    { withCredentials: true } 
                  );

                  dispatch(subscription(channel._id));

            }


    } catch (error) {
      console.log(error);
    }
    
  }



  // For saving, unsaving video
  const handleSave = async () => {
      
      try {

        if (currentUser.savedVideos.includes(currentVideo._id)) {

            const res = await axios.put(`eclipx-phi.vercel.app/api/users/unsavevideo/${currentVideo._id}`);
            
            dispatch(saved(currentVideo._id));

            // console.log(res);
          
        } else {

            const res = await axios.put(`eclipx-phi.vercel.app/api/users/savevideo/${currentVideo._id}`);
            
            dispatch(saved(currentVideo._id));

            // console.log(res);
          
        }
        
      } catch (error) {
        console.log(error);
      }

  }

  console.log(currentVideo.videoUrl);

  return (
    <Container>
          <Content>
            
            <VideoWrapper >
                <VideoFrame src={currentVideo.videoUrl}  controls  
                    onTimeUpdate={(e) => {

                        const currentTime = e.target.currentTime;
                        
                        // view count increase when video is watched beyond 1 second 
                          if (currentTime > 1 && !isViewCounted) {
                              incrViewCount();
                              setIsViewCounted(true);
                          }

                      }}              
                />
            </VideoWrapper>
            
            <Title>{currentVideo.title}</Title>

            <Details>

              <Info>{currentVideo.views} views • {format(currentVideo.createdAt)}</Info>


              <Buttons>

                {isLoggedIn && 
                    <>
                      <Button onClick={handleLike}>
                          {currentVideo.likes?.includes(currentUser?._id) ? <i className="fa-regular fa-thumbs-up "></i> :  <i className="fa-regular fa-thumbs-up  "></i> } {currentVideo.likes?.length}
                      </Button>
                    
                      <Button onClick={handleDislike}>
                          {currentVideo.dislikes?.includes(currentUser?._id) ? <i className="fa-regular fa-thumbs-down  "></i> : <i className="fa-regular fa-thumbs-down"></i>  } {currentVideo.dislikes?.length}
                      </Button>
                    </>            
                }
              
                  <ShareButton url={`${currentVideo?._id}`} />
              
              {isLoggedIn &&
                <Button onClick={handleSave} >
                  <AddTaskOutlinedIcon />{currentVideo.isSavedByUsers.includes(currentUser?._id) ? "Unsave" : "Save"}
                </Button>          
              }
              
              </Buttons> 
            
            </Details>
            
            <Hr />
            
            <Channel>
              <ChannelInfo>
                <Image src={channel.img} />
                <ChannelDetail>
                  <ChannelName>{channel.name}</ChannelName>
                  <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
                  {/* <Description>
                        {currentVideo.desc}
                  </Description> */}
                </ChannelDetail>
              </ChannelInfo>

                    { isLoggedIn &&
                      <Subscribe onClick={handleSub} >{currentUser?.subscribedUsers?.includes(channel?._id) ? "SUBSCRIBED" : "SUBSCRIBE"}</Subscribe>                
                    }
            
            </Channel>
            
            <Hr />            

            <Comments videoId={currentVideo?._id} isLoggedIn={isLoggedIn} />

      </Content>

    </Container>
  );
};

export default Video;
