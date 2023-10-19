import Layout from "@/components/Layout";
import Check from "@/components/icons/Check";
import Close from "@/components/icons/Close";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      console.log(response.data);
      setOrders(response.data);
    });
  }, []);

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Id</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order._id}</td>
                <td className={order.paid ? "text-green-600" : "text-red-700"}>
                  {order.paid ? <Check /> : <Close />}
                </td>
                <td>
                  {order.name} {order.email}
                  <br />
                  {order.city} {order.postalCode}
                  <br />
                  {order.streetAddress} {order.country}
                </td>
                <td>
                  {order.line_items.map((l) => (
                    <div key={l._id}>
                      <div>
                        {l.price_data.product_data.name} x {l.quantity}
                      </div>
                      <div>
                        {l.price_data.currency} {l.price_data.unit_amount}
                      </div>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
