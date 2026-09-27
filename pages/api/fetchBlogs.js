const fetchBlogs = async (context) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL; // Access API URL from environment variable
  const reqOptions = {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN || ''}`, // Use template literal and default empty string if no token
    },
  };

  try {
    const response = await fetch(`${API_URL}/api/blogs?populate=*`, reqOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { notFound: true }; // Handle errors gracefully
  }
};

export default fetchBlogs;
