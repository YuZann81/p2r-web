export type LayerStatus = "locked" | "idle" | "holding" | "completed";

export type VerificationStage =
  | "verifying"
  | "motion_enter"
  | "motion_exit"
  | "video_ready";

export type LayerDefinition = {
  id: number;
  title: string;
  instruction: string;
};

export type VerificationChallenge = {
  challengeToken: string;
  expiresAt: number;
  layerDurationsMs: [number, number, number];
};

export type VerificationVerifyRequest = {
  challengeToken: string;
  completedDurationsMs: number[];
};

export type VerificationResult = {
  verified: boolean;
  verificationToken: string;
  verifiedAt: number;
  totalHoldMs: number;
};
