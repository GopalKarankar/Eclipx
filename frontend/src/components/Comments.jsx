import React,{useState, useEffect} from "react";
import styled from "styled-components";
import Comment from "./Comment";
import axios from "axios";
import { useSelector } from "react-redux";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Comments = ({videoId, isLoggedIn}) => {

    const currentUser = useSelector(state=> state?.user?.currentUser);

    const [comments, setComments] = useState([]);
    const [inputComment, setInputComment] = useState("");
  
    const [openCommentId, setOpenCommentId] = useState(null);
      
    

    
        const addComment = async () => {

          setInputComment(inputComment);

            try {

                 await axios.post(`${process.env.BACKEND_URI}/api/comments/`,{
              
                  desc:inputComment,
                  videoId,
              
                },{

                  withCredentials:true
                
                });

               setInputComment(""); 


            } catch (error) {

              console.log(error);

            }
        
        }

        



        useEffect(() => {

          const fetchComments = async () => {
              
              try {
            
                const res = await axios.get(`${process.env.BACKEND_URI}/api/comments/${videoId}`);
            
                // console.log(res.data);
                
                setComments(res.data);

              } catch (error) {
            
                console.log(error); 
            
              }

          }


          fetchComments();

        }, [videoId, comments]);



  return (
    <Container>

      {isLoggedIn && <NewComment>

        <Avatar src={currentUser?.img} />

        {/* Comment input */}
        <Input placeholder="Add a comment..." value={inputComment} onChange={(e)=>{setInputComment(e.target.value)}}  required />

        {/* Add comment button */}
        {inputComment.length > 0 &&

            <i className="fa-solid fa-circle-play text-white fa-2x"  onClick={addComment}></i>

        }

      
      </NewComment>
      
      }

      {comments.map((val)=>[
           <Comment key={val._id} comment={val} videoId={videoId}   openCommentId={openCommentId} setOpenCommentId={setOpenCommentId} /> 
      ])}

    </Container>
  );
};

export default Comments;
