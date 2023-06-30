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

import { useTranslation, Trans } from "react-i18next";
import { ListDetailComponent } from "../components";
export default function ProductDetail(props) {
  const { t } = useTranslation();
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <ListDetailComponent  />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
