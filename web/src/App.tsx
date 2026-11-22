import { useEffect, useState } from "react";

// Browser code has no `process.env`; change this constant per environment.
const API_URL = "http://localhost:3000";

export function App() {
  const [health, setHealth] = useState<string>("checking...");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return res.json();
      })
      .then((data) => setHealth(data.message))
      .catch((err) => setHealth(`error: ${err.message}`));
  }, []);

  return <div>Server health: {health}</div>;
}
