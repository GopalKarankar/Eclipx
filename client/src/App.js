import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import { Edit } from "./components/Edit";

const Container = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.bgLighter};
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  padding: 20px 20px;
`;


function App() {

  const [darkMode, setDarkMode] = useState(true);
  const [toggleInfo, setToggleInfo] = useState({

    position:null,

    left:null,

    zIndex:null,

  });

  const [open, setOpen] = useState(false);


  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
    
      <Container>

        <BrowserRouter>
          
          <Menu open={open} setOpen={setOpen} darkMode={darkMode} setDarkMode={setDarkMode} toggleInfo={toggleInfo} setToggleInfo={setToggleInfo} />

          <Main>

            <Navbar open={open} setOpen={setOpen}  toggleInfo={toggleInfo} setToggleInfo={setToggleInfo}  />
          
            <Wrapper>



              <Routes>

                <Route path="/">

                      <Route index element={<Home type="random" />} />

                      <Route path="trend" element={<Home type="trend" />} />

                      <Route path="subscriptions" element={<Home type="sub" />} />

                      <Route path="saved" element={<Home type="saved" />} />

                      <Route path="myvideos" element={<Home type="myvideos" />} />

                      <Route path="signin" element={<SignIn />} />

                      <Route path="edit" element={<Edit />} />

                      <Route path="video">
                        <Route path=":id" element={<Video />} />
                      </Route>

                </Route>

              </Routes>

            </Wrapper>
          </Main>

        </BrowserRouter>

      </Container>
    </ThemeProvider>
  );
}

export default App;
