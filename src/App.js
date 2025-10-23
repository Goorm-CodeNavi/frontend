import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/home/Home";
import Bank from "./pages/bank/Bank";
import LogIn from "./pages/login/LogIn";
import SignUp from "./pages/signup/SignUp";
import FindId from "./pages/findid/FindId";
import MyPage from "./pages/mypage/MyPage";
import PasswordReset from "./pages/passwordreset/PasswordReset";
import StudyRecord from "./pages/mypage/sections/StudyRecord";
// [수정] .jsx 확장자를 명시적으로 추가
import EditInfo from "./pages/mypage/sections/EditInfo.jsx";
import GptHelp from "./pages/mypage/sections/GptHelp";
import Solve from "./pages/solve/Solve";
import MyRecordDetail from "./pages/mypage/MyRecordDetail";

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