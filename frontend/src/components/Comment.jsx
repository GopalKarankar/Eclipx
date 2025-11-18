import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { EditComment } from "./EditComment";


const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text}
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Ellipse = styled.i`
    color:silver; 
    position:absolute;
    right:30px; 

    &:hover {
          color: white;
    }
`


const Button = styled.div`
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;


const Comment = ({comment, setOpenCommentId, openCommentId, videoId}) => {


    const currentUser = useSelector(state=> state?.user?.currentUser);

    const [channel, setChannel] = useState({});

    const [openEditComment, setOpenEditComment] = useState(false);

    const open = openCommentId === comment?._id;


    useEffect(() => {
      
      const fetchComment = async () => {

        try {
            const res = await axios.get(`https://eclipx.onrender.com//api/users/find/${comment.userId}`);
            
            setChannel(res.data);
          
          } catch (error) {
            console.log(error);  
          }

      }

      fetchComment();

    }, [comment?.userId]);

    


    // Delete video
    const deleteVideo = async () => {
      
      try {

        const confirmDelete = window.confirm("Are you sure you want to delete this ?");
        
        if(confirmDelete){

            const res = await axios.delete(`https://eclipx.onrender.com//api/comments/${comment._id}`);

            console.log(res.data);

            setOpenCommentId(false);

          }

      } catch (error) {
        console.log(error);
      }

    }



  return (
    <Container>

      <Avatar src={channel.img} />
    
      <Details>
    
        <Name>
          {channel.name} <Date>1 day ago</Date>
        </Name>
    
        <Text>
          {comment?.desc}
        </Text>
    
      </Details>

      {/* Ellipse option button */}
      <Ellipse className="fa-solid fa-ellipsis-vertical fa-2x"  onClick={ ()=>{setOpenCommentId(open ? null : comment?._id); }}   ></Ellipse>

                    {/* Save, share, delete, edit container */} 
              {open && 
                  <div style={{position:"absolute", right:"50px" , width:"100px", height:"auto", paddingLeft:"10px",  paddingRight:"10px", boxShadow:"0px 0px 10px black", borderRadius:"10px"}} >                          
                        
                        {/* Delete button */}
                        {comment?.userId === currentUser?._id &&                        
                          <Button onClick={deleteVideo} >
                            <i className="fa-solid fa-trash ml-1 mr-1"></i> Delete
                          </Button>
                        }



                        {/* Edit button */}
                        {comment?.userId === currentUser?._id &&                        
                            <Button  onClick={()=>{ setOpenEditComment(true); 
                                setOpenCommentId(null);
                          }} >
                            <i class="fa-solid fa-pen-to-square ml-1 mr-1"></i> Edit
                          </Button>
                        }

                  </div>
              }

       
       {openEditComment && <EditComment  setOpenCommentId={setOpenCommentId} videoId={videoId} setOpenEditComment={setOpenEditComment} comment={comment}  />}       

    </Container>
  );
};

export default Comment;
