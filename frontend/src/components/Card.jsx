import React,{useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {format} from 'timeago.js';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import { saved } from "../redux/userSlice";
import ShareButton from "./ShareButton";
import { Edit } from "./Edit";


const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "300px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;

const Button = styled.div`
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #999;
  flex: 1;
`;

const Details = styled.div`
  position: relative;
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
  z-index: 0;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  z-index: 0;
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  z-index: 0;
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: white;
  margin: 9px 0px;
  z-index: 0;
`;

const Info = styled.div`
  font-size: 14px;
  color: white;
`;

const Ellipse = styled.i`
    color:White; 
    position:absolute;
    right:-10px; 

    &:hover {
          color: white;
    }
`


const Card = ({ type, video, openVideoId, setOpenVideoId }) => {


  axios.defaults.withCredentials = true;

  const [channel, setChannel] = useState({});

  const [openEdit, setOpenEdit] = useState(false);

    const currentUser = useSelector(state=> state?.user?.currentUser);


    // const currentVideo = useSelector(state=> state?.video?.currentVideo);
    
    const isLoggedIn = useSelector(state=> state?.user?.isLoggedIn);
    
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const open = openVideoId === video?._id;


    useEffect(() => {
    
        const fetchChannel = async () => {
          
          const res = await axios.get(`${process.env.BACKEND_URI}/api/users/find/${video.userId}`);

          setChannel(res?.data);

        }
        
        fetchChannel();

    }, [type, dispatch, video.userId, currentUser]);

    

  
    // save , unsave video
    const handleSave = async () => {
        
        try {
  
          // Unsave video
          if (currentUser.savedVideos.includes(video._id)) {
  
              const res = await axios.put(`${process.env.BACKEND_URI}/api/users/unsavevideo/${video._id}`);
              
              dispatch(saved(video._id));

              setOpenVideoId(null);
            
          // Save video
          } else {
  
              const res = await axios.put(`${process.env.BACKEND_URI}/api/users/savevideo/${video._id}`);
              
              dispatch(saved(video._id));

              setOpenVideoId(null);
              
          }
          
        } catch (error) {

          console.log(error);

        }
  
    }

    // Delete video
    const deleteVideo = async () => {
      
      try {

        const confirmDelete = window.confirm("Are you sure you want to delete this ?");
        
        if(confirmDelete){

            const res = await axios.delete(`${process.env.BACKEND_URI}/api/videos/delete/${video._id}`);

            console.log(res.data);

            setOpenVideoId(null);
            
        }

        navigate("/myvideos");

      } catch (error) {
        console.log(error);
      }

    }
  

  return (
  <>
      <Container type={type}>

        <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }} >

            <Image
              type={type}
              src={video.imageUrl}
            />

        </Link>

        <Details type={type}>

              <ChannelImage
                type={type}
                src={channel.img}
              />
              
              <Texts>
                <Title>{video.title}</Title>
                <ChannelName>{channel.name}</ChannelName>
                <Info>{video.views} views • {format(video.createdAt)}</Info>
              </Texts>



              {/* Ellipse option button */}
              <Ellipse className="fa-solid fa-ellipsis-vertical fa-2x"  onClick={()=>{setOpenVideoId(open ? null : video._id)}}  ></Ellipse>


              {/* Save, share, delete, edit container */} 
              {open && 
                  <div style={{position:"absolute",  right:"30px", backgroundColor:"black" , width:"100px", height:"auto", paddingLeft:"10px",  paddingRight:"10px", boxShadow:"0px 0px 10px black", borderRadius:"10px"}} >                          

                        {/* Delete button */}
                        {video?.userId === currentUser?._id &&                        
                          <Button onClick={deleteVideo} >
                            <i className="fa-solid fa-trash ml-1 mr-1"></i> Delete
                          </Button>
                        }


                        {/* Edit button */}
                        {video?.userId === currentUser?._id &&                        
                          <Button  onClick={()=>{ setOpenEdit(true); //setOpen(!open)
                          }} >
                            <i className="fa-solid fa-pen-to-square ml-1 mr-1"></i> Edit
                          </Button>
                        }


                        {/* Save, unsave button */}
                        {isLoggedIn &&
                          <Button onClick={handleSave} >
                            <AddTaskOutlinedIcon />{currentUser?.savedVideos?.includes(video?._id) ? "Unsave" : "Save"}
                          </Button>          
                        }

                        {/* Share button */}
                        <ShareButton url={`/video/${video._id}`}/>



                  </div>
              }

        </Details>

      </Container>
      
       
       {openEdit && <Edit setOpenVideoId={setOpenVideoId} setOpenEdit={setOpenEdit} video={video}  />}       

      </>
  );
};

export default Card;
