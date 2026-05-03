import { Box, Grid } from "@mui/material";
import dayjs from 'dayjs';
import 'dayjs/locale/es';

import WaveInput from "../components/ui/inputs/WaveInput";
import ProfilePicture from "../components/profile/ProfilePicture";
import { useProfileLogic } from "../hooks/profile-page/useProfileLogic";
import { useTranslation } from "react-i18next";

dayjs.locale('es');

const ProfilePage: React.FC = () => {
  const { values, handleChange, handleSave, pfpUrl, handleImageUpload } = useProfileLogic();
  const { t } = useTranslation();

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={5} justifyContent="center" sx={{ px: 2, py: 4 }}>
        <Grid
          size={{ xs: 12, md: 3 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ProfilePicture pfpUrl={pfpUrl} onUpload={handleImageUpload} />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={2} rowSpacing={0}>
            <Grid size={{ xs: 12, md: 6 }}>
              <WaveInput label={t("profile.name")} name="name" value={values.name} onChange={handleChange} required={true} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <WaveInput label={t("profile.surname")} name="surname" value={values.surname} onChange={handleChange} required={true} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <WaveInput label={t("profile.email")} type="email" name="email" value={values.email} onChange={handleChange} required={true} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <WaveInput label={t("profile.phone")} type="tel" name="phone" value={values.phone} onChange={handleChange} required={false} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <WaveInput label={t("profile.birthDate")} type="date" name="birthDate" value={values.birthDate} onChange={handleChange} required={false} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <WaveInput label={t("profile.address")} name="address" value={values.address} onChange={handleChange} required={false} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <WaveInput label={t("profile.city")} name="city" value={values.city} onChange={handleChange} required={false} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <WaveInput label={t("profile.province")} name="province" value={values.province} onChange={handleChange} required={false} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <WaveInput label={t("profile.country")} name="country" value={values.country} onChange={handleChange} required={false} />
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <button className="submit-button" type="button" onClick={handleSave}>
                {t("profile.saveChanges")}
              </button>
            </Grid>
          </Grid>
          
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;