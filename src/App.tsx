import React, {useEffect, useMemo} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/system/Box'
import Header from '@/components/Header';
import SideBarNav from '@/components/SideBarNav';
import Home from '@/pages/Home';
import { themeFactory } from '@/helpers/theme';
import { ThemeMode } from '@/types';
import { useAppSelector } from '@/hooks';
import Toolbar from '@mui/material/Toolbar';
import Test from '@/pages/Test';
import PageNotFound from './pages/ErrorPages/404';
import MainSpinner from '@/loaders/MainSpinner';
import { CssBaseline } from '@mui/material';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';
import Generators from '@/pages/generators'
import Converters from '@/pages/converters'
import EncodersDecoders from './pages/EncodersDecoders';
import { SnackbarProvider } from 'notistack';

const Viewport = styled('main')({
  flexGrow: 1, 
  // height: '100%',
  display: 'flex',
  flexDirection: 'column'
})

const App: React.FC = () => {

  const themeMode = useAppSelector((state) => state.theme.mode) as ThemeMode
  const theme = useMemo(() => createTheme(themeFactory(themeMode)), [themeMode])
  
  useEffect(() => { // store theme on change
    localStorage.setItem('themeMode', themeMode)
  }, [themeMode])

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      <CssBaseline/>
      <SnackbarProvider maxSnack={3}>

        <Header/>
        
        <Box sx={{display: 'flex'}}>
          <SideBarNav/>
          <Viewport sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh'
          }}>
              <Toolbar/>
              <Box sx={{flexGrow: 1}}>
                <Routes>
                  <Route path='/' element={<Container sx={{height:"100%"}}><Home/></Container>}/>

                  <Route path='/generators/*' element={<Container><Generators/></Container>}/>
                  
                  <Route path='/encode-decode/*' element={<Container sx={{height: '100%'}}><EncodersDecoders/></Container>}/>

                  <Route path='/converters/*' element={<Converters/>}/>

                  <Route path='/test' element={<Test/>}/>

                  <Route path="*" element={<PageNotFound/>}/>
                {/* </Route> */}
                </Routes>
              </Box>
          </Viewport>
        </Box>
        
        <MainSpinner/>
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
