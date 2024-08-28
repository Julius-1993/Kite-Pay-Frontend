import Navigator from "./src/navigator/Navigator";
import { AuthProvider } from "./src/context/AuthContext";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <AuthProvider>
        <Navigator />
    </AuthProvider>
  );
}
