import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Box, Toolbar, Divider 
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutButton from "../ui/buttons/LogoutButton";

import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: "temporary" | "persistent" | "permanent";
  onLogout: () => void;
}

export default function Sidebar({
  open,
  onClose,
  variant = "temporary",
  onLogout,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { text: t("sidebar.home"), icon: <HomeIcon />, path: "/" },
    { text: t("sidebar.profile"), icon: <PeopleIcon />, path: "/profile" },
    { text: t("sidebar.settings"), icon: <SettingsIcon />, path: "/settings" },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              selected={location.pathname === item.path}
            >
              <ListItemIcon 
                sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Divider sx={{ my: 2, width: "80%", alignSelf: "center" }} />
      
      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 2 }}
      >
        <LogoutButton onClick={onLogout} />
      </Box>
    </Box>
  );

  return (
    <Box component="nav">
      <Drawer
        variant={variant}
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}