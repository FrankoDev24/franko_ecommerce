import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory } from '../Redux/slice/categorySlice';
import { Modal, Spin, Button, Input, Table, Pagination } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const Categories = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.categories);
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const categoriesPerPage = 6; // Items per page

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => {
        setCategoryName('');
        setCategoryId('');
        setIsEditing(false);
        setIsModalVisible(false);
    };

    const handleNameChange = (e) => setCategoryName(e.target.value);
    const handleIdChange = (e) => setCategoryId(e.target.value);
    
    const handleSearchChange = (e) => setSearchQuery(e.target.value);

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
            hideModal();
            dispatch(fetchCategories());
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

    const filteredCategories = categories.filter((category) => 
        category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

    const columns = [
        {
            title: 'Category ID',
            dataIndex: 'categoryId',
            key: 'categoryId',
        },
        {
            title: 'Category Name',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Button 
                    icon={<EditOutlined />} 
                    onClick={() => handleEdit(record)} 
                    className="bg-green-600 text-white  transition rounded-full"
                >
                    Edit
                </Button>
            ),
        }
    ];

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-red-500 mb-2 md:mb-0">Categories</h2>
                <div className="flex items-center">
                    <Input 
                        placeholder="Search by category name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{ marginRight: 16 , width: '250px' }}
                    />
                    <Button
                     
                        icon={<PlusOutlined />}
                        onClick={showModal}
                        className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white rounded-full"
                    >
                        Add Category
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <Spin size="large" />
                </div>
            ) : error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : (
                <Table
                    columns={columns}
                    dataSource={currentCategories}
                    rowKey="categoryId"
                    pagination={false}
                    style={{ marginBottom: '20px' }}
                />
            )}

            <Pagination
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                pageSize={categoriesPerPage}
                total={filteredCategories.length}
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
                            disabled={isEditing}
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
