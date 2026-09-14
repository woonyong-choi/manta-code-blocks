export class App {
  readonly kind = "test-app";
  readonly secretStorage = new SecretStorage();
}

export class SecretStorage {
  readonly #values = new Map<string, string>();
  getSecret(id: string): string | null {
    return this.#values.get(id) ?? null;
  }
  setSecret(id: string, value: string): void {
    this.#values.set(id, value);
  }
}

export class SecretComponent {
  constructor(_app: App, _containerEl: HTMLElement) {
    void _app;
    void _containerEl;
  }
  onChange(_callback: (value: string) => unknown): this { return this; }
  setValue(_value: string): this { return this; }
}

export async function requestUrl(_request: unknown): Promise<never> {
  throw new Error("requestUrl must be mocked by the test that uses it.");
}

export class MarkdownRenderChild {
  constructor(public containerEl: HTMLElement) {}
  onunload(): void {}
}

export class Plugin {
  app = new App();
  readonly processors = new Map<string, (source: string, element: HTMLElement, context: { addChild(child: MarkdownRenderChild): void }) => void>();
  readonly settingTabs: unknown[] = [];
  savedData: unknown = null;
  testData: unknown = null;
  addSettingTab(tab: unknown): void {
    this.settingTabs.push(tab);
  }
  async loadData(): Promise<unknown> {
    return this.testData;
  }
  registerMarkdownCodeBlockProcessor(
    language: string,
    processor: (source: string, element: HTMLElement, context: { addChild(child: MarkdownRenderChild): void }) => void
  ): void {
    this.processors.set(language, processor);
  }
  async saveData(value: unknown): Promise<void> {
    this.savedData = value;
  }
}

export class PluginSettingTab {
  containerEl = document.createElement("div");
  constructor(public app: App, public plugin: Plugin) {}
}

class TextComponent {
  inputEl = document.createElement("input");
  constructor(container: HTMLElement) { container.append(this.inputEl); }
  onChange(callback: (value: string) => unknown): this {
    this.inputEl.addEventListener("input", () => { callback(this.inputEl.value); }); return this;
  }
  setPlaceholder(value: string): this { this.inputEl.placeholder = value; return this; }
  setValue(value: string): this { this.inputEl.value = value; return this; }
}

class ToggleComponent {
  inputEl = document.createElement("input");
  constructor(container: HTMLElement) { this.inputEl.type = "checkbox"; container.append(this.inputEl); }
  setValue(value: boolean): this { this.inputEl.checked = value; return this; }
  onChange(callback: (value: boolean) => unknown): this {
    this.inputEl.addEventListener("change", () => { callback(this.inputEl.checked); }); return this;
  }
}

class DropdownComponent {
  selectEl = document.createElement("select");
  constructor(container: HTMLElement) { container.append(this.selectEl); }
  addOptions(options: Record<string, string>): this {
    for (const [value, label] of Object.entries(options)) {
      const option = document.createElement("option");
      option.value = value; option.textContent = label; this.selectEl.append(option);
    }
    return this;
  }
  setValue(value: string): this { this.selectEl.value = value; return this; }
  onChange(callback: (value: string) => unknown): this {
    this.selectEl.addEventListener("change", () => { callback(this.selectEl.value); }); return this;
  }
}

export class SettingGroup {
  listEl = document.createElement("div");
  constructor(container: HTMLElement) { container.append(this.listEl); }
  addSetting(callback: (setting: Setting) => unknown): this {
    callback(new Setting(this.listEl)); return this;
  }
}

export class Setting {
  controlEl = document.createElement("div");
  settingEl = document.createElement("div");
  constructor(public containerEl: HTMLElement) {
    this.settingEl.className = "setting-item";
    this.settingEl.append(this.controlEl); containerEl.append(this.settingEl);
  }
  addText(callback: (text: TextComponent) => unknown): this {
    callback(new TextComponent(this.controlEl)); return this;
  }
  addToggle(callback: (toggle: ToggleComponent) => unknown): this {
    callback(new ToggleComponent(this.controlEl)); return this;
  }
  addDropdown(callback: (dropdown: DropdownComponent) => unknown): this {
    callback(new DropdownComponent(this.controlEl)); return this;
  }
  setDesc(value: string): this { this.settingEl.dataset.desc = value; return this; }
  setName(value: string): this { this.settingEl.dataset.name = value; return this; }
}
