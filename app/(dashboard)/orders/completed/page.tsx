import { Suspense } from "react";
import OrdersClient from "../OrdersClient";

export default function CompletedOrdersPage() {
  return (
    <Suspense fallback={<div>Loading completed orders...</div>}>
      <OrdersClient mode="completed" />
    </Suspense>
  );
}
