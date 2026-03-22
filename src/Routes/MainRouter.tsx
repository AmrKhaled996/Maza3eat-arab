import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../Pages/Auth/LoginPage";
import HomePage from "../Pages/Home/HomePage";
import ProfileQandAPage from "../Pages/Profile/ProfileQandAPage";
import PostPage from "../Pages/Community/PostPage";
import CreatePostPage from "../Pages/Community/CreatePostPage";
import QandAMainPage from "../Pages/Q&A/QandAMainPage";
import QandAPage from "../Pages/Q&A/QandAPage";
import QndACreatePage from "../Pages/Q&A/QandACreatePage";
import CommunityMainPage from "../Pages/Community/CommunityMainPage";
import ProfilePostPage from "../Pages/Profile/ProfilePostPage";


export default function MainRouter(): React.ReactElement<any> {
  return (
    <BrowserRouter>
      <Routes>

          <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/community" element={<CommunityMainPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/q&a" element={<QandAMainPage />} />
        <Route path="/q&a/:id" element={<QandAPage />} />
        <Route path="/create-q&a" element={<QndACreatePage />} />

        <Route path="/profile/:id/posts" element={<ProfilePostPage />} />
        <Route path="/profile/:id/q&a" element={<ProfileQandAPage />} />
      </Routes>
    </BrowserRouter>
  );
}
