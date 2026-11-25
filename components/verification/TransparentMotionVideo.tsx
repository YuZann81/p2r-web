"use client";

import React, { useEffect, useRef, useState } from "react";
import { MOTION_GRAPHIC_VIDEO_CONFIG } from "@/lib/verification/config";

type TransparentMotionVideoProps = {
  src?: string;
  title?: string;
  onFinished?: () => void;
};

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_video;
  uniform sampler2D u_bg;
  uniform float u_hasBg;
  varying vec2 v_texCoord;

  void main() {
    vec4 fg = texture2D(u_video, v_texCoord);
    vec4 bg = texture2D(u_bg, v_texCoord);

    float luma = dot(fg.rgb, vec3(0.299, 0.587, 0.114));
    float bgLuma = dot(bg.rgb, vec3(0.299, 0.587, 0.114));
    float maxCh = max(fg.r, max(fg.g, fg.b));
    float diff = u_hasBg > 0.5 ? length(fg.rgb - bg.rgb) : maxCh;

    // Pastikan piksel gelap / ekor fade hitam tidak pernah menjadi lingkaran hitam solid
    float darkGate = smoothstep(0.06, 0.19, maxCh);
    float diffAlpha = u_hasBg > 0.5 ? smoothstep(0.06, 0.18, diff) : 1.0;
    float glowGate = u_hasBg > 0.5 ? smoothstep(-0.02, 0.08, luma - bgLuma * 0.85) : 1.0;

    float alpha = clamp(darkGate * diffAlpha * max(glowGate, smoothstep(0.18, 0.34, diff)), 0.0, 1.0);

    gl_FragColor = vec4(fg.rgb * alpha, alpha);
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Memutar seluruh video motion graphic secara penuh (tanpa terpotong atas/bawah/durasi)
 * dengan background transparan real-time via WebGL difference-keying.
 */
export default function TransparentMotionVideo({
  src = MOTION_GRAPHIC_VIDEO_CONFIG.src,
  title = MOTION_GRAPHIC_VIDEO_CONFIG.title,
  onFinished,
}: TransparentMotionVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const finishedRef = useRef(false);
  const onFinishedRef = useRef(onFinished);
  const [useCanvasKeying, setUseCanvasKeying] = useState(true);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  const triggerFinished = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinishedRef.current?.();
  };

  useEffect(() => {
    finishedRef.current = false;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
      });
    } catch {
      gl = null;
    }

    if (!gl) {
      setUseCanvasKeying(false);
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      setUseCanvasKeying(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setUseCanvasKeying(false);
      return;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setUseCanvasKeying(false);
      return;
    }

    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]),
      gl.STATIC_DRAW,
    );
    const texLoc = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    const createVideoTexture = () => {
      const texture = gl!.createTexture();
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      return texture;
    };

    const videoTexture = createVideoTexture();
    const bgTexture = createVideoTexture();
    gl.uniform1i(gl.getUniformLocation(program, "u_video"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "u_bg"), 1);
    const hasBgLoc = gl.getUniformLocation(program, "u_hasBg");

    let hasBgPlate = false;
    let rafId = 0;

    const renderFrame = () => {
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          gl!.viewport(0, 0, canvas.width, canvas.height);
        }

        if (!hasBgPlate && video.currentTime <= 0.35) {
          gl!.activeTexture(gl!.TEXTURE1);
          gl!.bindTexture(gl!.TEXTURE_2D, bgTexture);
          gl!.texImage2D(
            gl!.TEXTURE_2D,
            0,
            gl!.RGBA,
            gl!.RGBA,
            gl!.UNSIGNED_BYTE,
            video,
          );
          hasBgPlate = true;
        }

        gl!.uniform1f(hasBgLoc, hasBgPlate ? 1.0 : 0.0);
        gl!.activeTexture(gl!.TEXTURE0);
        gl!.bindTexture(gl!.TEXTURE_2D, videoTexture);
        gl!.texImage2D(
          gl!.TEXTURE_2D,
          0,
          gl!.RGBA,
          gl!.RGBA,
          gl!.UNSIGNED_BYTE,
          video,
        );

        gl!.clearColor(0, 0, 0, 0);
        gl!.clear(gl!.COLOR_BUFFER_BIT);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      }

      // Lewati jeda kosong akhir video supaya Video 2 cepat fade-in tepat setelah blok 3D selesai
      if (
        Number.isFinite(video.duration) &&
        video.duration > 2.2 &&
        video.currentTime >= video.duration - 2.0
      ) {
        triggerFinished();
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(rafId);
      gl?.deleteTexture(videoTexture);
      gl?.deleteTexture(bgTexture);
      gl?.deleteBuffer(posBuffer);
      gl?.deleteBuffer(texBuffer);
      gl?.deleteProgram(program);
      gl?.deleteShader(vs);
      gl?.deleteShader(fs);
    };
  }, [src]);

  return (
    <div
      data-testid="transparent-motion-video"
      data-chroma-keyed={useCanvasKeying ? "webgl" : "blend"}
      className="relative flex h-full w-full items-center justify-center pointer-events-none select-none"
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label={title}
        onEnded={triggerFinished}
        onError={triggerFinished}
        onContextMenu={(e) => e.preventDefault()}
        className={
          useCanvasKeying
            ? "pointer-events-none absolute h-px w-px opacity-0"
            : "pointer-events-none h-full w-full select-none object-contain mix-blend-screen"
        }
      />

      {useCanvasKeying && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none h-full w-full object-contain"
        />
      )}
    </div>
  );
}
