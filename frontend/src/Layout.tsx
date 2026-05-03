import { Grid, Box } from "@mui/material";
import { useAuth } from "./context/AuthProvider";
import Logo from "./components/Logo";
import FloatingChat from "./components/ui/chat/FloatingChat";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: 'background.default', 
        position: "relative",
        overflow: "hidden",
        transition: "background-color 0.5s ease, color 0.5s ease",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          zIndex: (theme) => theme.zIndex.drawer + 3,
          transition: "all 0.8s cubic-bezier(0.5, -0.1, 0.1, 1.2)",
          display: "flex",
          alignItems: "center",
          gap: 2,
          ...(isAuthenticated
            ? {
                top: { xs: "28px", sm: "32px" },
                left: { xs: "135px", sm: "145px" },
                transform: "translate(-50%, -50%)",
              }
            : {
                top: "15%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }),
        }}
      >
        <Logo
          sx={{
            width: isAuthenticated ? "170px" : "min(350px, 80vw)",
            height: "auto",
            transition: "width 0.8s cubic-bezier(0.5, -0.1, 0.1, 1.2)",
          }}
        />
      </Box>

      <Box sx={{ width: "100%", height: "100%" }}>{children}</Box>
      {isAuthenticated && <FloatingChat />}
    </Grid>
  );
}