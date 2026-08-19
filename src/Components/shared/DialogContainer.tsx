function Dialog({ open, onClose, children }:{
    open: boolean,
    onClose: () => void,
    children: React.ReactNode
}) {
    if (!open) return null;
    return (
       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-200  backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-lg w-full mx-2 sm:mx-24 lg:mx-36 xl:mx-48 px-3 py-6  sm:px-6 lg:px-12 xl:px-16 my-6 max-w-3xl  z-150 max-h-[91vh] overflow-y-auto relative">
        {children}
      </div>
      <div
        className="absolute inset-0 z-40"
        onClick={onClose}
      />
    </div>);
}

export default Dialog;