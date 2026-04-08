import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import FeaturedMainPage from "../Pages/Community/FeaturedMainPage";
import AboutPage from "../Pages/About/AboutPage";
import NotFoundPage from "../Pages/Error/NotFoundPage";
import LocaleShell from "./LocaleShell";
import LegacyRedirect from "./LegacyRedirect";
import { SUPPORTED_LOCALES } from "../i18n/config";
import { localizedPath } from "../i18n/paths";

export default function MainRouter(): React.ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={localizedPath("ar", "")} replace />}
        />
        {SUPPORTED_LOCALES.map((lang) => (
          <Route key={lang} path={`/${lang}`} element={<LocaleShell lang={lang} />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="community" element={<CommunityMainPage />} />
            <Route path="post/:id" element={<PostPage />} />
            <Route path="create-post" element={<CreatePostPage />} />
            <Route path="q&a" element={<QandAMainPage />} />
            <Route path="q&a/:id" element={<QandAPage />} />
            <Route path="create-q&a" element={<QndACreatePage />} />
            <Route path="featured" element={<FeaturedMainPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="profile/:id/posts" element={<ProfilePostPage />} />
            <Route path="profile/:id/q&a" element={<ProfileQandAPage />} />
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Route>
        ))}
        <Route path="*" element={<LegacyRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
