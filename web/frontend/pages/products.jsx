import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
  LegacyCard,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";
import { Search } from "../components";
import { ProductsCard } from "../components";
import { LayoutSection } from "../components";


export default function Products() {
  const { t } = useTranslation();
  return (
    <>
     
      <Search />
    </>
  );
}
