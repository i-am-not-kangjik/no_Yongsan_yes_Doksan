import React, { useState } from 'react';
import axios from 'axios';

const BulletinBoard = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('price', price);
    formData.append('region', region);
    formData.append('category', category);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:8081/api/sell/', formData, {
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Handle the response as needed
      if (response.status === 200) {
        // Request successful
        alert('Post created successfully.');
        console.log('Post created successfully.');
      } else {
        // Request failed
        alert('Failed to create post.');
        console.log('Failed to create post.');
      }
    } catch (error) {
      alert('An error occurred while creating the post.');
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="text" placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} required />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="file" multiple onChange={handleFileChange} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BulletinBoard;
