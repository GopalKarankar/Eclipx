import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        height: 500px;
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
        
    const InputTextarea = styled.textarea`
        width: 100%;        
    `    
        

    const Button = styled.button`
            background-color: gray;
            color:white;
    `
    


export const EditComment = ({setOpenEditComment, comment, setOpenCommentId, videoId}) => {

    
    const [loading, setLoading] = useState(false);

    const [desc, setDesc] = useState(comment?.desc || "");

    const navigate = useNavigate();




    // To upload video and image
    const editComment = async () => {
        
        try {
            
            setLoading(true);

            const res = await axios.put(`${process.env.BACKEND_URI}/api/comments/editcomment/${comment._id}`,
                {
                    desc:desc,
                },
                {
                    withCredentials:true,
                }
            );
            
            console.log(res.data);

            setLoading(false);

            setOpenEditComment(false);

            navigate(`/video/${videoId}`);

        } catch (error) {
            console.log(error);
        }

    };

  
  
  return (
    <Container>
        <Wrapper>

            {/* Open or close the window */}
            <Close onClick={()=>{setOpenEditComment(false); setOpenCommentId(null) } } >
                <i className="fa-solid fa-xmark fa-2x"></i>
            </Close>

            {/* Upload video */}
            <Title>Edit Comment</Title>            
            
            {/* Description */}
            <InputTextarea  placeholder="Description"  rows={8}  onChange={(e)=>setDesc(e.target.value)} value={desc}    />
            

            {/* button to upload */}
            { 
                <Button onClick={editComment} >
                    {loading ? "Submitting..." : "Submit"}
                </Button>                        
             }


        </Wrapper>
    </Container>
  );

}
