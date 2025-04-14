import React, { useState, useEffect } from "react";
import EmailDialog from "./EmailDialog";

const th = {
  textAlign: "left",
  padding: "10px",
  background: "#f9f9f9",
  borderBottom: "2px solid #ccc",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  verticalAlign: "top",
};

function MainApp({ loggedInUser }) {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [zips, setZips] = useState([]);
  const [assistance, setAssistance] = useState([]);
  const [selectedZip, setSelectedZip] = useState("");
  const [selectedAssistance, setSelectedAssistance] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/operacha7/crg-data/main/Sheet1.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setFiltered(data);
      });

    fetch(
      "https://raw.githubusercontent.com/operacha7/crg-data/main/Table1.json"
    )
      .then((res) => res.json())
      .then((data) => setZips([...new Set(data.map((r) => r["Zip Code"]))]));

    fetch(
      "https://raw.githubusercontent.com/operacha7/crg-data/main/Table3.json"
    )
      .then((res) => res.json())
      .then((data) =>
        setAssistance([...new Set(data.map((r) => r["Assistance Type"]))])
      );
  }, []);

  useEffect(() => {
    const filter = records.filter((r) => {
      const zipMatch = selectedZip
        ? r["Zip Codes"].includes(selectedZip)
        : true;
      const assistMatch = selectedAssistance
        ? r["Assistance Type"] === selectedAssistance
        : true;
      return zipMatch && assistMatch;
    });
    setFiltered(filter);
  }, [selectedZip, selectedAssistance, records]);

  const handleCheckboxChange = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "100%" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        Community Resources
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <select onChange={(e) => setSelectedZip(e.target.value)}>
            <option value="">All Zip Codes</option>
            {zips.map((zip) => (
              <option key={zip} value={zip}>
                {zip}
              </option>
            ))}
          </select>

          <select onChange={(e) => setSelectedAssistance(e.target.value)}>
            <option value="">All Assistance Types</option>
            {assistance.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            console.log("Clicked Send Email", selectedRows);
            if (selectedRows.length === 0) {
              alert("Please select at least one record to email.");
              return;
            }
            setShowDialog(true);
          }}
        >
          Send Email
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}></th>
            {[
              "Zip Codes",
              "Organization",
              "Address",
              "Telephone",
              "Hours",
              "Assistance Type",
              "Status",
              "Requirements",
            ].map((h) => (
              <th key={h} style={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, index) => (
            <tr key={index}>
              <td style={td}>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td style={td}>{row["Zip Codes"]}</td>
              <td style={td}>{row.Organization}</td>
              <td style={td}>{row.Address}</td>
              <td style={td}>{row.Telephone}</td>
              <td style={td}>{row.Hours}</td>
              <td style={td}>{row["Assistance Type"]}</td>
              <td style={td}>{row.Status}</td>
              <td style={td}>
                <ul>
                  {row.Requirements?.split("\n")
                    .slice(0, 3)
                    .map((r, i) => (
                      <li key={i}>{r.trim()}</li>
                    ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDialog && (
        <EmailDialog
          onClose={() => setShowDialog(false)}
          selectedData={selectedRows.map((i) => filtered[i])}
          userDetails={loggedInUser}
        />
      )}
    </div>
  );
}

export default MainApp;
