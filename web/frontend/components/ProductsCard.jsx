import React,{ useState } from "react";
import { Card, TextContainer, Text } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();
  const productsCount = 5;

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/all",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });






  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("ProductsCard.productsCreatedToast", {
          count: productsCount,
        }),
      });
    } else {
      setIsLoading(false);
      setToastProps({
        content: t("ProductsCard.errorCreatingProductsToast"),
        error: true,
      });
    }
  };
  const dataArray = isLoadingCount ? [] : data.data;
  return (
    <>
      {toastMarkup}
      <Card
        title={t("ProductsCard.title")}
        sectioned
        primaryFooterAction={{
          content: t("ProductsCard.populateProductsButton", {
            count: productsCount,
          }),
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <table>
          <tbody>
            <tr>
              <td>{t("ProductsCard.description")}</td>
            </tr>
            <tr>
              <td>
                <h4>{t("ProductsCard.totalProductsHeading")}</h4>
                {isLoadingCount ? (
                  <p>-</p>
                ) : dataArray.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>{t("Table.column1")}</th>
                        <th>{t("Table.column2")}</th>
                        {/* Add more table header columns as needed */}
                      </tr>
                    </thead>
                    <tbody>
                      {dataArray.map((item, index) => (
                        <React.Fragment key={index}>
                          {Object.entries(item).map(([key, value]) => (
                            <tr key={key}>
                              <td>{key}</td>
                              <td>
                                {typeof value === "object"
                                  ? JSON.stringify(value)
                                  : value}
                                
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>{t("Table.noDataMessage")}</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </>
  );
}
