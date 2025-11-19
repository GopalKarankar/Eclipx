import styled from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import Eclipx from './../img/Eclipx.png';
import zIndex from "@mui/material/styles/zIndex";
import { useState } from "react";


const Container = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  position: fixed;
  top: 0;

    @media (max-width:800px) {
        position: fixed;
        left: -100%;
    }

    @media (min-width:800px) {
        position: sticky;
        left: 0;
        z-index: 0;
    }
  
`;

const Wrapper = styled.div`
  /* padding: 18px 26px; */
  padding-left: 15px;
  padding-right: 26px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 25px;
`;


const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }

`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Login = styled.div``;


const User = styled.div`
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
  font-weight: 500;
  margin-left: 15px;
  color: ${({ theme }) => theme.text};

  @media(min-width:800px){
      display: none;
  }

`;

const ItemUpld = styled.div`

  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;

  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }

  @media(min-width:800px){
      display: none;
  }

`;


const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Img = styled.img`
  width: 70px;
  height: 70px;
`;

const LogoName  = styled.span`
font-size: 30px;
`;



const Menu = ({ darkMode, setDarkMode, toggleInfo, setToggleInfo, open, setOpen }) => {


    const dispatch = useDispatch();

    const navigate = useNavigate();
    
    // const [open, setOpen] = useState(false);
  
    const currentUser = useSelector(state => state?.user?.currentUser);

    const isLoggedIn = useSelector(state=> state?.user?.isLoggedIn);
    
    const {position, left, zIndex} = toggleInfo;
 

    return (
    <>

    <Container style={{position:position, left:left, zIndex:zIndex, transition:"1s"}} >
      <Wrapper>


        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <Img src={Eclipx} alt="" />
            <LogoName >Eclipx</LogoName>
          </Logo>
        </Link>
        


          {currentUser && (

            <User>

              <img
                src={currentUser.img}
                alt=""
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
              {currentUser.name}

            </User>

          )}
 
          <Hr />

          {currentUser &&    
              <ItemUpld onClick={() => setOpen(!open)} >
                
                <i  className="fa-solid fa-video ml-1"
                    
                    style={{ color: "white", cursor: "pointer" }}
                  ></i> Upload video

              </ItemUpld>           
            }

        <Link to="/" style={{textDecoration:"none", color: "inherit" }}>
            <Item>
              <HomeIcon />
                  Home
            </Item>
        </Link>


        <Link to="trend" style={{textDecoration:"none", color: "inherit" }}>
            <Item>
                <ExploreOutlinedIcon />
                Explore
            </Item>
        </Link>

        <Link to="subscriptions" style={{textDecoration:"none", color: "inherit" }}>
          <Item>
            <SubscriptionsOutlinedIcon />
            Subscriptions
          </Item>
            <Hr />
        </Link>

        {isLoggedIn && 

          <>

            <Link to="myvideos" style={{textDecoration:"none", color: "inherit" }}>
              <Item>
                    <i className="fa-regular fa-circle-play ml-1"></i>                  
                    My Videos
              </Item>
            </Link>
          
        
            <Link to="saved" style={{textDecoration:"none", color: "inherit" }}>
              <Item>
                  <i className="fa-solid fa-bookmark ml-2 mr-1"></i>
                Saved
              </Item>
            </Link>
          
        </>

        }
        
        <Hr />

        { !currentUser ? (        
          <>
              <Login>
              Sign in to <br /> like videos, comment, <br /> and subscribe.
              <Link to="signin" style={{textDecoration:"none"}}>
                <Button>
                  <AccountCircleOutlinedIcon />
                 SIGN IN
                </Button>
              </Link>
            </Login>
            <Hr />
        </>
        ) : <> <span onClick={()=>{ dispatch(logout()); navigate("/"); }}  ><i className="fa-solid fa-right-from-bracket " ></i> <span style={{cursor:"default"}} >Log out</span> </span> <br /> <br /> </>}
        


      </Wrapper>

            <i class="fa fa-copyright text-white ml-2"></i> Eclipx 
            <br />

           <a href="https://www.linkedin.com/in/gopal-karankar-bb7730377" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-linkedin ml-2"></i> <span style={{color:"white"}} >Gopal Karankar</span>
          </a> 

    </Container>
    </>

  );
};

export default Menu;
