# Shared Quote

The complete block is distributed in the subtree. Its decorator reuses the shared
quote helper; all implementation dependencies remain inside `shared`.

Author a one-column table headed `Quote`. The first content row is the quotation.
Subsequent rows are optional attribution. Rich text, existing nodes, and links
are preserved. The first attribution link supplies `blockquote[cite]`. An empty
block is tolerated; portrait rows are not supported.

The shared loader loads this directory's JS and CSS directly. No consumer
`blocks/quote/quote.js` adapter is required. Optional customer CSS can override
`--quote-color` and `--quote-text-align`.

See the [shared workflow](../../README.md).
