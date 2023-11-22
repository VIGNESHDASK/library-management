// src/components/BookList.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const ArrayComponent = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    author: '',
  });

  const fetchBooks = async () => {
    // Fetch your data from an API or any data source
    // For simplicity, I'll use a dummy data array here
    const dummyData = [
      { id: 1, title: 'Book 1', author: 'Author 1' },
      { id: 2, title: 'Book 2', author: 'Author 2' },
    ];
    setBooks(dummyData);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    console.warn('books' , books);
  }, [books]);

  const handleShowModal = (book) => {
    setFormData(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setFormData({ id: null, title: '', author: '' });
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddBook = () => {
    // Perform the add/update book logic (e.g., send a request to the server)
    // For simplicity, I'll just update the state here
    if (formData.id === null) {
      // Add new book
      console.warn('ss',books.length > 0 ? books.length + 1 : 1 );
      setBooks([...books, {  ...formData ,id: books.length > 0 ? books.length + 1 : 1,}]);
    } else {
      // Update existing book
      setBooks(books.map((book) => (book.id === formData.id ? formData : book)));
    }
    handleCloseModal();
  };

  const handleDeleteBook = (id) => {
    // Perform the delete book logic (e.g., send a request to the server)
    // For simplicity, I'll just update the state here
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <div className="container mt-4">
  <h2>Library Books</h2>
      <div  className="d-flex">
      <Button variant="primary" className="ms-auto" onClick={() => handleShowModal({ id: null, title: '', author: '' })}>
      Add Book
    </Button>
      </div>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td className="text-center">
                <Button variant="danger" onClick={() => handleDeleteBook(book.id)}>
                  Delete
                </Button>
                <Button variant="info" onClick={() => handleShowModal(book)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? 'Edit Book' : 'Add Book'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formAuthor">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author"
                name="author"
                value={formData.author}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddBook}>
            {formData.id ? 'Save Changes' : 'Add Book'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ArrayComponent;




