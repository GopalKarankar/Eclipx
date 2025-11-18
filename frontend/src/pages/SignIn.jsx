import React,{useEffect, useState} from "react";
import styled from "styled-components";
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import {auth, provider} from '../firebase.js';
import {signInWithPopup} from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import GoogleLogo from './../img/GoogleLogo.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

// const Input = styled.input`
//   border: 1px solid ${({ theme }) => theme.soft};
//   border-radius: 3px;
//   padding: 10px;
//   background-color: transparent;
//   width: 100%;
//   color: ${({ theme }) => theme.text};
// `;

const Button = styled.button`
  position: relative;
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const Glogo = styled.img`
  width: 40px;
  height: 40px;
`;

const SignIn = () => {

  const [info, setInfo] = useState({
    username:"",
    email:"",
    password:"",
  });  
  
  axios.defaults.withCredentials = true;

  const currentUser = useSelector(state => state?.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // console.log(currentUser.isLoggedIn);

  useEffect(()=>{
      if (currentUser.isLoggedIn) {
          navigate("/");
        }
    }
  ,[currentUser, navigate]);



  const setUser = (e) =>{
      let {name, value} = e.target;

      setInfo({
        ...info,
        [name]:value,
      });
  }

  // console.log(info);

  const handleLogin = async (e) => {
    e.preventDefault();

      dispatch(loginStart());

      try{

          const res = await axios.post(`eclipx-phi.vercel.app/api/auth/signin/`, {
              name: info.username,
              password: info.password
            });

            dispatch(loginSuccess(res.data.excludePasswordInfo));

            console.log("Sign in : ",res.data.excludePasswordInfo);

            navigate("/");

        }catch(error){
          dispatch(loginFailure());
          console.log(error);
      }

  }

  const signInWithGoogle = async () => {
  
    dispatch(loginStart());

    signInWithPopup(auth, provider).then((result)=>{

       axios.post(`eclipx-phi.vercel.app/api/auth/google/`,{
      
        name:result.user.displayName,
        email:result.user.email,
        img:result.user.photoURL,
      
      },
        {
            withCredentials:true,          
        }
    ).then((res)=>{
      
        console.log("google auth : ",res.data);

        dispatch(loginSuccess(res.data));
        
        console.log("google log in info : ", res.data );
      
      })

      navigate("/");
    
    }).catch((error)=>{
    
      console.log(error);
      dispatch(loginFailure());

    });
  
  }

  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>

        <SubTitle>Sign in to continue to Eclipx</SubTitle>
        
        {/* <Input placeholder="username" name="username" type="text" value={info.name} onChange={ (e)=>{setUser(e)}  } />
        <Input type="password" placeholder="password" name="password"  value={info.password} onChange={(e)=>{setUser(e)}} autoComplete="off"  />
        <Button onClick={handleLogin} >Sign in</Button>
        
        <Title>or</Title> */}
        <Button onClick={signInWithGoogle}> <Glogo src={GoogleLogo} alt="" />  Sign in with google</Button>

      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
