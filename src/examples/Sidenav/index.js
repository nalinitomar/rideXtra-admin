import { useEffect } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
// @mui
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Custom Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import { logout } from "../../api/auth";
import { toast } from "react-toastify";

// Context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const location = useLocation();
  const navigate = useNavigate();

  const collapseName = location.pathname.replace("/", "");

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  const textColor =
    transparentSidenav || (whiteSidenav && !darkMode)
      ? "dark"
      : whiteSidenav && darkMode
      ? "inherit"
      : "white";

  useEffect(() => {
    const handleMiniSidenav = () => {
      const isSmall = window.innerWidth < 1200;
      setMiniSidenav(dispatch, isSmall);
      setTransparentSidenav(dispatch, !isSmall && transparentSidenav);
      setWhiteSidenav(dispatch, !isSmall && whiteSidenav);
    };

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, transparentSidenav, whiteSidenav]);

  const handleLogout = async () => {
    try {
      const data = await logout();
      if (data.success === true && data.message === "Admin Logout") {
        toast.success(data.message || "Admin Logout");
        Cookies.remove("token");
        navigate("/authentication/sign-in");
      } else {
        toast.error(data.message || "Admin Logout Failed");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    }
  };

  const renderRoutes = routes.map(({ type, name, icon, key, route }) => {
    if (type !== "collapse") return null;

    return (
      <NavLink key={key} to={route}>
        <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
      </NavLink>
    );
  });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      {/* Brand Section */}
      <MDBox pt={3} pb={1} px={2} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>

        <MDBox
          component={NavLink}
          to="/"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ textDecoration: "none" }}
        >
          {brand && (
            <MDBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ py: 2 }}
            >
              <MDBox
                component="img"
                src={brand}
                alt="Brand"
                sx={{ width: "50px", height: "auto" }}
              />
            </MDBox>
          )}

          {brandName && (
            <MDBox
              width="100%"
              sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
              textAlign="center"
            >
              <MDTypography
                component="h6"
                variant="button"
                fontWeight="medium"
                color={textColor}
              >
                {brandName}
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
      </MDBox>

      <Divider light />
      <List>{renderRoutes}</List>

      {/* Logout Button */}
      <MDBox p={2} mt="auto">
        <MDButton variant="gradient" fullWidth onClick={handleLogout}>
          Logout
        </MDButton>
      </MDBox>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

Sidenav.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
