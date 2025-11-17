import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import  {Upload}  from "./Upload";
import axios from "axios";
import Eclipx from './../img/Eclipx.png';
import zIndex from "@mui/material/styles/zIndex";


const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
  z-index: 995;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 70%;
  position: relative;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  /* flex-direction: column; */
`;

const Input = styled.input`
  width: 80%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  outline: none;
`;



const SuggestionBox = styled.div`
  /* box-sizing: border-box; */
  position: absolute;
  top: 40px;
  width: 93%;
  background-color:white;
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 998;
`;

const SuggestionItem = styled.div`
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: silver;
  }

`;




const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};

  @media(max-width:800px){
      display: none;
  }

`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
`;


const Img = styled.img`
  width: 70px;
  height: 70px;
`;

const LogoWrapper  = styled.div`

  display: none;

  @media (max-width:800px){
    box-sizing: border-box;
    display: inline;
  }

`;

const LogoName = styled.div`
  color: white;
  font-size: 30px;

    @media (max-width:800px){
        display: none;
    }

`;

const Togglebtn = styled.button`

    background-color: #2c7b7d;
    color: white;

    @media (min-width:800px){
        display: none;
    }

`;

const Navbar = ({toggleInfo, setToggleInfo, open, setOpen}) => {

  const currentUser = useSelector((state) => state?.user?.currentUser);
  
  
  const [query, setQuery] = useState("");
  
  const [videoSugg, setVideoSugg] = useState([]);
  
  const navigate = useNavigate();

  const handleQuery = async (e) => {
        try {
        
          setQuery(e.target.value);

          const res = await axios.get(`process.env.BACKEND_URI/api/videos/search?q=${query}`);

          setVideoSugg(res.data || []);
        
        } catch (error) {
        
          console.log(error);
        
        }
  };

  const filteredSuggestions = videoSugg.filter((item) =>
    item.title?.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectSuggestion = (item) => {
    setQuery(item.title);
    setVideoSugg([]);
    setQuery("");
    navigate("/", { state: [item] });
  };


  const handleClick = async () => {
      try {
          setQuery("");
          navigate("/", { state: videoSugg });
        
      } catch (error) {
        console.log(error);
      }
  }

  return (
    <>
      <Container>
        <Wrapper>
         
              <LogoWrapper>

                 <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                   <Logo>
                     <Img src={Eclipx} alt="" />
                     <LogoName >Eclipx</LogoName>
                   </Logo>
                 </Link>

              </LogoWrapper>
         

          <Search>
         
                  {/* search textfield */}
                  <Input
                    id="search"
                    value={query}
                    onInput={(e) => handleQuery(e)}
                    placeholder="Search..."
                    required
                  />

              
                  {/* Autosuggestion */}
                  {query && filteredSuggestions.length > 0 && (

                      <SuggestionBox id="suggestions">

                        {filteredSuggestions.map((item, idx) => (
                          <SuggestionItem key={idx} onClick={() => handleSelectSuggestion(item)}>
                            {item.title}
                          </SuggestionItem>
                        ))}
                      
                      </SuggestionBox>
                    
                  )}
                                                    
                  {
                    query.length > "" &&

                            <button className="btn border-0" style={{backgroundColor:"#2c7b7d"}} onClick={()=> handleClick()}>
                              <i className="fa-solid fa-magnifying-glass text-white"></i>
                            </button>
                  }
              
          </Search>

          {currentUser ? (

            <User>
              <i
                className="fa-solid fa-video"
                onClick={() => setOpen(true)}
                style={{ color: "white", cursor: "pointer" }}
              ></i>

              <img
                src={currentUser.img}
                alt=""
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
              
              {currentUser.name}
            </User>
          
          ) : (
          
            <Link to="signin" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          
          )}

          <Togglebtn className="btn ml-5" onClick={()=>{setToggleInfo({
              ...toggleInfo,
              position:(toggleInfo.position === null ? ("fixed") : (null) ),
              left:(toggleInfo.left === null ? (0) : (null) ),
              zIndex:(toggleInfo.zIndex === null ? (1000) : (null) ),
            })}}   >

              { toggleInfo.position === null ? (<i className="fa fa-bars"></i>):(<i className="fa-solid fa-x"></i>)}
          </Togglebtn>

        </Wrapper>
      

      </Container>
      
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
