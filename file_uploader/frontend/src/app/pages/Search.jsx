import { useSearchParams } from 'react-router-dom';
import { useSearch } from "@/features/search/hooks/useSearch";
import { FileRow } from "@/features/search/components/FileRow";
import { FolderEntry } from "@/features/search/components/FolderEntry";

export const SearchResults = ({ results, loading, error }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!results) return null;

    const folders = results.folders;
    const files = results.files;

    if (!folders) return null;
    if (!files) return null;

    const groupedFiles = files.reduce((acc, file) => {
        if (!acc[file.folderId])
            acc[file.folderId] = [];
        acc[file.folderId].push(file);
        return acc;
    }, {});

    // console.log("grouped files: ",
    //     Object.values(groupedFiles).forEach((group) => {
    //         console.log("group:");
    //         group.map((file) => {
    //             console.log("file");
    //         })
    //     })
    // );

    return (
        <div className="w-full">
            {[...folders]
                .map((folder) => (
                    <FolderEntry key={folder.id} folderPath={folder.path} />
                ))}

            {Object.entries(groupedFiles).map(([folderId, group]) => (
                <FolderEntry key={folderId} folderPath={group[0].path} files={group} />
            ))}
        </div>
    );
}


const SearchPage = () => {
    const [params] = useSearchParams();
    const query = params.get('q') || '';
    const { data, loading, error } = useSearch(query);

    return (
        <div className="p-4 overflow-auto h-[calc(100vh-96px)] flex flex-col gap-2">
            <h1 className="text-xl font-bold mb-4">Search results for "{query}"</h1>
            <SearchResults results={data.data} loading={loading} error={error} />
        </div>
    );
};

export default SearchPage;
