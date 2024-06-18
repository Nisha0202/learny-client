import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdmNav from '../components/AdmNav';
const ViewAllMaterials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/materials');
        setMaterials(response.data);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchMaterials();
  }, [materials]);


  const handleDelete = async (id) => {
    try {
      // Confirmation dialog with SweetAlert
      const willDelete = await Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this material!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
  
      if (willDelete.value) {
        // User confirmed deletion
        await axios.delete(`http://localhost:5000/api/materials/${id}`);
        setMaterials(materials.filter((material) => material._id !== id));
  
        // Success message with SweetAlert
        Swal.fire("Poof! Your material has been deleted!", {
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };
  

  return (
    <div className='container mx-auto p-4'>
      <AdmNav/>
      <div className='flex flex-col mt-4 gap-2'>
        {materials.length > 0 ? (
          materials.map((material) => (
            <div key={material._id} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>

              <p className='text-gray-700 text-base mb-4'>{material.title}</p>
              {material.link && <a href={material.link} className='text-blue-500 mb-2' target="_blank"
                rel="noopener noreferrer">View Google Drive Link</a>}

              {material.image && (
                <div>
                  <img src={material.image} className='w-24 h-24 object-contain border-2 mt-2' alt='Material' />
                </div>
              )}
           
              <button className='btn btn-sm text-red-500 mt-4' onClick={() => handleDelete(material._id)}>Remove</button>
            </div>
          ))
        ) : (
          <p>No materials found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAllMaterials;
