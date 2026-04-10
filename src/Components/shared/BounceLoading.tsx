function BounceLoading() {
  return (
    <div className="flex justify-center items-center gap-3 ">
      <div className="animate-[bounce_1s_infinite_100ms] rounded-full h-4 w-4 bg-gray-200"></div>
      <div className="animate-[bounce_1s_infinite_300ms] rounded-full h-4 w-4 bg-gray-200"></div>
      <div className="animate-[bounce_1s_infinite_500ms] rounded-full h-4 w-4 bg-gray-200"></div>
    </div>
  );
}

export default BounceLoading;
