import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../Pages/Auth/LoginPage";
import BannedPage from "../Pages/Auth/BannedPage";
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
import NotificationsPage from "../Pages/Notifications/NotificationsPage";
import NotificationDetailPage from "../Pages/Notifications/NotificationDetailPage";
import LocaleShell from "./LocaleShell";
import LegacyRedirect from "./LegacyRedirect";
import ProtectedRoute from "./ProtectedRoute";
import { SUPPORTED_LOCALES } from "../i18n/config";
import { localizedPath } from "../i18n/paths";
import RepliesThreadPage from "../Pages/Comments/RepliesThreadPage";

import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminModeratorsPage from "../Pages/Admin/AdminModeratorsPage";
import AdminLayout from "../Pages/Admin/AdminLayout";
import AdminHomePage from "../Pages/Admin/AdminHomePage";
import AdminUsersPage from "../Pages/Admin/AdminUsersPage";
import AdminUserDetails from "../Pages/Admin/Details/AdminUserDetails";
import AdminPostsPage from "../Pages/Admin/AdminPostsPage";
import AdminPostDetails from "../Pages/Admin/Details/AdminPostDetails";
import AdminQuestionsPage from "../Pages/Admin/AdminQuestionsPage";
import AdminQuestionDetails from "../Pages/Admin/Details/AdminQuestionDetails";
import AdminTagsPage from "../Pages/Admin/AdminTagsPage";
import AdminReportsPage from "../Pages/Admin/AdminReportsPage";
import AdminReportDetails from "../Pages/Admin/Details/AdminReportDetails";
import AdminTiersPage from "../Pages/Admin/AdminTiersPage";
import AdminAdsPage from "../Pages/Admin/AdminAdsPage";
import AdminAnnouncementsPage from "../Pages/Admin/AdminAnnouncementsPage";

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
            <Route path="banned" element={<BannedPage />} />
            <Route path="community" element={<CommunityMainPage />} />
            <Route path="post/:id" element={<PostPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="create-post" element={<CreatePostPage />} />
              <Route path="create-q&a" element={<QndACreatePage />} />
              <Route path="profile/:id" element={<ProfilePostPage />} />
              <Route path="profile/:id/posts" element={<ProfilePostPage />} />
              <Route path="profile/:id/q&a" element={<ProfileQandAPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="notifications/:id" element={<NotificationDetailPage />} />
            </Route>
            <Route path="q&a" element={<QandAMainPage />} />
            <Route path="q&a/:id" element={<QandAPage />} />
            <Route path="featured" element={<FeaturedMainPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="replies/:id" element={<RepliesThreadPage />} />

            <Route path="admin" element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminHomePage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="users/:id" element={<AdminUserDetails />} />
                <Route path="moderators" element={<AdminModeratorsPage />} />
                <Route path="posts" element={<AdminPostsPage />} />
                <Route path="posts/create" element={<CreatePostPage />} />
                <Route path="posts/:id" element={<AdminPostDetails />} />
                <Route path="questions" element={<AdminQuestionsPage />} />
                <Route path="questions/create" element={<QndACreatePage />} />
                <Route path="questions/:id" element={<AdminQuestionDetails />} />
                <Route path="tags" element={<AdminTagsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="reports/:id" element={<AdminReportDetails />} />
                <Route path="tiers" element={<AdminTiersPage />} />
                <Route path="ads" element={<AdminAdsPage />} />
                <Route path="announcements" element={<AdminAnnouncementsPage />} />
              </Route>
            </Route>
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
