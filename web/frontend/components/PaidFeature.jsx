import { useState,useEffect  } from "react";
import { Card } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";


export function PaidFeature() {
  const [isLoading, setIsLoading] = useState(false);
  const [toastProps, setToastProps] = useState({ content: null });
  const fetch = useAuthenticatedFetch();

  /*
   * This will use the authenticated fetch hook to make a request to our server
   * to create a usage record. If the usage record is created successfully, we
   * will set the toastProps to display a success message. If the usage record
   * is not created successfully, we will set the toastProps to display an error
   * If the usage record is not created successfully because the capacity has
   * been reached, we will set the capacityReached state to true so that the
   * button is disabled.
   */
  const handleCreateUsageRecord = async () => {
    setIsLoading(true);
    const response = await fetch("/api/usage/create",{method:'GET'});
    setIsLoading(false);

    if (response.ok) {
      setToastProps({ content: "Usage record created!" });
    } else {
      setToastProps({
        content: "There was an error creating usage record",
        error: true,
      });
    }
  };
  useEffect(() => {

  })
  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps({ content: null })} />
  );

  return (
    <>
      {toastMarkup}
      <Card
        title="Usage Billing"
        sectioned
        primaryFooterAction={{
          content: "Create Usage Record",
          onAction: handleCreateUsageRecord,
          loading: isLoading,
        }}
      >
        <p>Use this feature! (Will be charged for usage)</p>
      </Card>
    </>
  );



  
}