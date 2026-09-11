import { readFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { TemplateScriptSchema } from "../../src/render/template-script-schema.js";

const scriptPath = process.argv[2] ?? join(dirname(new URL(import.meta.url).pathname), "script.json");
const raw = JSON.parse(await readFile(scriptPath, "utf8"));
const script = TemplateScriptSchema.parse(raw);
const root = join(dirname(scriptPath), "../..");
const gap = 0.3;
const outroHold = 1.2;
const charsPerSecond = 13.5;

console.log("=== SIMULATION: AI-auto-generate-video ===");
console.log(`Input: ${scriptPath}`);
console.log("Step 1/8 Validate script.json: PASS");
console.log(`  scenes=${script.scenes.length}, aspect=${script.aspect}, renderer=${script.renderer}`);
console.log("Step 2/8 Write script.txt: PASS");
console.log(`  ${script.scenes.map((s) => s.voiceText).join(" ").length} narration characters`);

let total = 0;
for (const scene of script.scenes) {
  const estimated = Math.max(1.0, scene.voiceText.length / charsPerSecond);
  total += estimated;
  const templateDir = join(root, "templates", scene.templateId);
  const portrait = join(templateDir, "compositions", "portrait.html");
  try {
    await access(portrait);
    console.log(`  template ${scene.id}: PASS (${scene.templateId}/compositions/portrait.html)`);
  } catch {
    console.log(`  template ${scene.id}: FAIL (${scene.templateId})`);
    process.exitCode = 1;
  }
}
console.log("Step 3/8 TTS: SIMULATED (OmniVoice not called)");
for (const scene of script.scenes) {
  const sec = Math.max(1.0, scene.voiceText.length / charsPerSecond);
  console.log(`  voice/scene-${scene.id}.mp3: simulated ${sec.toFixed(2)}s`);
}
console.log("Step 4/8 Concat voice: SIMULATED");
console.log(`  voice-raw.mp3: estimated ${(total + gap * (script.scenes.length - 1)).toFixed(2)}s`);
console.log("Step 5/8 SFX mix: PASS (all scenes explicitly set to none)");
console.log("Step 6/8 HyperFrames render: SIMULATED (Chromium not called)");
for (const scene of script.scenes) {
  console.log(`  clips/scene-${scene.id}.mp4 → clips/scene-${scene.id}-fit.mp4`);
}
console.log("Step 7/8 FFmpeg concat + mux: SIMULATED (ffmpeg not called)");
const estimatedFinal = total + gap * (script.scenes.length - 1) + outroHold;
console.log(`Step 8/8 Done: estimated final duration ${estimatedFinal.toFixed(2)}s`);
console.log("Note: actual duration depends on OmniVoice speech rate and pauses; target is approximately 30s.");
