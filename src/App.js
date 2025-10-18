import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/home/Home";
import Bank from "./pages/bank/Bank";
import LogIn from "./pages/login/LogIn";
import SignUp from "./pages/signup/SignUp";
import FindId from "./pages/findid/FindId";
import MyPage from "./pages/mypage/MyPage";
import PasswordReset from "./pages/passwordreset/PasswordReset";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/passwordreset" element={<PasswordReset />} />
        <Route path="/mypage" element={<MyPage />} />
      </Route>
    </Routes>
  );
}

export default App;
