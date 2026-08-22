import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import GlobalChatLauncher from "@/components/GlobalChatLauncher";
import { AuthProvider } from "@/lib/auth/auth-context";
import { fetchChatMessages } from "@/lib/api/chat";
import { useRouter } from "next/navigation";

jest.mock("@/lib/api/chat", () => ({
  fetchChatMessages: jest.fn().mockResolvedValue([
    {
      id: "msg-1",
      sender: "admin",
      sender_name: "Admin P2R",
      text: "Halo! Selamat datang di Live Chat.",
      created_at: new Date().toISOString(),
    },
  ]),
  sendChatMessage: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("GlobalChatLauncher Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it("renders floating launcher button with correct accessibility attributes", () => {
    render(
      <AuthProvider>
        <GlobalChatLauncher />
      </AuthProvider>,
    );

    const button = screen.getByRole("button", {
      name: /buka live chat admin support/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("opens Live Chat modal on click and closes when close button is clicked", async () => {
    render(
      <AuthProvider>
        <GlobalChatLauncher />
      </AuthProvider>,
    );

    const launcherButton = screen.getByRole("button", {
      name: /buka live chat admin support/i,
    });

    // Open chat
    fireEvent.click(launcherButton);
    expect(launcherButton).toHaveAttribute("aria-expanded", "true");

    expect(
      await screen.findByText("Admin Support P2R"),
    ).toBeInTheDocument();

    // Close chat via modal close button
    const closeButton = screen.getByRole("button", {
      name: "Tutup modal chat",
    });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Admin Support P2R")).not.toBeInTheDocument();
      expect(launcherButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("closes modal on Escape key press", async () => {
    render(
      <AuthProvider>
        <GlobalChatLauncher />
      </AuthProvider>,
    );

    const launcherButton = screen.getByRole("button", {
      name: /buka live chat admin support/i,
    });

    fireEvent.click(launcherButton);
    expect(await screen.findByText("Admin Support P2R")).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByText("Admin Support P2R")).not.toBeInTheDocument();
      expect(launcherButton).toHaveAttribute("aria-expanded", "false");
    });
  });
});
