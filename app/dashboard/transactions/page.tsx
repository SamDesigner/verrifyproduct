"use client";

import { useEffect, useState } from "react";
import { getMyTransactions } from "@/lib/api/transaction";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        const data = await getMyTransactions({
          page: 1,
          limit: 10,
          sortBy: "createdAt:desc",
        });

        setTransactions(data.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h1>My Transactions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        transactions.map((tx) => (
          <div key={11}>
            This is the response from the Backend
          </div>
        ))
      )}
    </div>
  );
}