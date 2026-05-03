import { Typography, Paper, Box } from '@mui/material';

export default function Home() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold">
        Bienvenido al Sistema
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Dashboard cargado correctamente.
      </Typography>
      
      <Paper sx={{ mt: 4, p: 3, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.6)' }}>
        <Typography color="textSecondary">Contenido del Home</Typography>
      </Paper>
    </Box>
  );
}