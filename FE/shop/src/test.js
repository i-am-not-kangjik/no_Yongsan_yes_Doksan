import React, { useState } from 'react';
import axios from 'axios';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState(0);
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem('token');

  const handleFileChange = (event) => {
    setFiles([...files, ...event.target.files]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('price', price);
    formData.append('region', region);
    formData.append('category', category);

    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axios.post('http://localhost:8081/api/sell/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log(response.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Content" onChange={(e) => setContent(e.target.value)} />
      <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <input type="text" placeholder="Region" onChange={(e) => setRegion(e.target.value)} />
      <input type="text" placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit">Post</button>
    </form>
  );
};

export default PostForm;