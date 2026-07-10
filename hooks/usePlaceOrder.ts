import { apiPostForm } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export type PlaceOrderInput = {
  phone: string;
  deliveryMethod?: string;
  delivery?: string;
  name: string;
  address: string;
  city: string;
  postalCode?: string;
  total: string;
  discountedTotal: string;
  cartItemsFormatted: string;
};

export type PlaceOrderResponse = {
  ok: true;
};

function buildPlaceOrderForm(input: PlaceOrderInput): FormData {
  const form = new FormData();
  form.append("phone", input.phone);
  form.append("deliveryMethod", input.deliveryMethod ?? "ship");
  form.append("delivery", input.delivery ?? "ship");
  form.append("name", input.name);
  form.append("address", input.address);
  form.append("city", input.city);
  form.append("postalCode", input.postalCode ?? "");
  form.append("total", input.total);
  form.append("discountedTotal", input.discountedTotal);
  form.append("cartItemsFormatted", input.cartItemsFormatted);
  return form;
}

/** Submit a cart order through the live website cart-order backend. */
export function usePlaceOrder() {
  return useMutation({
    mutationFn: (input: PlaceOrderInput) => {
      return apiPostForm<PlaceOrderResponse>(
        "/cart-order",
        buildPlaceOrderForm(input),
      );
    },
  });
}
