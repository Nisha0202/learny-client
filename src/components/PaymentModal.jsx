// import React, { useEffect, useState } from 'react';
// import Modal from 'react-modal';
// import StripePaymentForm from '../components/StripePaymentForm';
// import {loadStripe} from '@stripe/stripe-js';
// import { Elements} from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(import.meta.env.VITE_Stripe_pub);
// Modal.setAppElement('#root');

// const PaymentModal = ({ isOpen, onRequestClose, session }) => {


//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       contentLabel="Payment Modal"
//       className="modal-content2"
//       overlayClassName="modal-overlay2" 
//     >
//       <h2>Complete Your Payment</h2>
//       <h2 className="text-2xl font-bold mb-1 mt-4">{session.sessionTitle}</h2>
//       <h2 className="text-xl font-bold mb-1 mt-4">${session.registrationFee}</h2>
//       <Elements stripe={stripePromise}>

//      <StripePaymentForm session={session} /> 
   
//     </Elements>
  
//       <button onClick={onRequestClose} className='btn btn-sm text-red-500 my-4'>Close</button>
//     </Modal>
//   );
// };

// export default PaymentModal;


import React from 'react';
import Modal from 'react-modal';
import StripePaymentForm from '../components/StripePaymentForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_Stripe_pub);
Modal.setAppElement('#root');

const PaymentModal = ({ isOpen, onRequestClose, session, onPaymentSuccess }) => {
  const handlePaymentSuccess = () => {
    onPaymentSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Payment Modal"
      className="modal-content2"
      overlayClassName="modal-overlay2"
    >
      <h2>Complete Your Payment</h2>
      <h2 className="text-2xl font-bold mb-1 mt-4">{session.sessionTitle}</h2>
      <h2 className="text-xl font-bold mb-1 mt-4">${session.registrationFee}</h2>
      <Elements stripe={stripePromise}>
        <StripePaymentForm session={session} onPaymentSuccess={handlePaymentSuccess} />
      </Elements>
      <button onClick={onRequestClose} className='btn btn-sm text-red-500 my-4'>Close</button>
    </Modal>
  );
};

export default PaymentModal;

