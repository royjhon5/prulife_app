import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme"
import { Outlet } from "react-router-dom";
import TopNav from "../views/dashboard/TopNav";
import { Toaster } from 'react-hot-toast'

const DefaultLayout = () => {
  const [theme, colorMode] = useMode();
  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
              <CssBaseline />
              <Toaster position="bottom-left" reverseOrder={true} />
                <div className="app">
                  <main className="content">
                    <TopNav />
                      <Box>
                        <Outlet />
                      </Box>
                  </main>
                </div>
          </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  )
}

export default DefaultLayout