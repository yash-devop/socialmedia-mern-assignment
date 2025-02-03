import { Route, BrowserRouter as Router , Routes } from "react-router-dom"
import Profile from "./components/Profile"
import NotFoundPage from "./components/NotFound"
import { AuthProvider } from "./context/AuthContext"
import HomePage from "./pages/Home"
import AuthProtected from "./components/AuthProtected"
import LandingPage from "./pages/LandingPage"
import RootLayout from "./layout"
import { ApiProvider } from "./context/ApiContext"

function App() {

  return (
    <Router>
      <AuthProvider>
        <ApiProvider>
          <Routes>
            <Route path="/"  element={<LandingPage />} />
            <Route path="/" element={<RootLayout />}>
              <Route path="home" element={<AuthProtected><HomePage /></AuthProtected>}/>
              <Route path=":name" element={<AuthProtected><Profile /></AuthProtected>} />
            </Route>
            <Route path="*" element={<NotFoundPage/>}/>
          </Routes>
        </ApiProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
