import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import { useMaterialUIController, setLayout } from "context";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname]);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        // REMOVE padding and use proper margin
        marginLeft: { 
          xs: 0, 
          sm: miniSidenav ? pxToRem(120) : pxToRem(274) 
        },
        width: {
          xs: "100%",
          sm: `calc(100% - ${miniSidenav ? pxToRem(120) : pxToRem(274)})`
        },
        transition: transitions.create(["margin-left", "width"], {
          easing: transitions.easing.easeInOut,
          duration: transitions.duration.standard,
        }),
        position: "relative",
        minHeight: "100vh",
        p: 3, // Keep some padding if you want, but reduce it
      })}
    >
      {children}
    </MDBox>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;