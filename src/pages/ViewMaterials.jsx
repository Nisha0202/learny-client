import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function ViewMaterials() {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, [materials]);

  const fetchMaterials = async () => {
    const res = await axios.get('http://localhost:5000/api/materials');
    setMaterials(res.data);
  };

  const deleteMaterial = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this material!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    });
  
    if (result.isConfirmed) {
      await axios.delete(`http://localhost:5000/api/materials/${id}`);
      fetchMaterials();
      Swal.fire('Deleted!', 'Your material has been deleted.', 'success');
    }
  };

  const updateMaterial = async (id, updatedMaterial) => {
    await axios.put(`http://localhost:5000/api/materials/${id}`, updatedMaterial);
    fetchMaterials();
  };

  return (
    <div className='container min-h-[75vh]'>
      {materials.map((material) => (
        <div key={material._id} className='w-full h-32 flex flex-col md:flex-row gap-8 border-2 p-4'>
          <h2 className='font-bold text-wrap text-lg'>{material.title}</h2>
          <div className='flex gap-4'> 
          <button className='btn btn-sm bg-blue-500 text-white' onClick={() => deleteMaterial(material._id)}>Delete</button>
          <button className='btn btn-sm bg-red-500 text-white' onClick={() => updateMaterial(material._id, { title: 'New Title' })}>Update</button>
        </div>
        </div>
       
      ))}
    </div>
  );
}

export default ViewMaterials;
