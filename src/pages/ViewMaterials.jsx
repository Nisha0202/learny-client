import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TchNav from '../components/TchNav';

function ViewMaterials() {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const { usern } = useContext(AuthContext);
  const dialogRef = useRef(null);
  const queryClient = useQueryClient();

  const fetchMaterials = async () => {
    const tutorEmail = usern.email;
    try {
      const response = await axios.get(`https://learny-brown.vercel.app/api/materials/${tutorEmail}`);
      setLoading(false);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || 'An error occurred while fetching the materials');
    }
  };


  const { data: materials, status } = useQuery({
    queryKey: ['materials', { tutorEmail: usern.email }],
    queryFn: fetchMaterials,
    retry: 3, // retry up to 3 times
  });

  const deleteMaterial = useMutation({
    mutationFn: async (id) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this material!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      });

      if (result.isConfirmed) {
        await axios.delete(`https://learny-brown.vercel.app/api/materials/${id}`);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries(['materials', { tutorEmail: usern.email }]);
      Swal.fire('Deleted!', 'Your material has been deleted.', 'success');
    },
  });

  if (!usern) {
    return (
      <div className="container   flex justify-center items-center">
        <p className="text-red-500 font-bold">You must be logged in to access.</p>
      </div>
    );
  }

  const updateMaterial = useMutation({
    mutationFn: async ({ id, updatedMaterial }) => {
      await axios.put(`https://learny-brown.vercel.app/api/materials/${id}`, updatedMaterial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['materials', { tutorEmail: usern.email }]);
      Swal.fire('Success!', 'Material updated successfully!', 'success');
    },
    onError: () => {
      Swal.fire('Error!', 'Failed to update material.', 'error');
    },
  });


  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGbb}`, formData);

    if (res.status !== 200) {
      throw new Error('Failed to upload image');
    }

    return res.data.data.url; // The URL of the uploaded image
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const imageFile = e.target.image.files[0];
    let link = e.target.link.value;

    let imageURL = selectedMaterial.image; // Use the current image URL by default
    let oldlink = selectedMaterial.link


    // Only upload a new image if an image file is selected
    if (imageFile) {
      imageURL = await uploadImage(imageFile);
    }
    if (!link) {
      link = oldlink;
    }

    const updatedMaterial = {
      title,
      image: imageURL, // Use the new image URL here
      link,
    };

    await updateMaterial.mutateAsync({ id: selectedMaterial._id, updatedMaterial });
    setSelectedMaterial(null);
  };

  if (status === 'loading')
    return (
      <div className='container  '>
        <TchNav />
        <div className='font-bold grid place-content-center mt-4'>
          Loading...
        </div>
      </div>
    );
  if (status === 'error')
    return (
      <div className='container  '>
        <TchNav />
        <div className='font-bold grid place-content-center mt-4'>
          An error has occurred
        </div>
      </div>
    );
  if (!materials || materials.length === 0)
    return (
      <div className='container  '>
        <TchNav />
        <div className='font-bold grid place-content-center mt-4'>
          No Session Created Yet or Approved
        </div>
      </div>
    );

  return (
    <div className='container  '>
      <TchNav />
      <div className='font-bold grid place-content-center mt-4 text-lg'>Your Materials</div>
      <div className=' mt-6 md:mt-8'>
        {materials && materials.map((material) => (
          <div key={material._id} className='w-full max-w-xl flex flex-col md:flex-row gap-8 border-2 p-4 mt-2'>
            <div className='flex flex-col gap-3 min-w-44'>
              <h2 className='font-bold text-wrap text-lg'>{material.title}</h2>
              {material.link && <a href={material.link} className='text-blue-500' target="_blank" rel="noopener noreferrer">View Google Drive Link</a>}
            </div>

            {material.image && <img src={material.image} className='w-24 h-24 object-contain border-2' />}
            <div className='flex gap-4 items-center'>
              <button className='btn btn-sm bg-red-500 hover:bg-red-600 text-white' onClick={() => deleteMaterial.mutateAsync(material._id)}>Delete</button>
              <button className='btn btn-sm  bg-blue-500 hover:bg-blue-600 text-white' onClick={() => setSelectedMaterial(material)}>Update</button>
            </div>
          </div>
        ))}

        {selectedMaterial && (
          <dialog ref={dialogRef} id="my_modal_1" className="modal z-30" open={selectedMaterial !== null}>
            <div className="modal-box">
              <div className='flex justify-between items-center'>
                <h3 className="font-bold text-lg">Update Material</h3>
                <button className="btn" onClick={() => setSelectedMaterial(null)}>Close</button>
              </div>

              <div className="modal-action">
                <form method="dialog" onSubmit={handleUpdateSubmit} className='w-full flex flex-col items-start gap-3'>
                  <label>
                    Title:
                  </label>
                  <input name="title" className='border-2' type="text" defaultValue={selectedMaterial.title} required />

                  <label>
                    Image:
                  </label>
                  <input name="image" className='border-2 max-w-64' type="file" />
                  <label>
                    Drive link:
                  </label>
                  <input name="link" className='border-2 w-64' type="url" defaultValue={selectedMaterial.link} />

                  <button className='btn btn-md bg-blue-800 text-white' type="submit">Update Material</button>
                </form>
              </div>
            </div>
          </dialog>
        )}
      </div>
      {loading && (
        <div className="absolute inset-0 flex justify-center my-2 items-center">
          <div className="loading loading-ring loading-xl text-indigo-500"></div>
        </div>
      )}

    </div>
  );
}

export default ViewMaterials;
