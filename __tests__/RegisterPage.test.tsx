import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RegisterPage from "@/app/register/page";
import { AuthProvider } from "@/lib/auth/auth-context";
import { registerUser } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("@/lib/api/auth", () => ({
  loginUser: jest.fn(),
  getCurrentUser: jest.fn().mockRejectedValue(new Error("No user")),
  registerUser: jest.fn(),
  logoutUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockedRegisterUser = registerUser as jest.MockedFunction<
  typeof registerUser
>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;

describe("RegisterPage (/register)", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
      bfcacheId: "",
    });
    mockedUseSearchParams.mockReturnValue(new URLSearchParams() as any);
  });

  it("renders register form and links", () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /daftar akun/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^nama lengkap/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^kata sandi/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /buat akun sekarang/i }),
    ).toBeInTheDocument();
  });

  it("submits register form and redirects on success", async () => {
    mockedRegisterUser.mockResolvedValueOnce({
      success: true,
      message: "Registered successfully",
      data: {
        token: "new-token",
        user: { id: 2, name: "New Hero", email: "hero@test.com" },
      },
    });

    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByLabelText(/^nama lengkap/i), {
      target: { value: "New Hero" },
    });
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: "hero@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/^kata sandi/i), {
      target: { value: "secret123" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /buat akun sekarang/i }),
    );

    await waitFor(() => {
      expect(mockedRegisterUser).toHaveBeenCalledWith({
        name: "New Hero",
        email: "hero@test.com",
        password: "secret123",
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
