"use client"

import useTranslator from "@/hooks/useTranslator"

const Register = () => {
  const { t } = useTranslator()
  return (
    <div>{t("auth.register")}</div>
  )
}
export default Register