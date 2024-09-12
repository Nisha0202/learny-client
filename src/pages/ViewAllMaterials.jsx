import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdmNav from '../components/AdmNav';
import { jwtDecode } from 'jwt-decode';


const ViewAllMaterials = () => {
  const [materials, setMaterials] = useState([]);

  const token = localStorage.getItem('token');
  let decodedToken = null;

  if (token) {
      try {
          decodedToken = jwtDecode(token).role;
      } catch (error) {
          console.error('Invalid token');
      }
  }

  // Check if the user is an admin
  if (decodedToken !== 'admin') {
      return (
          <div className="container   flex justify-center items-center">
              <p className="text-red-500 font-bold">Access Denied: Admins only.</p>
          </div>
      );
  }

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get('https://learny-brown.vercel.app/api/materials');
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
        await axios.delete(`https://learny-brown.vercel.app/api/materials/${id}`);
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
      <div className='font-bold grid place-content-center mt-4 text-lg'>All Materials</div>
      <div className='flex flex-wrap mt-4 gap-4'>
        {materials.length > 0 ? (
          materials.map((material) => (
            <div key={material._id} className='p-4 border-2 mt-2 md:w-80 w-full rounded shadow relative'>

              <p className='text-gray-700 text-base mb-4 text-wrap'>{material.title}</p>
              {material.link && <a href={material.link} className='text-blue-500 mb-2' target="_blank"
                rel="noopener noreferrer">View Google Drive Link</a>}

              {material.image && (
                <div>
                  <img src={material.image} className='w-24 h-24 object-contain border-2 mt-2 mb-14' alt='Material' />
                </div>
              )}
           
              <button className='btn btn-sm text-red-500 mt-4 bottom-4 absolute' onClick={() => handleDelete(material._id)}>Remove</button>
            </div>
          ))
        ) : (
          <p className='text-center w-full font-semibold text-lg h-screen'>No materials found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAllMaterials;
