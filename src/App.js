import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/home/Home";
import Bank from "./pages/bank/Bank";
import SignIn from "./pages/signin/SignIn";
import MyPage from "./pages/mypage/MyPage";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/mypage" element={<MyPage />} />
      </Route>
    </Routes>
  );
}

export default App;
