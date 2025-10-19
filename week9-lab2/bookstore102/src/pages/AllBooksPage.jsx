import { PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';


const AllBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 12;

    const categories = [
        'all', 'fiction', 'non-fiction', 'science', 'history', 'art',
        'psychology', 'business', 'technology', 'cooking'
    ];
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);

                // เรียก API เพื่อดึงข้อมูลหนังสือ
                const response = await fetch('http://localhost/api/v1/books');

                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                // ถ้าไม่สำเร็จจะโยน Error

                const data = await response.json();

                // สุ่มหนังสือ 3 เล่ม
                setBooks(data);         // เก็บข้อมูลทั้งหมดไว้ใน state books
                setFilteredBooks(data);

                // setFeaturedBooks(selected);
                // setError(null);

            } catch (err) {
                setError(err.message);
                console.error('Error fetching books:', err);

            } finally {
                setLoading(false);
            }
        };


        // เรียกใช้ฟังก์ชันดึงข้อมูล
        fetchBooks();
    }, []);

    const navigate = useNavigate();

    const handleNavigateAddBook = () => {
        navigate('/store-manager/add-book');
    };
    const handleSearch = (searchTerm) => {
        const filtered = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBooks(filtered);
        setCurrentPage(1);
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        if (category === 'all') {
            setFilteredBooks(books);
        } else {
            const filtered = books.filter(book =>
                book.category && book.category.toLowerCase() === category.toLowerCase()
            );
            setFilteredBooks(filtered);
        }
        setCurrentPage(1);
    };

    const handleSort = (sortValue) => {
        setSortBy(sortValue);
        const sorted = [...filteredBooks];
        switch (sortValue) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                sorted.sort((a, b) => b.reviews - a.reviews);
                break;
            case 'newest':
            default:
                sorted.sort((a, b) => b.id - a.id);
        }
        setFilteredBooks(sorted);
    };

    // Pagination logic
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEdit = (bookId) => {
        console.log('Edit book:', bookId);
        // Add edit logic here
    };

    const handleDelete = (bookId) => {
        console.log('Delete book:', bookId);
        // Add delete logic here
    };

    if (loading) {
        return <LoadingSpinner />;
    } return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-gray-900">หนังสือทั้งหมด</h1>
                    <button
                        onClick={handleNavigateAddBook}
                        className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold
                    text-gray-700 hover:bg-gray-50 transition-colors">
                        Add Book
                    </button>
                </div>
                <p className="text-gray-600 mb-8">ค้นพบหนังสือที่คุณชื่นชอบจากคอลเล็กชันของเรา</p>


                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <SearchBar onSearch={handleSearch} />
                        </div>

                        {/* Category Filter */}
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-viridian-500 cursor-pointer"
                            value={selectedCategory}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                        >
                            <option value="all">ทุกหมวดหมู่</option>
                            <option value="fiction">นิยาย</option>
                            <option value="non-fiction">สารคดี</option>
                            <option value="science">วิทยาศาสตร์</option>
                            <option value="history">ประวัติศาสตร์</option>
                            <option value="art">ศิลปะ</option>
                            <option value="psychology">จิตวิทยา</option>
                            <option value="business">ธุรกิจ</option>
                            <option value="technology">เทคโนโลยี</option>
                            <option value="cooking">อาหาร</option>
                        </select>

                        {/* Sort */}
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-viridian-500 cursor-pointer"
                            value={sortBy}
                            onChange={(e) => handleSort(e.target.value)}
                        >
                            <option value="newest">ใหม่ล่าสุด</option>
                            <option value="price-low">ราคาต่ำ-สูง</option>
                            <option value="price-high">ราคาสูง-ต่ำ</option>
                            <option value="popular">ยอดนิยม</option>
                        </select>
                    </div>

                    {/* Results count */}
                    <div className="mt-4 text-sm text-gray-600">
                        พบหนังสือ {filteredBooks.length} เล่ม
                        {selectedCategory !== 'all' && ` ในหมวด ${selectedCategory}`}
                    </div>
                </div>

                {/* Books Grid */}
                {currentBooks.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentBooks.map(book => (
                            <div key={book.id} className="relative">
                                {/* Edit & Delete Buttons */}
                                <div className="absolute top-2 right-2 z-10 flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleEdit(book.id);
                                        }}
                                        className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors shadow-md"
                                        title="แก้ไข"
                                    >
                                        <PencilIcon className="h-5 w-5 text-blue-600" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(book.id);
                                        }}
                                        className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors shadow-md"
                                        title="ลบ"
                                    >
                                        <TrashIcon className="h-5 w-5 text-red-600" />
                                    </button>
                                </div>
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">ไม่พบหนังสือที่ค้นหา</p>
                    </div>
                )}                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg 
                  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                ก่อนหน้า
                            </button>

                            {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                let pageNumber = index + 1;
                                if (totalPages > 5) {
                                    if (currentPage > 3) {
                                        pageNumber = currentPage - 2 + index;
                                    }
                                    if (currentPage > totalPages - 3) {
                                        pageNumber = totalPages - 4 + index;
                                    }
                                }

                                if (pageNumber > 0 && pageNumber <= totalPages) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => paginate(pageNumber)}
                                            className={`px-4 py-2 rounded-lg ${currentPage === pageNumber
                                                ? 'bg-viridian-600 text-white'
                                                : 'border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                }
                                return null;
                            })}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg 
                  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                ถัดไป
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllBooksPage;