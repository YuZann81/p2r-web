import { render, screen } from "@testing-library/react";
import RegisterPage from "@/app/register/page";
import { registerUser } from "@/lib/api/auth";

jest.mock("@/lib/api/auth", () => ({
  loginUser: jest.fn(),
  getCurrentUser: jest.fn().mockRejectedValue(new Error("No user")),
  registerUser: jest.fn(),
  logoutUser: jest.fn(),
}));

const mockedRegisterUser = registerUser as jest.MockedFunction<
  typeof registerUser
>;

describe("RegisterPage (/register)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders the registration heading", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: /daftar akun/i }),
    ).toBeInTheDocument();
  });

  it("does not render a public registration form", () => {
    render(<RegisterPage />);

    expect(screen.queryByLabelText(/^nama lengkap$/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^email$/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^kata sandi$/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /buat akun sekarang/i }),
    ).not.toBeInTheDocument();
  });

  it("explains that accounts are issued by the committee at the booth", () => {
    render(<RegisterPage />);

    expect(screen.getByText(/pendaftaran melalui panitia/i)).toBeInTheDocument();
    expect(screen.getByText(/booth panitia/i)).toBeInTheDocument();
  });

  it("offers only a link to the login page", () => {
    render(<RegisterPage />);

    const loginLink = screen.getByRole("link", {
      name: /masuk ke akun saya/i,
    });
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("never calls the public register endpoint", () => {
    render(<RegisterPage />);

    expect(mockedRegisterUser).not.toHaveBeenCalled();
  });
});
