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
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import { LayoutSection } from "../components";

const data = [
  "Apple",
  "Banana",
  "Cherry",
  "Durian",
  "Elderberry",
  "Fig",
  "Grapefruit",
];
export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <Link url="/product">product</Link>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
