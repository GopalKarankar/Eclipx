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
import SmallLoader from "../components/SmallLoader";

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

  const [video, setVideo] = useState({});

  const [isViewCounted, setIsViewCounted] = useState(false);

  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);

  const [LikeLoading, setLikeLoading] = useState(false);

  const [DislikeLoading, setDislikeLoading] = useState(false);




  // Run on page visit , or any value change
  useEffect(()=>{

    // Get video by id
    const fetchData = async () =>{

      try{

        const videoRes = await axios.get(`https://eclipx.onrender.com/api/videos/find/${path}`);
        // const channelRes = await axios.get(`https://eclipx.onrender.com/api/users/find/${videoRes.data.userId}`);

        dispatch(fetchSuccess(videoRes.data));

        setVideo(videoRes.data);
        // setChannel(channelRes.data);

      }catch(error){
          console.log(error);
      }

    }

    fetchData();

  }, [path, dispatch, currentVideo]);


  // Run on page visit , or any value change
  useEffect(()=>{

    // Get video by id
    const fetchData = async () =>{

      try{
        
        const channelRes = await axios.get(`https://eclipx.onrender.com/api/users/find/${video.userId}`);

        setChannel(channelRes.data);

      }catch(error){
          console.log(error);
      }

    }

    fetchData();

  }, [video.userId, dispatch, currentUser]);


      // Increse view count of video
    const incrViewCount = async () => {

        await axios.put(`https://eclipx.onrender.com/api/videos/view/${video?._id}`,
          {

          },
          {
            withCredentials:true,
          }
        );

    }
        


  // for liking
  const handleLike = async () => {
    try {

            setLikeLoading(true);

      await axios.put(
        `https://eclipx.onrender.com/api/users/like/${video?._id}`,
        {},
        { withCredentials: true } 
      );

          dispatch(like(currentUser?._id));
    
            setLikeLoading(false);


    } catch (error) {
      console.log(error);
    }
  }



  // For disliking
  const handleDislike = async () => {
    
    try {

      setDislikeLoading(true);

      await axios.put(
        `https://eclipx.onrender.com/api/users/dislike/${video._id}`,
        {},
        { withCredentials: true } 
      );

      dispatch(dislike(currentUser?._id));

      setDislikeLoading(false);


    } catch (error) {
      console.log(error);
    }

  }



  // For subscribing, unsubsribing
  const handleSub = async () =>{

    try {

            if (currentUser.subscribedUsers.includes(channel._id)){

                setSubscribeLoading(true);

                await axios.put(
                  `https://eclipx.onrender.com/api/users/unsub/${channel._id}`,
                    {},
                    { withCredentials: true } 
                  );

                  dispatch(subscription(channel._id));

                  setSubscribeLoading(false);

            }else{

              
                  setSubscribeLoading(true);

                  await axios.put(
                  `https://eclipx.onrender.com/api/users/sub/${channel._id}`,
                    {},
                    { withCredentials: true } 
                  );

                  dispatch(subscription(channel._id));

                  setSubscribeLoading(false);

            }


    } catch (error) {
      console.log(error);
    }
    
  }



  // For saving, unsaving video
  const handleSave = async () => {
      
      try {

        if (currentUser.savedVideos.includes(video._id)) {

            setSaveLoading(true);

            await axios.put(`https://eclipx.onrender.com/api/users/unsavevideo/${video._id}`);
            
            dispatch(saved(video._id));

            setSaveLoading(false);

          
        } else {

            setSaveLoading(true);

            await axios.put(`https://eclipx.onrender.com/api/users/savevideo/${video._id}`);
            
            dispatch(saved(video._id));

            setSaveLoading(false);
          
        }
        
      } catch (error) {
        console.log(error);
      }

  }

  if (!video) {
    return <div style={{textAlign: "center", color: "red"}}>Loading video...</div>;
  }

  return (
    <Container>
          <Content>
            
            <VideoWrapper >
                <VideoFrame src={video?.videoUrl}  controls  
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
            
            <Title>{video?.title}</Title>

            <Details>

              <Info>{video?.views} views • {format(video?.createdAt)}</Info>


              <Buttons>

                {isLoggedIn && currentUser &&
                    <>
                      <Button onClick={handleLike}>
                          { LikeLoading ? "Liking..." : (video?.likes?.includes(currentUser?._id) ? <i className="fa-regular fa-thumbs-up "></i> :  <i className="fa-regular fa-thumbs-up  "></i> )} {video?.likes?.length}
                      </Button>
                    
                      <Button onClick={handleDislike}>
                          { DislikeLoading ? "Disliking..." : (video?.dislikes?.includes(currentUser?._id) ? <i className="fa-regular fa-thumbs-down  "></i> : <i className="fa-regular fa-thumbs-down"></i>)  } {video?.dislikes?.length}
                      </Button>
                    </>            
                }
              
                  <ShareButton url={`${video?._id}`} />
              
              {isLoggedIn && currentUser &&
                <Button onClick={handleSave} >
                  <AddTaskOutlinedIcon />{saveLoading ? "Saving..." : (video?.isSavedByUsers?.includes(currentUser?._id) ? "Unsave" : "Save")}
                </Button>          
              }
              
              </Buttons> 
            
            </Details>
            
            <Hr />
            
            <Channel>
              <ChannelInfo>
                <Image src={channel.img} />
                <ChannelDetail>
                  <ChannelName>{channel?.name}</ChannelName>
                  <ChannelCounter>{channel?.subscribers} subscribers</ChannelCounter>
                  {/* <Description>
                        {video.desc}
                  </Description> */}
                </ChannelDetail>
              </ChannelInfo>

                    { isLoggedIn && currentUser &&
                      <Subscribe onClick={handleSub} >{ subscribeLoading ? (<SmallLoader />) : (currentUser?.subscribedUsers?.includes(channel?._id) ? "SUBSCRIBED" : "SUBSCRIBE")}</Subscribe>                
                    }
            
            </Channel>
            
            <Hr />            

            <Comments videoId={video?._id} isLoggedIn={isLoggedIn} />

      </Content>

    </Container>
  );
};

export default Video;
