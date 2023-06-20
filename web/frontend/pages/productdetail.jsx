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
import { ListComponent } from "../components";
import { ListDetailSectionComponent } from "../components";
import { useLocation } from "react-router-dom";



export default function ProductDetail(props) {
  
    const location = useLocation() 
    const data = JSON.parse(location.state) 

  const { t } = useTranslation();
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <ListDetailSectionComponent data ={data} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
