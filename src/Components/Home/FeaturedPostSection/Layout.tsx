function HomeFeaturedPostsLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight  text-shadow-lg">
              منشورات سفر مميزة
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              محتوى منتقى من فريق الإدارة لدينا
            </p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default HomeFeaturedPostsLayout;
