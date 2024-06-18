import React from 'react';

const Banner = () => {
  return (
<div className="relative bg-cover w-full bg-center h-96 text-white py-24 px-10 object-fill" 
     style={{backgroundImage: "url('https://i.pinimg.com/564x/0a/0a/d4/0a0ad4499fcc91c403e33ee7b50c5dfd.jpg')"}}>
  <div className='absolute inset-0 w-full bg-black opacity-50'></div>
  <div className='relative flex flex-col items-center justify-center h-full text-center'>
    <h1 className="text-xl/loose lg:text-5xl/loose font-bold">Learny</h1>
    <p className="text-lg/snug">
      Empowering learners and educators
    </p>
  </div>
</div>

  );
};

export default Banner;
