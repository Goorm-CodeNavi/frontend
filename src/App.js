import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/home/Home";
import Bank from "./pages/bank/Bank";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import FindId from "./pages/findid/FindId";
import FindPassword from "./pages/findpassword/FindPassword";
import MyPage from "./pages/mypage/MyPage";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/findid" element={<FindId />} />
        <Route path="/findpassword" element={<FindPassword />} />
        <Route path="/mypage" element={<MyPage />} />
      </Route>
    </Routes>
  );
}

export default App;
