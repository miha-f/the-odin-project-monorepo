export const FileListHeader = () => {
    return (
        <div className="hidden sm:grid grid-cols-4 gap-4 px-4 py-2 text-sm text-text font-medium">
            <div className="col-span-1">Name</div>
            <div>Type</div>
            <div>Size</div>
            <div>Last Modified</div>
        </div>
    );
};
