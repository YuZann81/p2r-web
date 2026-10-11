import { render, screen } from "@testing-library/react";
import ChatAdminModal from "@/components/ChatAdmin";
import { AuthProvider } from "@/lib/auth/auth-context";

describe("ChatAdminModal", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function renderModal() {
    return render(
      <AuthProvider>
        <ChatAdminModal onClose={jest.fn()} />
      </AuthProvider>,
    );
  }

  it("renders as a labelled dialog", () => {
    renderModal();

    expect(
      screen.getByRole("dialog", { name: /helpdesk/i }),
    ).toBeInTheDocument();
  });

  it("greets the visitor without simulating an agent reply", () => {
    renderModal();

    expect(screen.getByText(/halo/i)).toBeInTheDocument();
  });

  it("shows the verified official committee contact", () => {
    renderModal();

    const mailto = screen.getByRole("link", { name: "rpl@smkn4bdg.sch.id" });
    expect(mailto).toHaveAttribute("href", "mailto:rpl@smkn4bdg.sch.id");
  });

  it("exposes no message composer", () => {
    renderModal();

    expect(
      screen.queryByPlaceholderText(/tulis pesan/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /kirim pesan/i }),
    ).not.toBeInTheDocument();
  });

  it("closes via the close button", () => {
    const onClose = jest.fn();
    render(
      <AuthProvider>
        <ChatAdminModal onClose={onClose} />
      </AuthProvider>,
    );

    screen.getByRole("button", { name: "Tutup helpdesk" }).click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
