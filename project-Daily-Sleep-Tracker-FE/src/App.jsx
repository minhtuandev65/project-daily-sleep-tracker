// redux store
import { Provider } from "react-redux";
import { store } from "./Redux/configStore";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import Loading from "./Components/Loading/Loading";
// Pages
import LoginTemplate from "./Templates/LoginTemplate/LoginTemplate";
import LoginPage from "./Pages/LoginPage/LoginPage";
import SplashScreenTeamplate from "./Templates/SplashScreenTemplate/SplashScreenTemplate";
import SplashScreenPage from "./Pages/SplashScreenPage/SplashScreenPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import ResetYourPassword from "./Components/ResetYourPassword/ResetYourPassword";
import HomeTemplate from "./Templates/HomeTemplate/HomeTemplate";
import HomePageUser from "./Pages/UsersPages/Home/HomePage";
import AccountVerification from "./Components/VerifyEmail/AccountVerification";
function AppEffects() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timer = setTimeout(() => {}, 1000);
    return () => clearTimeout(timer);
  }, [location, navigate]);
  return null;
}
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppEffects />
        <Loading />
        <Routes>
          <Route path="/login" element={<LoginTemplate />}>
            <Route index element={<LoginPage />} />
          </Route>
          <Route path="/" element={<SplashScreenTeamplate />}>
            <Route index element={<SplashScreenPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route path="/account" element={<SplashScreenTeamplate />}>
            <Route path="forgotPassword" element={<ForgotPassword />} />
            <Route path="resetPassword" element={<ResetYourPassword />} />
            <Route path="verification" element={<AccountVerification />} />
          </Route>
          <Route path="/home" element={<HomeTemplate />}>
            <Route index element={<HomePageUser />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
