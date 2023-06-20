import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import { LayoutSection } from "../components";
 import { ListComponent } from "../components";
 


 const data2 = {
  pageTitle: "Product detail",
  sections: [
    {
      sectionTitle: "Section 1",
      items: [
        {
          title: "Item 1",
          value: "Value 2",
          button: {
            disabled: true,
            buttonName: "add discription",
            function: function (event) {},
          },
        },
      ],
    },
    {
      sectionTitle: "Section 2",
      items: [
        { title: "Item 4", value: "Value 4" },
        { title: "Item 5", value: "Value 5" },
        { title: "Item 6", value: "Value 6" },
      ],
    },
    {
      sectionTitle: "Section 3",
      items: [
        { title: "Item 7", value: "Value 7" },
        { title: "Item 8", value: "Value 8" },
        { title: "Item 9", value: "Value 9" },
      ],
    },
  ],
 };





export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page narrowWidth>
  
      <Layout>   
       
        <Layout.Section>
         
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
