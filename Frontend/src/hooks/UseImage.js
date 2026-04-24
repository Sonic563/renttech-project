import { useAuth } from '../context/AuthContext';

export const useImage = () => {
  const { token } = useAuth();

 const uploadImage = async (file, description = '', uploadedBy = '') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('uploadedBy', uploadedBy || 'admin');



    const response = await fetch('http://localhost:8080/api/images/upload', {
      method: 'POST',
      headers: {
       
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });


    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Server error:', error);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return { success: true, image: data };
    
  } catch (error) {
    console.error('❌ Upload hiba:', error.message);
    return { success: false, error: error.message };
  }
};

  const getImage = async (imageId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/images/${imageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Hiba a kép letöltésekor');
      }

      return await response.json();
    } catch (error) {
      console.error('Letöltés hiba:', error);
      return null;
    }
  };

  const deleteImage = async (imageId) => {
    try {
      await fetch(`http://localhost:8080/api/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Törlés hiba:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    uploadImage,
    getImage,
    deleteImage
  };
};