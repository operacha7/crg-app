import React, { useState, useEffect } from "react";

function Login({ onLoginSuccess }) {
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [passCode, setPassCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/operacha7/crg-data/main/Table6.json"
    )
      .then((res) => res.json())
      .then((data) => setOrgs(data))
      .catch((err) => console.error("Error fetching orgs:", err));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const foundOrg = orgs.find(
      (org) =>
        org["Registered Organization"] === selectedOrg &&
        org["Org PassCode"] === passCode
    );

    if (foundOrg) {
      onLoginSuccess(foundOrg);
    } else {
      setError("Invalid login. Please try again.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Registered Organization:
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              required
            >
              <option value="">Select an organization</option>
              {orgs.map((org, i) => (
                <option key={i} value={org["Registered Organization"]}>
                  {org["Registered Organization"]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Passcode:
            <input
              type="text"
              value={passCode}
              onChange={(e) => setPassCode(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
