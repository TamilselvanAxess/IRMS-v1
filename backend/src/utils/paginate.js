export const paginate = async (Model, query, page = 1, limit = 10, sort = { createdAt: -1 }) => {
    const skip = (page - 1) * limit;

    // Fetch paginated data
    const data = await Model.find(query).sort(sort).skip(skip).limit(limit);

    // Count total documents
    const totalCount = await Model.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return {
        data,
        totalPages,
        currentPage: parseInt(page),  
        totalCount,
    };
};
