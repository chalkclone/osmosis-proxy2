import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  return (
    <div>
      <h1>💰 Баланс</h1>
      <pre>{JSON.stringify(data?.balances, null, 2)}</pre>

      <h1>📥 Входящие транзакции</h1>
      <pre>{JSON.stringify(data?.incoming_transactions, null, 2)}</pre>
    </div>
  );
}

