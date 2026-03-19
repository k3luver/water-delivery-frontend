import { useState, useEffect } from "react";

function App() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    litres: "",
    urgency: "Normal",
  });

  const pricePer1000L = 10;

  const calculatePrice = (litres) => {
    const base = (litres / 1000) * pricePer1000L;
    return form.urgency === "Urgent" ? base * 1.5 : base;
  };

  useEffect(() => {
    fetch("https://express-js-on-vercel-7c96.onrender.com/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error loading orders:", err));
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.litres) return;

    try {
      const res = await fetch("https://express-js-on-vercel-7c96.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: calculatePrice(Number(form.litres)),
        }),
      });

      const data = await res.json();
      setOrders([data, ...orders]);

      setForm({
        name: "",
        phone: "",
        location: "",
        litres: "",
        urgency: "Normal",
      });
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`https://express-js-on-vercel-7c96.onrender.com/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      setOrders(
        orders.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>💧 Bulk Water Delivery</h1>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <br /><br />

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <br /><br />

      <input
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
      <br /><br />

      <input
        placeholder="Litres"
        type="number"
        value={form.litres}
        onChange={(e) => setForm({ ...form, litres: e.target.value })}
      />
      <br /><br />

      <select
        value={form.urgency}
        onChange={(e) => setForm({ ...form, urgency: e.target.value })}
      >
        <option value="Normal">Normal</option>
        <option value="Urgent">Urgent (+50%)</option>
      </select>

      <br /><br />

      <button onClick={handleSubmit}>Place Order</button>

      <hr />

      <h2>Orders</h2>

      {orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p><b>{order.name}</b></p>
          <p>{order.phone}</p>
          <p>{order.location}</p>
          <p>{order.litres}L</p>
          <p>${Number(order.price || 0).toFixed(2)}</p>
          <p>Status: {order.status}</p>

          <button onClick={() => updateStatus(order.id, "En Route")}>
            En Route
          </button>

          <button onClick={() => updateStatus(order.id, "Delivered")}>
            Delivered
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
