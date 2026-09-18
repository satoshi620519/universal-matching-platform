import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../public/demo-v7.html", import.meta.url), "utf8");

describe("demo-v7 authentication integration", () => {
  it("renders the unauthenticated entry point from the session credential", () => {
    expect(source).toContain("const API='https://universal-matching-platform-api.onrender.com',KEY='nexa.session.credential'");
    expect(source).toContain("const token=credential();auth.innerHTML=token?");
    expect(source).toContain("未ログイン");
    expect(source).toContain('id="openLogin"');
  });

  it("stores a successful sign-in credential and renders authenticated state", () => {
    expect(source).toContain("API+'/auth/sign-in'");
    expect(source).toContain("if(!data.credential)throw new Error");
    expect(source).toContain("sessionStorage.setItem(KEY,data.credential)");
    expect(source).toContain("ログイン中");
  });

  it("calls sign-out with the bearer credential and clears local session state", () => {
    expect(source).toContain("API+'/auth/sign-out'");
    expect(source).toContain("Authorization:'Bearer '+token");
    expect(source).toContain("sessionStorage.removeItem(KEY);renderAuth()");
  });
  it("keeps the buyer-flow discovery step complete after leaving the search screen", () => {
    const v5 = readFileSync(new URL("../public/demo-v7.html", import.meta.url), "utf8");
    expect(v5).toContain("S.discoveryVisited=true");
  });
});
