import { useNavigate } from "react-router-dom";

function HomeCommunitySectionCreateButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/create-post")}
      className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition-all whitespace-nowrap main-gradient hover:cursor-pointer"
    >
      <span className="text-base">+</span> انشاء منشور
    </button>
  );
}

export default HomeCommunitySectionCreateButton;
