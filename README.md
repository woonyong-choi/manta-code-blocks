<img src="https://raw.githubusercontent.com/woonyong-choi/manta-code-blocks/main/docs/assets/product-icon.svg" alt="" width="48" height="48" />

# Manta Code Blocks

Manta Code Blocks is an Obsidian Community plugin that turns `run-*` code fences into editable examples with inline output.

- Seven browser runtimes work without an account. Other languages use an optional local container companion or a named remote provider.
- Runtime adapters share one result contract. A failed provider is retried only when execution is known not to have started, so an unknown failure cannot run the same code twice.
- Version 0.7.10 supports 24 language fences through 10 adapters. The repository test suite covers adapter selection, parsing, UI state, and release metadata.

**[Install in Obsidian](https://community.obsidian.md/plugins/runnable-code-blocks) · [Try the live editor](https://woonyong-choi.github.io/manta-code-blocks/) · [User guide](docs/user-guide.md)**

Version: **0.7.10** · Obsidian **1.13.0+** · Desktop and mobile. See [release notes](CHANGELOG.md) for shipped changes and the [roadmap](ROADMAP.md) for work in progress and plans.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/woonyong-choi/manta-code-blocks/main/docs/assets/manta-code-blocks-intro-dark.gif">
  <img src="https://raw.githubusercontent.com/woonyong-choi/manta-code-blocks/main/docs/assets/manta-code-blocks-intro.gif" alt="Manta Code Blocks: edit a discount, run the code and compare the output" width="1200">
</picture>

A six-second loop of the current browser UI, with real JavaScript execution. Timing is condensed.

## Install and try

1. Open the [existing Community entry](https://community.obsidian.md/plugins/runnable-code-blocks) in Obsidian.
2. Select **Install**, then **Enable**.
3. Paste this block in a note, switch to Reading view, and select **Run**:

````markdown
```run-javascript
console.log("Hello from Obsidian!");
```
````

The result appears below the code. Edit the example and run again; **Copy** keeps your edited code, while **Reset** restores the original.

Seven browser fences work without an account or server. Other languages use an optional local companion or a named remote provider. Remote execution is enabled by default; disable it in settings to prevent remote submission.

Manual installation: download `main.js`, `manifest.json`, and `styles.css` from [Releases](https://github.com/woonyong-choi/manta-code-blocks/releases/latest) into `.obsidian/plugins/runnable-code-blocks/`, then reload Obsidian.

<details>
<summary>Original runtime capture and recorded version</summary>

![Manta Code Blocks walkthrough](https://raw.githubusercontent.com/woonyong-choi/manta-code-blocks/main/docs/assets/runnable-code-blocks-demo.gif)

Browser demo, September 9, 2026 (0.7.3); the capture predates the Manta name.

</details>

## Part of the Manta family

The plugins work independently and share ordinary Markdown and links: [Manta Diagrams](https://github.com/woonyong-choi/manta-diagrams), [Manta Graph](https://github.com/woonyong-choi/manta-graph), and [Manta Calendar](https://github.com/woonyong-choi/manta-calendar).

## Help and development

[User guide](docs/user-guide.md) · [Report a problem](https://github.com/woonyong-choi/manta-code-blocks/issues) · [Community page](https://community.obsidian.md/plugins/runnable-code-blocks) · [Contributing](CONTRIBUTING.md)

[MIT](LICENSE) · [Third-party notices](THIRD_PARTY_NOTICES.md)
