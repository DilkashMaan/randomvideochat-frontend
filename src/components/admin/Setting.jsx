import React, { useEffect, useState } from "react";
import axiosInstance from "../axios/AxiosInstance"; // Adjust the path to your file
import "./style/adminLayout.css";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const premiumBarData = [
  { name: "Free", count: 3377 },
  { name: "Premium", count: 841 },
];

const COLORS = ["#1E88E5", "#f36b9b"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isPremium = label === "Premium Users";
    const labelColor = isPremium ? "#f36b9b" : "#1E88E5";

    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "0px 10px 13px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginTop: "0px",
        }}
      >
        <p style={{ color: labelColor, fontWeight: 600, marginBottom: 4 }}>
          {label}
        </p>
        <p style={{ color: "#1E88E5", margin: 0 }}>
          count : {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function Setting() {
  const [genderData, setGenderData] = useState([
    { name: "Male", value: 0 },
    { name: "Female", value: 0 },
  ]);
  const [loadingGender, setLoadingGender] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("gender/")
      .then((response) => {
        const data = response.data;
        console.log("data", data);
        setGenderData([
          { name: "Male", value: data.male || 0 },
          { name: "Female", value: data.female || 0 },
        ]);
        setLoadingGender(false);
      })
      .catch((error) => {
        console.error("Error fetching gender data:", error);
        setLoadingGender(false);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title" style={{ marginBottom: "30px" }}>
        Analytics Dashboard
      </h1>

      <div className="cards-container">
        <div className="card">
          <h3>
            <img src="../home-images/active-user.png" alt="Active Users" />
            Logged-in Users
          </h3>
          <p className="stat-value">3,518</p>
        </div>

        <div className="card">
          <h3>
            <img src="../home-images/freemium.png" alt="Premium Conversion" />
            Premium Conversion Rate
          </h3>
          <p className="stat-value red">4%</p>
        </div>

        <div className="card">
          <h3>
            <img src="../home-images/wallet.png" alt="Payments" />
            Payments Not Received
          </h3>
          <p className="stat-value orange">9</p>
        </div>
      </div>

      <div className="gender-premium-ratio">
        <div className="gender-section">
          <h2>Gender Ratio</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              {loadingGender ? (
                <div style={{ textAlign: "center", paddingTop: 100 }}>
                  <p>Loading gender data...</p>
                </div>
              ) : (
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    labelLine={false}


                    // convert number to percent 
                    // label={({ name, percent }) =>
                    //   `${name}: ${(percent * 100).toFixed(0)}%`
                    // }

                    label={({ name, value }) =>
                      `${name}: ${value}`
                    }

                    // both ...percent and number
                    // label={({ name, value, percent }) =>
                    //   `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    // }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="gender-section">
          <h2 style={{ marginBottom: "20px" }}>Premium vs Free Users</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={premiumBarData}
                margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
                barCategoryGap="30%"
              >
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 14, fill: "#ccc" }}
                  axisLine={{ stroke: "#fff" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 14, fill: "#ccc" }}
                  axisLine={{ stroke: "#fff" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={14} />
                <Bar
                  dataKey="count"
                  fill="#1E88E5"
                  radius={[6, 6, 0, 0]}
                  label={{
                    position: "top",
                    fill: "#1E88E5",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
