import { App, SecretComponent, Setting, type Plugin, type SettingGroup } from "obsidian";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_SETTINGS,
  LOCAL_RUNNER_SECRET_ID,
  normalizeSettings,
  RunnableCodeBlocksSettingTab,
  type RunnableCodeBlocksSettings
} from "../src/settings";

// Exercise the settings lifecycle exposed by Obsidian 1.12.
function displayLegacy(tab: { display(): void }): void { tab.display(); }

describe("normalizeSettings", () => {
  it("uses safe defaults for missing or malformed data", () => {
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings([])).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings({ executionOrder: "unknown", localRunnerEndpoint: "https://example.com", remoteExecutionEnabled: "yes" }))
      .toEqual(DEFAULT_SETTINGS);
  });

  it("preserves the old private-first value as browser-first", () => {
    expect(normalizeSettings({ executionOrder: "private-first", remoteExecutionEnabled: false }))
      .toEqual({ ...DEFAULT_SETTINGS, executionOrder: "private-first", remoteExecutionEnabled: false });
  });

  it("accepts current settings", () => {
    expect(normalizeSettings({ executionOrder: "browser-first", localExecutionEnabled: true, localRunnerEndpoint: "http://localhost:17171", remoteExecutionEnabled: true }))
      .toEqual({
        ...DEFAULT_SETTINGS,
        executionOrder: "private-first",
        localExecutionEnabled: true,
        localRunnerEndpoint: "http://localhost:17171",
        remoteExecutionEnabled: true
      });
  });

  it("preserves selected and cleared secret references while retaining the legacy default", () => {
    expect(normalizeSettings({}).localRunnerSecretId).toBe(LOCAL_RUNNER_SECRET_ID);
    expect(normalizeSettings({ localRunnerSecretId: "chosen-runner" }).localRunnerSecretId).toBe("chosen-runner");
    expect(normalizeSettings({ localRunnerSecretId: "" }).localRunnerSecretId).toBe("");
  });

  it.each(["kotlinCompilerPath", "javaPath"])("keeps legacy %s users local-only until the companion is paired", (key) => {
    expect(normalizeSettings({ [key]: "/local/compiler" })).toEqual({
      ...DEFAULT_SETTINGS,
      localExecutionEnabled: true,
      remoteExecutionEnabled: false
    });
  });

  it("preserves explicit execution choices when legacy paths remain", () => {
    expect(normalizeSettings({ kotlinCompilerPath: "/local/compiler", localExecutionEnabled: false,
      remoteExecutionEnabled: true, executionOrder: "remote-first" })).toEqual({
      ...DEFAULT_SETTINGS,
      executionOrder: "remote-first"
    });
    expect(normalizeSettings({ kotlinCompilerPath: " ", javaPath: null })).toEqual(DEFAULT_SETTINGS);
  });
});

