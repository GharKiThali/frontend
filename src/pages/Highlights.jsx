import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import axios from "../instant/axios";



// FAQs
const faqs = [
  {
    question: "How is my donation used?",
    answer: "Your donation directly supports the cause you select, ensuring maximum impact.",
  },
  {
    question: "Is my donation tax-deductible?",
    answer: "Yes, all donations are eligible for tax deductions under Section 80G.",
  },
  {
    question: "Can I donate anonymously?",
    answer: "Absolutely! You can choose to keep your identity confidential.",
  },
];

const Highlights = () => {



  const [paymentClip, setPaymentClip] = useState(null);
  const [val, setVal] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adhar, setAdhar] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMessage, setPaymentMessage] = useState({ type: "", text: "" });

  // const loadRazorpayScript = () => {
  //   return new Promise((resolve) => {
  //     const script = document.createElement("script");
  //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //     script.onload = () => resolve(true);
  //     script.onerror = () => resolve(false);
  //     document.body.appendChild(script);
  //   });
  // };


  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentMessage({ type: "", text: "" });

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setPaymentMessage({ type: "error", text: "⚠️ Razorpay SDK failed to load. Are you online?" });
      return;
    }

    try {
      const orderResponse = await axios.post("/razorpay/paymentcreate", {
        amount: val,
        name,
        email,
        adhar,
        address,
      });

      console.log(orderResponse);
      const { id, amount, currency } = orderResponse.data.order;

      if (!id || !amount || !currency) {
        setPaymentMessage({ type: "error", text: "⚠️ Invalid response from server." });
        return;
      }

      const options = {
        key: "rzp_test_jEEqxldDfUrqh7",
        amount: amount.toString(),
        currency,
        name: "Laxmi Chit Fund",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post("/razorpay/paymentverify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            console.log(verifyResponse);
            setPaymentClip({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              message: "✅ Payment successful!",
              name,
              email,
              val,
              adhar,
              address,
            });

            setPaymentMessage({ type: "success", text: "✅ Payment verified successfully!" });
          } catch (err) {
            console.error("Verification error:", err.response?.data || err.message);
            setPaymentMessage({ type: "error", text: "❌ Payment verification failed." });
          }
        },
        prefill: {
          name,
          email,
          contact: "8989898989",
        },
        notes: {
          address,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setPaymentMessage({ type: "error", text: `❌ Payment Failed: ${response.error.description}` });
      });

      paymentObject.open();
    } catch (err) {
      console.error("Order creation error:", err.response?.data || err.message);
      setPaymentMessage({ type: "error", text: "❌ Unable to create an order." });
    }
  };






  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="bg-[#f9fafb] font-sans">
      {/* Hero Section */}
      <div className="relative w-full min-h-[60vh] text-white flex flex-col justify-center items-center text-center overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}></div>

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

  {/* Content */}
  <div className="relative z-20 flex flex-col justify-center items-center h-full p-10">
    <h1 className="text-5xl font-bold mb-4">Support a Cause that Matters</h1>
    <p className="text-lg max-w-2xl">Choose to donate or become a member. Your contribution helps build a better world.</p>
  </div>
</div>


      
<div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">Make a Payment</h2>

      {!paymentClip && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Amount"
            type="number"
            required
            onChange={(e) => setVal(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Full Name"
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Email Address"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Adhar Number"
            type="text"
            required
            onChange={(e) => setAdhar(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Address"
            type="text"
            required
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Pay Now
          </button>

       
        </form>
      )}

      {paymentClip && (
        
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded shadow">


          
          <h3 className="font-semibold text-lg mb-2">{paymentClip.message}</h3>
          <p><strong>Payment ID:</strong> {paymentClip.paymentId}</p>
          <p><strong>Order ID:</strong> {paymentClip.orderId}</p>
          <p><strong>Name:</strong> {paymentClip.name}</p>
          <p><strong>Email:</strong> {paymentClip.email}</p>
          <p><strong>Amount:</strong> ₹{paymentClip.val}</p>
          <p><strong>Adhar:</strong> {paymentClip.adhar}</p>
          <p><strong>Address:</strong> {paymentClip.address}</p>
        </div>
      )}
      <p><strong>
      {paymentMessage.text && (
            <div
              className={`mt-4 p-3 rounded text-sm ${
                paymentMessage.type === "success"
                  ? "bg-green-100 text-green-700 text-[2vw]"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {paymentMessage.text}
            </div>
          )}
        </strong></p>
    </div>
     

       

      {/* FAQ Section */}
      <div className="py-12 px-4 sm:px-10 md:px-20 bg-white">
        <h2 className="text-3xl font-semibold text-center text-[#335288] mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 py-4">
              <button
                className="w-full flex justify-between items-center text-left text-lg font-medium text-[#335288] focus:outline-none"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                {faq.question}
                <ChevronDownIcon className={`h-5 w-5 transform transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {openFAQ === index && <p className="mt-2 text-gray-600">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Highlights;