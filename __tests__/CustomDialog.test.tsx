import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CustomDialog } from "@/components/ui/CustomDialog";

describe("CustomDialog Component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <CustomDialog
        isOpen={false}
        onClose={jest.fn()}
        title="Tutup Percakapan?"
        description="Sesi ini akan ditutup."
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title, description, and triggers onConfirm and onClose", () => {
    const handleClose = jest.fn();
    const handleConfirm = jest.fn();

    render(
      <CustomDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Tutup Percakapan?"
        description="Sesi ini akan ditutup."
        confirmText="Tutup Sekarang"
        cancelText="Batal"
        variant="confirmation"
        confirmVariant="danger"
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Tutup Percakapan?")).toBeInTheDocument();
    expect(screen.getByText("Sesi ini akan ditutup.")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /tutup sekarang/i });
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    const cancelBtn = screen.getByRole("button", { name: /batal/i });
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape key press", () => {
    const handleClose = jest.fn();

    render(
      <CustomDialog
        isOpen={true}
        onClose={handleClose}
        title="Info Pameran"
        description="Lokasi di Cyber Hall."
      />,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
