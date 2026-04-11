import Login from "../../Components/Auth/Login";
import { Title } from "react-head";
import { useTranslation } from "react-i18next";

function LoginPage() {
  const { t } = useTranslation("common");

  return (
    <>
      <Title>{t("login.meta")}</Title>
      <Login />
    </>
  );
}

export default LoginPage;