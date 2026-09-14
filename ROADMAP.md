# Roadmap

Manta Code Blocks helps readers experiment with code without leaving their notes. Temporary edits do not overwrite the Markdown source.

## Available

- 24 fence names, including seven built-in browser runtimes and optional local or named remote execution.
- Edit, Run, Copy, Reset, keyboard execution, and cancellable interactive previews.
- Explicit provider labels, bounded output, and recovery without automatically repeating an uncertain execution.
- Obsidian and static website integration with independent host settings.

## In progress

- Make connection recovery on hosted examples work without losing edits, while keeping offline examples available.
- Review first-use and repeated-render interactions using reproducible reports from the wider Obsidian ecosystem.

## Under consideration

- Broader third-party-theme, screen-reader, and mobile-device coverage.
- Clearer recovery guidance for unavailable optional runtimes.

External reports guide investigation; they do not establish defects in this plugin. Initial comparisons cover [duplicate controls](https://github.com/twibiral/obsidian-execute-code/issues/455) and [preserving other plugins' classes](https://github.com/twibiral/obsidian-execute-code/issues/454).

## Next: clear execution and recovery

Keep input, output and the selected runtime visible together. Improve error locations, cancellation and recovery without duplicate execution. A planned external AI tool should inspect a selected fence before requesting a separate, explicit run through the same executor as the UI.

Align type sizes, spacing, neutral surfaces, keyboard focus and status wording with the other Manta tools. Keep this plugin useful on its own. Measure first-use completion, manual corrections, recovery and repeat use against the same public inputs before claiming an improvement. These are planned changes.

[Shared product direction and release criteria](https://github.com/woonyong-choi/manta-diagrams/blob/main/docs/product-direction.md)

## Out of scope

- Automatically running code when a note opens.
- Sending code to an unselected provider after an uncertain result.
- Installing language runtimes or arbitrary packages inside the Community Plugin.

Share a reproducible problem or use case through [Issues](https://github.com/woonyong-choi/manta-code-blocks/issues/new).
