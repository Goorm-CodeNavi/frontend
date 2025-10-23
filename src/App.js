import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/home/Home";
import Bank from "./pages/bank/Bank";
import LogIn from "./pages/login/LogIn";
import SignUp from "./pages/signup/SignUp";
import FindId from "./pages/findid/FindId";
import MyPage from "./pages/mypage/MyPage";
import StudyRecord from "./pages/mypage/sections/StudyRecord";
import EditInfo from "./pages/mypage/sections/EditInfo";
import GptHelp from "./pages/mypage/sections/GptHelp";
import Solve from "./pages/solve/Solve";
import MyRecordDetail from "./pages/mypage/MyRecordDetail";
import ResetPassword from "./pages/resetpassword/ResetPassword";

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
        <Route path="/passwordreset" element={<ResetPassword />} />
        <Route path="/mypage" element={<MyPage />}>
          <Route index element={<Navigate to="study" replace />} />
          <Route path="study" element={<StudyRecord />} />
          <Route path="study/:solutionId" element={<MyRecordDetail />} />
          <Route path="edit" element={<EditInfo />} />
          <Route path="gpt" element={<GptHelp />} />
        </Route>
        <Route path="/problems/:problemNumber" element={<Solve />} />
      </Route>
    </Routes>
  );
}

export default App;