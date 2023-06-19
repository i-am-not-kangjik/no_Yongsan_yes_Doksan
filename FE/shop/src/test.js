import React, { useState } from 'react';

const BulletinBoardPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(title)
    console.log(content)
    console.log(price)
    console.log(region)
    console.log(category)
    console.log(file)

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('price', price);
    formData.append('region', region);
    formData.append('category', category);
    formData.append('file', file);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8081/api/sell/create', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      // Handle the response as needed
      if (response.ok) {
        // Request successful
        console.log('Post created successfully');
      } else {
        // Request failed
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Region"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default BulletinBoardPage;