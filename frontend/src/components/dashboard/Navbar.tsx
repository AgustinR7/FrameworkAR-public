import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Box, Typography, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../context/AuthProvider';
import { useThemeMode } from '../../context/ThemeContextProvider';
import { config } from '../../config';

import ThemeSwitch from '../ui/buttons/ThemeSwitch';
import LanguageSwitcher from '../ui/buttons/LanguageSwitcher';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}` 
    : user?.username;

  const profilePicUrl = user?.profilePictureUrl 
    ? `${config.apiUrl}${user.profilePictureUrl}` 
    : null;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: mode === 'light' ? "#ffffff" : "#1e1e1e",
        borderBottom: "1px solid",
        borderColor: mode === 'light' ? "#e0e0e0" : "#333333",
        color: mode === 'light' ? "#212121" : "#ffffff",
        transition: "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit" 
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }} 
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <LanguageSwitcher />
          <ThemeSwitch />

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {displayName}
          </Typography>
          
          <IconButton
            title={t('navbar.profile')}
            onClick={() => navigate('/profile')}
            color="inherit" 
          >
            {profilePicUrl ? (
              <Avatar src={profilePicUrl} sx={{ width: 40, height: 40 }} />
            ) : (
              <AccountCircle sx={{ fontSize: 40 }} />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}