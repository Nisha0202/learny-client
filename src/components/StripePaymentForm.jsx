import React, { useContext, useEffect, useState } from 'react';
import '../stylestripe.css';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import Swal from 'sweetalert2';

// export default function StripePaymentForm({ session, onPaymentSuccess }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [clientSecret, setClientSecret] = useState();
//   const [processing, setProcessing] = useState(false);
//   const [carderror, setError] = useState('');
//   const { usern } = useContext(AuthContext);

//   useEffect(() => {
//     if (!session.registrationFee || session.registrationFee < 1) {
//       return;
//     }
//     fetch("https://learny-brown.vercel.app/create-payment-intent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ price: session.registrationFee })
//     })
//       .then(async (res) => {
//         if (res.ok) {
//           return res.json();
//         }
//         const json = await res.json();
//         return await Promise.reject(json);
//       })
//       .then((data) => {
//         console.log("client");
//         console.log(data);
//         setClientSecret(data.clientSecret);
//       })
//       .catch((error) => {
//         console.error("Error fetching payment intent:", error);
//         setError(error.message);
//       });
//   }, [session.registrationFee]);

//   const handleSubmit = async (event) => {
//     // Block native form submission.
//     event.preventDefault();
//     setProcessing(true);
//     console.log(usern.email);

//     if (!stripe || !elements) {
//       return;
//     }
//     const card = elements.getElement(CardElement);
//     if (card == null) {
//       return;
//     }
//     // Use your card Element with other Stripe.js APIs
//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: 'card',
//       card,
//     });
//     if (error) {
//       console.log('[error]', error);
//       setError(error.message);
//       setProcessing(false);
//       return;
//     } else {
//       console.log('[PaymentMethod]', paymentMethod);
//       setError('');
//     }
//     // Confirm payment
//     const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: card,
//         billing_details: {
//           email: usern.email,
//           name: usern.displayName,
//         },
//       },
//     });

//     console.log('PaymentIntent', paymentIntent);
//     if (confirmError) {
//       setError(confirmError.message);
//       setProcessing(false);
//       return;
//     }

//     if (paymentIntent.status === "succeeded") {
//       console.log(paymentIntent);
//       const paymentInfo = {
//         ...session,
//         transactionId: paymentIntent.id,
//         date: new Date(),
//       };
//       console.log(paymentInfo);
//       onPaymentSuccess(true);
//       setProcessing(false);
//       card.clear();
//       setError('');
//     }else{
//       Swal.fire('Error!', 'There was an error on payment.', 'error');
//     }

//     setProcessing(false);
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <CardElement
//           options={{
//             style: {
//               base: {
//                 fontSize: '16px',
//                 color: '#424770',
//                 '::placeholder': {
//                   color: '#aab7c4',
//                 },
//               },
//               invalid: {
//                 color: '#9e2146',
//               },
//             },
//           }}
//         />
//         <button className='btn btn-sm bg-blue-300 border-2' type="submit" disabled={!stripe || !clientSecret}>
//           Pay ${session.registrationFee}
//         </button>
//       </form>
//       {carderror && 
//         <p className='text-red-500 m-3'>
//           {carderror}
//         </p>}
//         {processing && <p className='text-blue-500 m-3 text-lg'>Processing...</p>}
//     </div>
//   );
// };


export default function StripePaymentForm({ session, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');
  const { usern } = useContext(AuthContext);

  useEffect(() => {
    if (!session.registrationFee || session.registrationFee < 1) {
      return;
    }
    fetch("https://learny-brown.vercel.app/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: session.registrationFee })
    })
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        const json = await res.json();
        return await Promise.reject(json);
      })
      .then((data) => {
        console.log("client");
        console.log(data);
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error fetching payment intent:", error);
        setCardError(error.message);
      });
  }, [session.registrationFee]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      // Added check to ensure stripe and elements are loaded
      setCardError('Stripe has not loaded properly.');
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      // Added check to ensure CardElement is mounted
      setCardError('CardElement is not mounted.');
      setProcessing(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
      billing_details: {
        email: usern.email,
        name: usern.displayName,
      },
    });

    if (error) {
      console.log('[error]', error);
      setCardError(error.message);
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      setCardError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      console.log('PaymentIntent', paymentIntent);
      const paymentInfo = {
        ...session,
        transactionId: paymentIntent.id,
        date: new Date(),
      };
      console.log(paymentInfo);
      onPaymentSuccess(true);
      card.clear();
      setCardError('');
    } else {
      Swal.fire('Error!', 'There was an error on payment.', 'error');
    }

    setProcessing(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
        <button 
          className='btn btn-sm bg-blue-300 border-2' 
          type="submit" 
          disabled={!stripe || !clientSecret || processing} // Added check for processing state
        >
          {processing ? 'Processing...' : `Pay $${session.registrationFee}`}
        </button>
      </form>
      {cardError && <p className='text-red-500 m-3'>{cardError}</p>}
    </div>
  );
};
