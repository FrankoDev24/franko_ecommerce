import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory } from '../Redux/slice/categorySlice';
import { Modal, Spin, Button, Pagination } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const Categories = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.categories);
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 6; // Change this value to set items per page

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => {
        setCategoryName(''); // Reset category name
        setCategoryId(''); // Reset category ID
        setIsEditing(false); // Reset editing state
        setIsModalVisible(false);
    };

    const handleNameChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleIdChange = (e) => {
        setCategoryId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryData = {
            categoryId,
            categoryName
        };

        try {
            if (isEditing) {
                await dispatch(updateCategory({ categoryId, categoryData })).unwrap();
            } else {
                const existingCategory = categories.find(cat => cat.categoryId === categoryId);
                if (existingCategory) {
                    alert(`Category with ID ${categoryId} already exists.`);
                    return;
                }
                await dispatch(addCategory(categoryData)).unwrap();
            }
            hideModal(); // Close modal after successful submission
            dispatch(fetchCategories()); // Refresh categories
        } catch (error) {
            console.error('Failed to add/update category: ', error);
        }
    };

    const handleEdit = (category) => {
        setCategoryId(category.categoryId);
        setCategoryName(category.categoryName);
        setIsEditing(true);
        showModal();
    };

    // Pagination logic
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Categories</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    className="w-full md:w-auto"
                >
                    Add Category
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <Spin size="large" />
                </div>
            ) : error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {currentCategories.map((category) => (
                        <div key={category.categoryId} className="border border-gray-300 p-4 rounded shadow hover:shadow-lg transition-shadow duration-200 bg-white hover:bg-gray-100">
                            <h3 className="text-lg font-semibold text-red-600">{category.categoryName}</h3>
                            <Button 
                                icon={<EditOutlined />} 
                                onClick={() => handleEdit(category)} 
                                className="mt-2 bg-green-800 text-white hover:bg-green-800 transition"
                            >
                                Edit
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                pageSize={categoriesPerPage}
                total={categories.length}
                className="mt-4 text-center"
                showSizeChanger={false}
                showTotal={(total) => `Total ${total} categories`}
            />

            <Modal
                title={isEditing ? "Edit Category" : "Add New Category"}
                visible={isModalVisible}
                onCancel={hideModal}
                footer={null}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Category ID:</label>
                        <input
                            type="text"
                            name="categoryId"
                            value={categoryId}
                            onChange={handleIdChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter category ID"
                            disabled={isEditing} // Disable input when editing
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Category Name:</label>
                        <input
                            type="text" 
                            name="categoryName"
                            value={categoryName}
                            onChange={handleNameChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Enter category name"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        {isEditing ? "Update Category" : "Add Category"}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Categories;
