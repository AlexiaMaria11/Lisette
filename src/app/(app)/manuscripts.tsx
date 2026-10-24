import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";

import { Button } from "@/ui/button";
import { Screen } from "@/ui/screen";
import { colors, fonts } from "@/ui/theme";

// Authenticated placeholder; the manuscripts feature arrives with plan 02.
export default function Manuscripts() {
  const { t } = useTranslation();

  return (
    <Screen
      title={t("manuscripts.title")}
      footer={<Button label={t("nav.settings")} variant="secondary" onPress={() => router.push("/settings")} />}
    >
      <Text style={styles.body}>{t("manuscripts.comingSoon")}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { fontFamily: fonts.ui, fontSize: 17, lineHeight: 25, color: colors.inkMuted },
});
