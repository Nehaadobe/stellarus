# Quote

This block delegates to Blueshield's locally adopted shared decorator. It does not
load code from another website or change the core EDS loader.

Author a one-column table:

| Quote |
| --- |
| We build **better experiences** together. |
| Alex, *Engineering* |

The first row is the quotation; additional rows are optional attribution. Rich
text and links are preserved. An empty block is tolerated. This POC does not
support portrait rows.

The local `quote.css` centers quotations and uses the existing link-color token
to demonstrate customer-owned styling. This is POC styling, not an approved brand
redesign. Change these local overrides independently of subtree updates.

Update shared behavior in Blueshield, never in the consumer's imported subtree.
See the [shared workflow and browser checks](../../shared/README.md).
