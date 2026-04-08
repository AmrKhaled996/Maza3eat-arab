import HomeCommunitySectionCreateButton from "../../shared/CreateButton";

function HomeCommunitySectionLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight text-shadow-lg">
              المجتمع
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              شارك تجاربك وتواصل مع المسافرين الآخرين
            </p>
          </div>
          <HomeCommunitySectionCreateButton />
        </div>
        {children}
      </div>
    </div>
  );
}

export default HomeCommunitySectionLayout;
