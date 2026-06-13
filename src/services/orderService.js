// Change these strings to match your two different deployments!
const CHECKOUT_API_URL =
  "https://script.google.com/macros/s/AKfycbxOvA_FBD6HO2a57oAZe6SWbErm1HRtMYbKw7Ish_-2a0RbaViP7ZBxwYMNBtqLITzIqg/exec";
const TRACKING_API_URL =
  "https://script.google.com/macros/s/AKfycbxOvA_FBD6HO2a57oAZe6SWbErm1HRtMYbKw7Ish_-2a0RbaViP7ZBxwYMNBtqLITzIqg/exec";

// Generate Order ID on frontend
export const generateOrderId = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SN${yy}${mm}${dd}${rand}`;
};

// 1. Save order to Google Sheets (Using Checkout URL via POST)
export const saveOrderToSheet = async (orderData) => {
  if (!CHECKOUT_API_URL) {
    return { success: true, orderId: generateOrderId(), local: true };
  }

  try {
    const res = await fetch(CHECKOUT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "createOrder",
        ...orderData,
      }),
    });
    const data = await res.json();
    if (data.success) return { success: true, orderId: data.orderId };
    throw new Error(data.error || "Sheet save failed");
  } catch (err) {
    console.warn("Sheet API failed, using local ID:", err.message);
    return { success: true, orderId: generateOrderId(), local: true };
  }
};

// 2. Track order from Google Sheets (Using Tracking URL via GET)
export const trackOrderFromSheet = async (searchId) => {
  try {
    const RESPONSE = await fetch(
      `${TRACKING_API_URL}?orderId=${searchId.trim().toUpperCase()}`,
    );
    const payload = await RESPONSE.json();

    if (!payload || payload.success === false) {
      return {
        success: false,
        error: payload.error || "Order not found. Please check your Order ID.",
      };
    }

    if (payload.success && payload.data) {
      return {
        success: true,
        data: payload.data,
      };
    }

    return {
      success: false,
      error: "Order not found. Please check your Order ID.",
    };
  } catch (error) {
    console.error("Order service tracking crash lookup:", error);
    return {
      success: false,
      error: "Could not connect to tracking services. Please try again.",
    };
  }
};
