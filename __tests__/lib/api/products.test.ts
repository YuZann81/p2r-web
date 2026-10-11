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

  it("calls apiGet with /merchandises endpoint and returns product list", async () => {
    const mockProducts = [
      {
        id: "prod-1",
        name: "Cyber T-Shirt",
        slug: "cyber-t-shirt",
        description: "Official arcade t-shirt",
        coin_price: 85000,
        source_type: "organizer",
        image_url: "https://example.com/shirt.png",
      },
    ]

    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "Products retrieved",
      data: mockProducts,
    })

    const result = await fetchProducts()

    expect(mockedApiGet).toHaveBeenCalledWith("/merchandises")
    expect(result[0]?.name).toBe("Cyber T-Shirt")
    expect(result[0]?.coin_price).toBe(85000)
    expect(result[0]?.source_type).toBe("organizer")
  })

  it("returns empty array when API throws an error", async () => {
    mockedApiGet.mockRejectedValueOnce(new Error("Network Error"))

    const result = await fetchProducts()

    expect(mockedApiGet).toHaveBeenCalledWith("/merchandises")
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
