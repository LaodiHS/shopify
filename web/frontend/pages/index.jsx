import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";
import { IonNav, IonContent } from "@ionic/react";
import { useTranslation, Trans } from "react-i18next";

import { ProductsCard } from "../components";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Layout.Section>
      <ProductsCard />
    </Layout.Section>
  );
}
