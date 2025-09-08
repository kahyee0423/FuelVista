export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function GET(): Promise<NextResponse> {
  return new Promise<NextResponse>((resolve) => {
    const py = spawn("python", ["./ml_scripts/predict_fuel.py"]);
    let data = "";
    let error = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });

    py.on("close", (code) => {
      if (code !== 0 || error) {
        resolve(
          NextResponse.json({ error: "Prediction failed", details: error }, { status: 500 })
        );
      } else {
        try {
          resolve(NextResponse.json(JSON.parse(data)));
        } catch (e) {
          resolve(
            NextResponse.json({ error: "Invalid JSON from Python", raw: data }, { status: 500 })
          );
        }
      }
    });
  });
}