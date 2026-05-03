import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TranslateIcon from '@mui/icons-material/Translate';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button 
      color="inherit" 
      onClick={toggleLanguage}
      startIcon={<TranslateIcon />}
      sx={{ fontWeight: 'bold' }}
    >
      {i18n.language.startsWith('es') ? 'ES' : 'EN'}
    </Button>
  );
}
