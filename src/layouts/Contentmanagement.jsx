import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Card,
  Typography,
  CircularProgress,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { toast } from "react-toastify";
import { updateStatic } from "api/data";
import { getStatic } from "api/data";

// Mock API functions
const fetchContent = async (type) => {
  // Replace with real API call
  return localStorage.getItem(type) || "";
};

const saveContent = async (type, content) => {
  // Replace with real API call
  localStorage.setItem(type, content);
  return true;
};

function ContentManagement() {
  const [activeTab, setActiveTab] = useState("terms");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
const [noData, setNoData] = useState(false);


  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleSave = async () => {
    setLoading(true);
    const success = await updateStatic({
        type:activeTab=='terms' ? 'TERMCONDITION' :'POLICY',
        content:content
    });
    setLoading(false);
    if (success) toast.success(`${activeTab.toUpperCase()} saved successfully`);
    else toast.error("Failed to save content");
  };

const loadContent = async () => {
  setLoading(true);
  setError(false);
  setNoData(false);

  try {
    const data = await getStatic(activeTab === "terms" ? "TERMCONDITION" : "POLICY");
    
    if (!data || !data.data || !data.data.content) {
      setNoData(true);
      setContent("");
    } else {
      setContent(data.data.content);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setError(true);
    setContent("");
  }

  setLoading(false);
};


  useEffect(() => {
    loadContent();
  }, [activeTab]);

  return (
    <DashboardLayout>
              <DashboardNavbar/>

      <Box p={3}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Content Management
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 2 }}
          >
            <Tab label="Terms & Conditions" value="terms" />
            <Tab label="Privacy Policy" value="privacy" />
          </Tabs>

          {loading ? (
  <CircularProgress />
) : error ? (
  <Typography color="error" mt={2}>Network error occurred. Please try again later.</Typography>
) : noData ? (
  <Typography color="textSecondary" mt={2}>No content found for this section.</Typography>
) : (
            <>
              <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                style={{ height: "300px", marginBottom: "20px" }}
              />
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{ textTransform: "none", fontWeight: "bold" , color:'white' }}
              >
                Save {activeTab === "terms" ? "Terms & Conditions" : "Privacy Policy"}
              </Button>
            </>
          )}
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default ContentManagement;
