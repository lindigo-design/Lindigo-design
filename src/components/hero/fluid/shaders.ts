/*
 * Шейдери рідини.
 *
 * Основа: WebGL-Fluid-Simulation, Pavel Dobryakov
 * https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
 *
 * MIT License
 * Copyright (c) 2017 Pavel Dobryakov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Зміни Lindigo:
 *  - замість текстури фарби — текстура ЗСУВУ (displacement): у ній зберігається, на скільки
 *    зсунута точка картинки. Рідина переносить зсув, а екран бере колір прямо з картинки
 *    (uImage) у зсунутій точці. Тому картинка лишається різкою, нових кольорів немає,
 *    а перший кадр (зсув = 0) точно збігається з <img> під полотном;
 *  - зсув щокадру згасає з силою uRestore — картинка збирається назад;
 *  - координати картинки рахуються як у object-fit: cover усередині її рамки (uBox);
 *  - під час зміни теми екран плавно змішує стару й нову картинку (uMix).
 */

export const baseVertex = /* glsl */ `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;

  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

export const clearShader = /* glsl */ `
  precision mediump float;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;

  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

export const splatShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;

  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

export const advectionShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;

  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`;

/** Перенос зсуву. C(x) = x + D(x); C_new(x) = C(x − step) ⇒ D_new(x) = D(x − step) − step */
export const displacementShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uDisp;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float restore;
  uniform float strength;

  void main () {
    vec2 step = strength * dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec2 d = texture2D(uDisp, vUv - step).xy - step;
    gl_FragColor = vec4(d * (1.0 - restore), 0.0, 1.0);
  }
`;

export const divergenceShader = /* glsl */ `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

export const curlShader = /* glsl */ `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

export const vorticityShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;

  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;

    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;

    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * dt;
    velocity = min(max(velocity, -1000.0), 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

export const pressureShader = /* glsl */ `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;

  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

export const gradientSubtractShader = /* glsl */ `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

/**
 * Екран. uBox — рамка <img> у координатах полотна (x, y знизу, ширина, висота).
 * uScale — масштаб object-fit: cover усередині рамки.
 */
export const displayShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uDisp;
  uniform sampler2D uImage;
  uniform sampler2D uPrevImage;
  uniform vec4 uBox;
  uniform vec4 uPrevBox;
  uniform vec2 uScale;
  uniform vec2 uPrevScale;
  uniform float uMix;

  vec2 imageUv (vec2 uv, vec4 box, vec2 scale) {
    vec2 b = (uv - box.xy) / box.zw;
    return (b - 0.5) * scale + 0.5;
  }

  void main () {
    vec2 uv = vUv + texture2D(uDisp, vUv).xy;
    vec3 color = texture2D(uImage, imageUv(uv, uBox, uScale)).rgb;
    if (uMix < 1.0) {
      vec3 prev = texture2D(uPrevImage, imageUv(uv, uPrevBox, uPrevScale)).rgb;
      color = mix(prev, color, uMix);
    }
    gl_FragColor = vec4(color, 1.0);
  }
`;
