import { Grid, Paper, Typography, Box, Link } from "@mui/material";
import BubbleButton from "../ui/buttons/BubbleButton";
import WaveInput from "../ui/inputs/WaveInput";
import { useThemeMode } from "../../context/ThemeContextProvider";
import { useTranslation } from "react-i18next";

interface AuthFormProps {
  isRegistering: boolean;
  setIsRegistering: (val: boolean) => void;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAuth: (e: React.FormEvent) => void;
}

export default function AuthForm({
  isRegistering,
  setIsRegistering,
  formData,
  handleChange,
  handleAuth,
}: AuthFormProps) {
  const { mode } = useThemeMode();
  const { t } = useTranslation();

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100%", width: "100%", pt: 10 }}
    >
      <Grid size={{ xs: 11, sm: 8, md: 6, lg: 5 }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            width: "100%",
            bgcolor: mode === 'dark' ? '#1e1e1e' : '#ffffff',
            color: mode === 'dark' ? '#eeeeee' : '#212121',
            backdropFilter: "blur(10px)",
            transition: "background-color 0.5s ease, color 0.5s ease",
            border: mode === 'dark' ? '1px solid #333' : 'none',
          }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 3, color: 'inherit' }}
          >
            {isRegistering ? t("auth.createAccount") : t("auth.welcome")}
          </Typography>

          <form onSubmit={handleAuth} style={{ width: "100%" }}>
            <Grid container spacing={1}>
              {isRegistering && (
                <Grid size={{ xs: 12 }}>
                  <WaveInput
                    label={t("auth.username")}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Grid>
              )}
              <Grid size={{ xs: 12 }}>
                <WaveInput
                  label={t("auth.email")}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <WaveInput
                  label={t("auth.password")}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>

              <Grid
                size={{ xs: 12 }}
                sx={{ mt: 4, display: "flex", justifyContent: "center" }}
              >
                <Box sx={{ width: "45%", height: 56 }}>
                  <BubbleButton
                    text={isRegistering ? t("auth.register") : t("auth.login")}
                    type="submit"
                  />
                </Box>
              </Grid>
            </Grid>
          </form>

          <Box mt={4} textAlign="center">
            <Link
              component="button"
              variant="body1"
              onClick={() => setIsRegistering(!isRegistering)}
              underline="hover"
              sx={{ color: mode === 'dark' ? '#4dabf7' : '#1976d2' }}
            >
              {isRegistering
                ? t("auth.alreadyHaveAccount")
                : t("auth.dontHaveAccount")}
            </Link>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}