describe("RunnableCodeBlocksSettingTab", () => {
  afterEach(() => { document.body.replaceChildren(); vi.restoreAllMocks(); });
  function createTab() {
    const settings: RunnableCodeBlocksSettings = { ...DEFAULT_SETTINGS };
    const saveSettings = vi.fn(async () => undefined);
    const plugin = { saveSettings, settings } as unknown as Plugin & {
      saveSettings(): Promise<void>;
      settings: RunnableCodeBlocksSettings;
    };
    return { saveSettings, settings, tab: new RunnableCodeBlocksSettingTab(new App(), plugin) };
  }

  it("renders the settings on Obsidian 1.12 without enabling a runner", () => {
    const { tab, settings, saveSettings } = createTab();
    displayLegacy(tab);
    expect(tab.containerEl.querySelectorAll(".setting-item")).toHaveLength(4);
    expect(tab.containerEl.querySelector('[data-name="Provider order"] select')).not.toBeNull();
    expect(tab.containerEl.querySelector('[data-name="Pairing token"]')).toBeNull();
    expect(settings.localExecutionEnabled).toBe(false);
    expect(saveSettings).not.toHaveBeenCalled();
  });

  it("reveals local settings after opt-in and preserves endpoint validation", async () => {
    const { tab, settings, saveSettings } = createTab();
    const selectSecret = vi.spyOn(SecretComponent.prototype, "setValue");
    document.body.append(tab.containerEl);
    displayLegacy(tab);
    const toggle = tab.containerEl.querySelector<HTMLInputElement>('[data-name="Local runner"] input');
    if (!toggle) throw new Error("Missing local runner toggle");
    toggle.checked = true;
    toggle.dispatchEvent(new Event("change"));
    await vi.waitFor(() => expect(tab.containerEl.querySelectorAll(".setting-item")).toHaveLength(6));
    expect(selectSecret).toHaveBeenCalledWith(LOCAL_RUNNER_SECRET_ID);
    const endpoint = tab.containerEl.querySelector<HTMLInputElement>('[data-name="Local runner endpoint"] input');
    if (!endpoint) throw new Error("Missing endpoint field");
    endpoint.value = "https://example.com";
    endpoint.dispatchEvent(new Event("input"));
    await vi.waitFor(() => expect(endpoint.closest<HTMLElement>(".setting-item")?.dataset.desc).toContain("loopback"));
    expect(settings.localRunnerEndpoint).toBe(DEFAULT_SETTINGS.localRunnerEndpoint);
    expect(saveSettings).toHaveBeenCalledOnce();
    endpoint.value = "http://localhost:19191";
    endpoint.dispatchEvent(new Event("input"));
    await vi.waitFor(() => expect(saveSettings).toHaveBeenCalledTimes(2));
    expect(settings.localRunnerEndpoint).toBe("http://localhost:19191");
  });

  it("persists provider selection through the legacy dropdown", async () => {
    const { tab, settings, saveSettings } = createTab();
    displayLegacy(tab);
    const order = tab.containerEl.querySelector<HTMLSelectElement>('[data-name="Provider order"] select');
    if (!order) throw new Error("Missing provider dropdown");
    order.value = "remote-first";
    order.dispatchEvent(new Event("change"));
    await vi.waitFor(() => expect(saveSettings).toHaveBeenCalledOnce());
    expect(settings.executionOrder).toBe("remote-first");
  });

  it("selects a secret by name without exposing or overwriting its value", async () => {
    const { tab, settings, saveSettings } = createTab();
    tab.app.secretStorage.setSecret(LOCAL_RUNNER_SECRET_ID, "existing-token-value");
    tab.app.secretStorage.setSecret("chosen-runner", "chosen-token-value");
    const setSecret = vi.spyOn(tab.app.secretStorage, "setSecret");
    const setValue = vi.spyOn(SecretComponent.prototype, "setValue");
    let select: ((value: string) => unknown) | undefined;
    const change = vi.spyOn(SecretComponent.prototype, "onChange").mockImplementation(function (this: SecretComponent, callback) {
      select = callback;
      return this;
    });
    try {
      const definition = tab.getSettingDefinitions().find(item => "name" in item && item.name === "Pairing token");
      if (!definition || !("render" in definition) || !definition.render) throw new Error("Missing secret selector");
      definition.render(new Setting(document.createElement("div")), {} as SettingGroup);
      expect(setValue).toHaveBeenCalledWith(LOCAL_RUNNER_SECRET_ID);
      await select?.("chosen-runner");
      expect(settings).toMatchObject({ localRunnerSecretId: "chosen-runner" });
      expect(saveSettings).toHaveBeenCalledOnce();
      expect(setSecret).not.toHaveBeenCalled();
      expect(tab.app.secretStorage.getSecret(LOCAL_RUNNER_SECRET_ID)).toBe("existing-token-value");
    } finally {
      setSecret.mockRestore(); setValue.mockRestore(); change.mockRestore();
    }
  });

  it("describes the shared language catalog and both execution controls", () => {
    const { tab } = createTab();

    expect(tab.getSettingDefinitions().map((definition) =>
      "name" in definition ? definition.name : undefined
    )).toEqual([
      "Supported languages",
      "Local runner",
      "Local runner endpoint",
      "Pairing token",
      "Remote execution",
      "Provider order"
    ]);
    expect(tab.getControlValue("localExecutionEnabled")).toBe(false);
    expect(tab.getControlValue("localRunnerEndpoint")).toBe("http://127.0.0.1:17171");
    expect(tab.getControlValue("remoteExecutionEnabled")).toBe(true);
    expect(tab.getControlValue("executionOrder")).toBe("private-first");
    expect(tab.getControlValue("unknown")).toBeUndefined();
  });

  it("persists only valid control values", async () => {
    const { saveSettings, settings, tab } = createTab();

    await tab.setControlValue("localExecutionEnabled", true);
    await tab.setControlValue("localRunnerEndpoint", "http://localhost:19191");
    await tab.setControlValue("remoteExecutionEnabled", false);
    await tab.setControlValue("executionOrder", "remote-first");
    await tab.setControlValue("executionOrder", "invalid");
    await tab.setControlValue("unknown", true);

    expect(settings).toEqual({
      ...DEFAULT_SETTINGS,
      executionOrder: "remote-first",
      localExecutionEnabled: true,
      localRunnerEndpoint: "http://localhost:19191",
      remoteExecutionEnabled: false
    });
    expect(saveSettings).toHaveBeenCalledTimes(4);
  });
});
