import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { AuthProvider } from "@/lib/auth/auth-context";
import { loginUser } from "@/lib/api/auth";
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

const mockedLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;

describe("LoginPage (/login)", () => {
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
    });
    mockedUseSearchParams.mockReturnValue(new URLSearchParams() as any);
  });

  it("renders login form and links", () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /masuk akun/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^kata sandi$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /masuk ke akun/i }),
    ).toBeInTheDocument();
  });

  it("submits login form and redirects to intended destination on success", async () => {
    const searchParams = new URLSearchParams({
      redirect: "/merchandise",
      action: "order",
      productId: "prod-1",
    });
    mockedUseSearchParams.mockReturnValue(searchParams as any);

    mockedLoginUser.mockResolvedValueOnce({
      success: true,
      message: "Login successful",
      data: {
        token: "sample-token",
        user: { id: 1, name: "Player One", email: "player@test.com" },
      },
    });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "player@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/^kata sandi$/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /masuk ke akun/i }));

    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledWith({
        email: "player@test.com",
        password: "password123",
      });
      expect(mockPush).toHaveBeenCalledWith(
        "/merchandise?action=order&productId=prod-1",
      );
    });
  });

  it("displays error message when login fails", async () => {
    mockedLoginUser.mockRejectedValueOnce(
      new Error("Email atau kata sandi salah."),
    );

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/^kata sandi$/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /masuk ke akun/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Email atau kata sandi salah.",
      );
    });
  });
});
