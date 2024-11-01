import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory } from '../Redux/slice/categorySlice';
import { Modal, Spin, Button } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const Categories = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.categories);
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isEditing, setIsEditing] = useState(false);

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
            CategoryId: categoryId,
            CategoryName: categoryName
        };

        try {
            if (isEditing) {
                await dispatch(updateCategory({ categoryId, categoryData })).unwrap();
            } else {
                // Check if CategoryId already exists
                const existingCategory = categories.find(cat => cat.categoryId === categoryId);
                if (existingCategory) {
                    alert(`Category with ID ${categoryId} already exists.`);
                    return;
                }
                await dispatch(addCategory(categoryData)).unwrap();
            }
            hideModal(); // Close modal after successful submission
            dispatch(fetchCategories()); // Refresh the categories after adding/updating
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

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Categories</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
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
                    {categories.map((category) => (
                        <div key={category.categoryId} className="border p-4 rounded shadow">
                            <h3 className="text-lg font-semibold">{category.categoryName}</h3>
                            <Button 
                                icon={<EditOutlined />} 
                                onClick={() => handleEdit(category)} 
                                className="mt-2"
                                type="default"
                            >
                                Edit
                            </Button>
                        </div>
                    ))}
                </div>
            )}

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
