import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DistributionEditor from "@/components/admin/DistributionEditor";
import type { Distribution } from "@/lib/api/types/karya";

describe("DistributionEditor Component", () => {
  it("renders existing distributions list", () => {
    const distributions: Distribution[] = [
      { platform: "web", type: "p2r_arcade" },
      {
        platform: "windows",
        type: "download",
        url: "https://example.com/game.zip",
      },
    ];
    const onChange = jest.fn();

    render(
      <DistributionEditor distributions={distributions} onChange={onChange} />,
    );

    expect(
      screen.getByText(/Jalur Distribusi Game \(Multi-Distribution\)/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("distribution-item-0")).toBeInTheDocument();
    expect(screen.getByTestId("distribution-item-1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://example.com/game.zip")).toBeInTheDocument();
  });

  it("adds a p2r_arcade preset entry when + P2R Arcade is clicked", () => {
    const distributions: Distribution[] = [];
    const onChange = jest.fn();

    render(
      <DistributionEditor distributions={distributions} onChange={onChange} />,
    );

    const arcadeBtn = screen.getByRole("button", { name: /\+ P2R Arcade/i });
    fireEvent.click(arcadeBtn);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
      { platform: "web", type: "p2r_arcade" },
    ]);
  });

  it("adds a web_external preset entry when + Web External is clicked", () => {
    const distributions: Distribution[] = [];
    const onChange = jest.fn();

    render(
      <DistributionEditor distributions={distributions} onChange={onChange} />,
    );

    const webBtn = screen.getByRole("button", { name: /\+ Web External/i });
    fireEvent.click(webBtn);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
      { platform: "web", type: "web_external", url: "" },
    ]);
  });

  it("adds a download preset entry when + Download is clicked", () => {
    const distributions: Distribution[] = [];
    const onChange = jest.fn();

    render(
      <DistributionEditor distributions={distributions} onChange={onChange} />,
    );

    const downloadBtn = screen.getByRole("button", { name: /\+ Download/i });
    fireEvent.click(downloadBtn);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
      { platform: "windows", type: "download", url: "" },
    ]);
  });

  it("removes a distribution entry when Hapus is clicked", () => {
    const distributions: Distribution[] = [
      { platform: "web", type: "p2r_arcade" },
      { platform: "android", type: "download", url: "https://example.com/app.apk" },
    ];
    const onChange = jest.fn();

    render(
      <DistributionEditor distributions={distributions} onChange={onChange} />,
    );

    const deleteBtn = screen.getByRole("button", {
      name: /Hapus distribusi 1/i,
    });
    fireEvent.click(deleteBtn);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
      { platform: "android", type: "download", url: "https://example.com/app.apk" },
    ]);
  });

  it("updates URL field when user types in the input", () => {
    const distributions: Distribution[] = [
      { platform: "windows", type: "download", url: "" },
    ];
    const onChange = jest.fn();

    render(
      <DistributionEditor distributions={distributions} onChange={onChange} />,
    );

    const urlInput = screen.getByPlaceholderText(/URL direct download/i);
    fireEvent.change(urlInput, {
      target: { value: "https://github.com/org/game/releases/v1.zip" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
      {
        platform: "windows",
        type: "download",
        url: "https://github.com/org/game/releases/v1.zip",
      },
    ]);
  });

  it("p2r_arcade does not render a URL input field", () => {
    const distributions: Distribution[] = [
      { platform: "web", type: "p2r_arcade" },
    ];
    const onChange = jest.fn();

    render(
      <DistributionEditor distributions={distributions} onChange={onChange} />,
    );

    expect(screen.queryByPlaceholderText(/URL/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/P2R Arcade tidak membutuhkan URL eksternal/i),
    ).toBeInTheDocument();
  });
});
