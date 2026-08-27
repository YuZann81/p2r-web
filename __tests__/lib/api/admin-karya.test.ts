import {
  fetchAdminKaryas,
  fetchAdminKaryaById,
  createAdminKarya,
  updateAdminKarya,
  deleteAdminKarya,
} from "@/lib/api/karya";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPut: jest.fn(),
  apiDelete: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;
const mockedApiPut = apiPut as jest.MockedFunction<typeof apiPut>;
const mockedApiDelete = apiDelete as jest.MockedFunction<typeof apiDelete>;

describe("Admin Karya API Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetchAdminKaryas calls GET /admin/karyas with auth token", async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "Karya items retrieved.",
      data: [],
    });

    await fetchAdminKaryas("admin-jwt-token");

    expect(mockedApiGet).toHaveBeenCalledWith("/admin/karyas", {
      token: "admin-jwt-token",
    });
  });

  it("fetchAdminKaryaById calls GET /admin/karyas/{id} with encoded ID", async () => {
    mockedApiGet.mockResolvedValueOnce({
      success: true,
      message: "Karya detail retrieved.",
      data: { id: "karya-uuid-1" } as any,
    });

    await fetchAdminKaryaById("karya-uuid-1", "admin-token");

    expect(mockedApiGet).toHaveBeenCalledWith("/admin/karyas/karya-uuid-1", {
      token: "admin-token",
    });
  });

  it("createAdminKarya calls POST /admin/karyas with payload including distributions", async () => {
    const payload = {
      title: "New Arcade Game",
      category: "game" as const,
      distributions: [
        {
          platform: "web" as const,
          type: "p2r_arcade" as const,
        },
      ],
    };

    mockedApiPost.mockResolvedValueOnce({
      success: true,
      message: "Karya created.",
      data: { id: "karya-1" } as any,
    });

    await createAdminKarya(payload, "admin-token");

    expect(mockedApiPost).toHaveBeenCalledWith("/admin/karyas", payload, {
      token: "admin-token",
    });
  });

  it("updateAdminKarya calls PUT /admin/karyas/{id} with partial payload", async () => {
    const payload = {
      title: "Updated Title",
      distributions: [
        {
          platform: "windows" as const,
          type: "download" as const,
          url: "https://example.com/app.zip",
        },
      ],
    };

    mockedApiPut.mockResolvedValueOnce({
      success: true,
      message: "Karya updated.",
      data: { id: "karya-1" } as any,
    });

    await updateAdminKarya("karya-1", payload, "admin-token");

    expect(mockedApiPut).toHaveBeenCalledWith(
      "/admin/karyas/karya-1",
      payload,
      {
        token: "admin-token",
      },
    );
  });

  it("deleteAdminKarya calls DELETE /admin/karyas/{id}", async () => {
    mockedApiDelete.mockResolvedValueOnce({
      success: true,
      message: "Karya deleted.",
      data: null,
    });

    await deleteAdminKarya("karya-1", "admin-token");

    expect(mockedApiDelete).toHaveBeenCalledWith("/admin/karyas/karya-1", {
      token: "admin-token",
    });
  });
});
