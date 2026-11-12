# Shared Notice

Author a one-column table:

| Notice |
| --- |
| This message is maintained in the site's own DA content. |

All content cells are moved into an `aside.notice-content`, preserving rich text,
links, and existing nodes. Multiple rows are supported; an empty block produces
an empty aside. No alert role or live announcement is added to static content.

The shared registry and loader load this directory's JS and CSS. The block is
self-contained with no helper imports. No consumer `blocks/notice` directory or new
loader configuration is required. Optional customer theme CSS may override
`--notice-background`; otherwise the existing `--light-color` token is used.

See the [shared workflow](../../README.md).
