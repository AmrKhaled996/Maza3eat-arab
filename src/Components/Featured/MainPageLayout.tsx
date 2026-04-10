import { Title } from "react-head";
import NavigationBar from "../shared/NavigationBar";

function MainPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Title>منشورات مميزة - مزاعيط العرب</Title>
        <NavigationBar page="featured" />
        {children}
      </div>
    </div>
  );
}

export default MainPageLayout;
