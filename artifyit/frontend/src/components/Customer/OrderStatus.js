import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const OrderStatus = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Fetching orders with token:', token); // Debugging token
        const response = await axios.get('/api/order-status/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Orders response:', response.data); // Debugging response
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (err.response && err.response.status === 401) {
          
        } else {
          setError('Failed to fetch orders');
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [token, dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Orders</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.item?.name || 'N/A'}</td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderStatus;
