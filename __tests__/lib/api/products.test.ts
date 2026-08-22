import { fetchProducts } from "@/lib/api/products"
import { apiGet } from "@/lib/api/client"

jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
}))

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>

describe("fetchProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("calls apiGet with /products endpoint and returns product list", async () => {
    const mockProducts = [
      {
        id: "prod-1",
        name: "Cyber T-Shirt",
        slug: "cyber-t-shirt",
        description: "Official arcade t-shirt",
        price: 85000,
        image_url: "https://example.com/shirt.png",
      },
    ]

    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "Products retrieved",
      data: mockProducts,
    })

    const result = await fetchProducts()

    expect(mockedApiGet).toHaveBeenCalledWith("/products")
    expect(result).toEqual(mockProducts)
  })

  it("returns empty array when API throws an error", async () => {
    mockedApiGet.mockRejectedValueOnce(new Error("Network Error"))

    const result = await fetchProducts()

    expect(mockedApiGet).toHaveBeenCalledWith("/products")
    expect(result).toEqual([])
  })

  it("returns empty array when payload data is null or undefined", async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "No products",
      data: (null as unknown) as [],
    })

    const result = await fetchProducts()

    expect(result).toEqual([])
  })
})
