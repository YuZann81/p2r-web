import { act, fireEvent, render, screen } from "@testing-library/react";
import ThreeLayerHoldVerification from "@/components/verification/ThreeLayerHoldVerification";
import {
  issueVerificationChallenge,
  validateAndConsumeChallenge,
} from "@/lib/verification/server-token";

describe("ThreeLayerHoldVerification 6-Stage (2s) Right-Hand -> Fullscreen Motion -> Video 2", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-11-26T01:00:00Z"));

    global.fetch = jest.fn(async (input, init) => {
      const url = typeof input === "string" ? input : input.toString();
      const body = init?.body ? JSON.parse(String(init.body)) : {};

      if (url.includes("/api/verification/challenge")) {
        const challenge = issueVerificationChallenge(body.layerDurationsMs);
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, data: challenge }),
        } as Response;
      }

      if (url.includes("/api/verification/verify")) {
        const outcome = validateAndConsumeChallenge({
          challengeToken: body.challengeToken,
          completedDurationsMs: body.completedDurationsMs,
        });
        if (!outcome.ok) {
          return {
            ok: false,
            status: outcome.status,
            json: async () => ({ success: false, message: outcome.message }),
          } as Response;
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, data: outcome.result }),
        } as Response;
      }

      throw new Error(`Unexpected fetch URL: ${url}`);
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.useRealTimers();
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("renders 6-stage right-hand biometric scanner (2s default) with 5 fingertip dots and resets on early release", async () => {
    render(<ThreeLayerHoldVerification />);
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryAllByRole("progressbar")).toHaveLength(0);
    expect(document.querySelectorAll("[data-fingertip-dot]")).toHaveLength(5);
    expect(document.querySelectorAll("[data-step-dot]")).toHaveLength(6);
    expect(
      screen.getByText("VERIFICATION PLAY • TAHAP 1 / 6"),
    ).toBeInTheDocument();

    const holdBtn = screen.getByRole("button", { name: /tahan layer 1/i });
    expect(holdBtn).toHaveClass("border-0", "bg-transparent");
    const stageEl = screen.getByTestId("active-fingerprint-stage");

    fireEvent.pointerDown(holdBtn, { pointerId: 1, button: 0, pointerType: "mouse" });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(Number(stageEl.getAttribute("data-progress"))).toBeGreaterThan(25);

    fireEvent.pointerUp(holdBtn, { pointerId: 1, button: 0, pointerType: "mouse" });
    expect(stageEl).toHaveAttribute("data-progress", "0");
    expect(
      screen.getByText(/verifikasi gagal, silahkan tempelkan tangan anda/i),
    ).toBeInTheDocument();
  });

  it("cancels and resets hold when window blurs / page becomes hidden", async () => {
    render(<ThreeLayerHoldVerification />);
    await act(async () => {
      await Promise.resolve();
    });

    const holdBtn = screen.getByRole("button", { name: /tahan layer 1/i });
    const stageEl = screen.getByTestId("active-fingerprint-stage");
    fireEvent.pointerDown(holdBtn, { pointerId: 2, pointerType: "touch" });
    act(() => {
      jest.advanceTimersByTime(900);
    });

    act(() => {
      window.dispatchEvent(new Event("blur"));
    });

    expect(stageEl).toHaveAttribute("data-progress", "0");
  });

  it("completes all 6 sequential 2s right-hand holds, plays transparent fullscreen motion video, then reveals clean non-clickable Video 2", async () => {
    const onComplete = jest.fn();
    render(
      <ThreeLayerHoldVerification
        motionVideoSrc="/videos/test-motion.mp4"
        videoSrc="/videos/test-doc.mp4"
        onVerificationComplete={onComplete}
      />,
    );

    await act(async () => {
      await Promise.resolve();
    });

    for (let step = 1; step <= 6; step += 1) {
      expect(
        screen.getByText(`VERIFICATION PLAY • TAHAP ${step} / 6`),
      ).toBeInTheDocument();

      fireEvent.pointerDown(
        screen.getByRole("button", { name: new RegExp(`tahan layer ${step}`, "i") }),
        {
          pointerId: step,
          button: 0,
          pointerType: step % 2 === 1 ? "mouse" : "touch",
        },
      );

      await act(async () => {
        jest.advanceTimersByTime(2100);
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(screen.getByText("verification success")).toBeInTheDocument();
      expect(screen.getByTestId("palm-center-check")).toBeInTheDocument();

      await act(async () => {
        jest.advanceTimersByTime(700 + 460);
        await Promise.resolve();
      });
    }

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0].verified).toBe(true);

    const motionEnter = screen.getByRole("status", {
      name: /verifikasi 3-layer berhasil/i,
    });
    expect(motionEnter).toHaveAttribute("data-fullscreen-motion", "true");
    expect(motionEnter).toHaveAttribute("data-motion-phase", "enter");

    const motionContainer = screen.getByTestId("transparent-motion-video");
    const motionVideoEl = motionContainer.querySelector("video") as HTMLVideoElement;
    expect(motionVideoEl).toHaveAttribute("src", "/videos/test-motion.mp4");
    expect(motionVideoEl).toHaveAttribute("autoplay");

    fireEvent.ended(motionVideoEl);
    expect(motionEnter).toHaveAttribute("data-motion-phase", "exit");

    act(() => {
      jest.advanceTimersByTime(380);
    });

    const videoPanel = screen.getByTestId("documentation-video-panel");
    expect(videoPanel).toBeInTheDocument();
    expect(videoPanel).toHaveClass("pointer-events-none", "select-none");
    expect(videoPanel.querySelectorAll("button")).toHaveLength(0);
    expect(videoPanel.querySelectorAll("img")).toHaveLength(0);

    const videoEl = videoPanel.querySelector("video") as HTMLVideoElement;
    expect(videoEl).toHaveAttribute("src", "/videos/test-doc.mp4");
    expect(videoEl).not.toHaveAttribute("controls");
    expect(videoEl).toHaveAttribute("autoplay");
    expect(videoEl).toHaveAttribute("loop");
  });
});
