import { submitCheckout } from "@/lib/api/checkout";
import { apiPost } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiPost: jest.fn(),
}));

const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

describe("Checkout API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls /checkout with payload and auth token", async () => {
    const payload = {
      customer_name: "Player One",
      customer_phone: "081234567890",
      items: [{ product_id: "prod-1", quantity: 2 }],
    };

    mockedApiPost.mockResolvedValueOnce({
      success: true,
      message: "Order placed successfully",
      data: {
        id: "order-101",
        customer_name: "Player One",
        status: "pending",
      },
    });

    const result = await submitCheckout(payload, "auth-token-123");

    expect(mockedApiPost).toHaveBeenCalledWith("/checkout", payload, {
      token: "auth-token-123",
    });
    expect(result.data?.id).toBe("order-101");
  });
});
