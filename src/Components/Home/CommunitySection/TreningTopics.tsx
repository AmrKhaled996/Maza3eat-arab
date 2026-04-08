import useHomeTrendingPosts from "../../../Hooks/HomeHooks/useHomeTrending";
import type { Tag } from "../../../Types/Amr'sTypes/Tag";



function HomeCommunitySectionTrendingTopics() {

  const {data: trendingTopics ,isLoading: trendingTopicsLoading ,error: trendingTopicsError } = useHomeTrendingPosts();
  console.log(trendingTopics,"topics")
    return (  <div className="bg-white rounded-2xl p-5 shadow-md">
              <h3 className="font-bold text-gray-900 mb-4 text-base">
                المواضيع الشائعة
              </h3>
              {trendingTopics &&
              <div className="flex flex-col gap-3">
                {trendingTopics.map((t:Tag) => (
                  <div
                    key={t.name}
                    onClick={() => {}}
                    className="flex items-center justify-between cursor-pointer group p-4 bg-slate-100 rounded-2xl hover:bg-slate-200/80 transition-colors duration-300"
                  >
                    <span className="text-sm font-semibold transition-colors">
                      #{t.name}
                    </span>
                  
                  </div>
                ))}
              </div>}
            </div> );
}

export default HomeCommunitySectionTrendingTopics;