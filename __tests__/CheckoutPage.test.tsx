import CheckoutPage from "@/app/checkout/page";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("CheckoutPage", () => {
  it("redirects to /merchandise since e-commerce checkout is disabled", () => {
    CheckoutPage();
    expect(redirect).toHaveBeenCalledWith("/merchandise");
  });
});
