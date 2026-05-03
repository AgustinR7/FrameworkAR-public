import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthProvider';
import UserControlTab from '../components/admin/UserControlTab';
import { useTranslation } from 'react-i18next';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ flexGrow: 1, padding: '24px', overflowY: 'auto' }}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [value, setValue] = useState(0);
  const { t } = useTranslation();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
        {t("settings.title")}
      </Typography>
      
      <Paper sx={{ 
        flexGrow: 1, 
        bgcolor: 'background.paper', 
        display: 'flex', 
        height: 'calc(100vh - 150px)',
        borderRadius: 2
      }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: 'divider', minWidth: 200 }}
        >
          <Tab label={t("settings.general")} {...a11yProps(0)} />
          {isAdmin && <Tab label={t("settings.userControl")} {...a11yProps(1)} />}
          {/* Work in progress */}
        </Tabs>
        
        <TabPanel value={value} index={0}>
          <Typography variant="h6">{t("settings.generalConfig")}</Typography>
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            {t("settings.noConfig")}
          </Typography>
        </TabPanel>
        
        {isAdmin && (
          <TabPanel value={value} index={1}>
            <UserControlTab />
          </TabPanel>
        )}
      </Paper>
    </Box>
  );
}
