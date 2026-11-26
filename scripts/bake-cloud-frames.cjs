// Повторити для нових кадрів: на вході — непрозорі кадри з відео (чорне тло для темної теми, біле — для світлої),
// темні — з коміту 12ef3dd, світлі — з ceada76 (напр. git show 12ef3dd:public/media/services/cloud-dark/000.webp). Запуск:
//   node scripts/bake-cloud-frames.cjs node_modules/sharp <тека з кадрами> public/media/services/cloud-dark dark
// Кадри хмари → медузи з прозорим тлом, щоб не залежати від mix-blend-mode (на iPhone він не спрацьовує).
// Темна тема: було screen поверх фону + filter: contrast(1.45) brightness(0.82) saturate(1.3).
//   Беремо відфільтрований кадр S, альфа a = max(S), колір C = B0 + S·(1 − B0) / a — тоді C·a + B0·(1 − a) = screen(B0, S) точно.
// Світла: було multiply поверх фону. a = max(1 − S), C = B0·(1 − (1 − S) / a) — тоді C·a + B0·(1 − a) = B0·S.
// B0 — середній колір фону за медузою на сторінці «Послуги» (виміряно на 390 і 1512 px).
// node scripts/bake-cloud-frames.cjs <sharpDir> <inDir> <outDir> <dark|light>
const [sharpDir, inDir, outDir, mode] = process.argv.slice(2);
const sharp = require(sharpDir);
const fs = require('fs'), path = require('path');
fs.mkdirSync(outDir, { recursive: true });
const B0 = mode === 'dark' ? [45 / 255, 29 / 255, 70 / 255] : [238 / 255, 220 / 255, 229 / 255];
const cl = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const sat = (r, g, b, s) => [
  cl((0.213 + 0.787 * s) * r + (0.715 - 0.715 * s) * g + (0.072 - 0.072 * s) * b),
  cl((0.213 - 0.213 * s) * r + (0.715 + 0.285 * s) * g + (0.072 - 0.072 * s) * b),
  cl((0.213 - 0.213 * s) * r + (0.715 - 0.715 * s) * g + (0.072 + 0.928 * s) * b),
];
const LO = 6 / 255; // шум стиснення біля чистого тла — повністю прозорий
(async () => {
  for (const f of fs.readdirSync(inDir).filter((f) => f.endsWith('.webp')).sort()) {
    const { data, info } = await sharp(path.join(inDir, f)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const out = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
      let s = [data[i] / 255, data[i + 1] / 255, data[i + 2] / 255];
      let a, c;
      if (mode === 'dark') {
        s = s.map((v) => cl(cl((v - 0.5) * 1.45 + 0.5) * 0.82));
        s = sat(s[0], s[1], s[2], 1.3);
        const m = Math.max(...s);
        a = cl((m - LO) / (1 - LO));
        c = a ? s.map((v, k) => cl(B0[k] + (v * (1 - B0[k])) / a)) : B0;
      } else {
        const m = Math.max(...s.map((v) => 1 - v));
        a = cl((m - LO) / (1 - LO));
        c = a ? s.map((v, k) => cl(B0[k] * (1 - (1 - v) / a))) : B0;
      }
      out[j] = Math.round(c[0] * 255); out[j + 1] = Math.round(c[1] * 255); out[j + 2] = Math.round(c[2] * 255); out[j + 3] = Math.round(a * 255);
    }
    await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
      .webp({ quality: 72, alphaQuality: 50, smartSubsample: true, effort: 6 })
      .toFile(path.join(outDir, f));
  }
  console.log(mode, 'done');
})();
