import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { CustomThemeProvider } from './context/ThemeContextProvider'; // <-- Tu nuevo contexto
import Layout from './Layout';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomThemeProvider> 
          <Layout> 
             <AppRouter />
          </Layout>
        </CustomThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;