import { Suspense } from "react";
import OrdersClient from "../OrdersClient";

export default function PendingOrdersPage() {
  return (
    <Suspense fallback={<div>Loading pending orders...</div>}>
      <OrdersClient mode="pending" />
    </Suspense>
  );
}
