import React, { useContext, useEffect, useState } from 'react';
import '../stylestripe.css';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { AuthContext } from '../FirebaseProbider/FirbaseProvider';
import Swal from 'sweetalert2';

export default function StripePaymentForm({ session, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState();
  const [processing, setProcessing] = useState(false);
  const [carderror, setError] = useState('');
  const { usern } = useContext(AuthContext);

  useEffect(() => {
    if (!session.registrationFee || session.registrationFee < 1) {
      return;
    }
    fetch("http://localhost:5000/create-payment-intent", {
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
        setError(error.message);
      });
  }, [session.registrationFee]);

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();
    setProcessing(true);
    console.log(usern.email);

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card == null) {
      return;
    }
    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });
    if (error) {
      console.log('[error]', error);
      setError(error.message);
      setProcessing(false);
      return;
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      setError('');
    }
    // Confirm payment
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          email: usern.email,
          name: usern.displayName,
        },
      },
    });

    console.log('PaymentIntent', paymentIntent);
    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      console.log(paymentIntent);
      const paymentInfo = {
        ...session,
        transactionId: paymentIntent.id,
        date: new Date(),
      };
      console.log(paymentInfo);
      // Show success message
      Swal.fire('Success!', 'Your Payment was Successful', 'success');
      onPaymentSuccess(true);
      setProcessing(false);
      card.clear();
      setError('');
    }else{
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
        <button className='btn btn-sm border-2' type="submit" disabled={!stripe || !clientSecret}>
          Pay ${session.registrationFee}
        </button>
      </form>
      {carderror && 
        <p className='text-red-500 m-3'>
          {carderror}
        </p>}
        {processing && <p className='text-blue-500 m-3 text-lg'>Loading...</p>}
    </div>
  );
};


