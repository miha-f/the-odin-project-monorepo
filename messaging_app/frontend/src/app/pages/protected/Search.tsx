export default function Search() {

    return (
        <>
            <h2 className="text-xl font-bold mb-4">Search</h2>
            <form className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mt-2">
                <div className="flex-1">
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                    >
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        placeholder="Enter search query"
                    />
                    {/* {errors.username && ( */}
                    {/*     <p className="text-sm text-red-500 mt-1">{errors.username}</p> */}
                    {/* )} */}
                </div>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition"
                >
                    Search
                </button>
            </form>
        </>
    );
}
