# Complete shared blocks

Blueshield owns this subtree. Consumer sites update it deliberately; browsers never
fetch code from the base site's domain. Do not edit imported shared files in a
consumer repository.

## One-time integration

Complete blocks live in `shared/blocks/<name>/` with `<name>.js`, `<name>.css`,
and `README.md`. Register their names in `shared/scripts/block-registry.js`.
Reusable helpers stay in `shared/scripts`; blocks do not import other blocks.

Each site integrates `scripts/block-loader.js` once. The site's page entry point
and fragment loader import its `loadSection`/`loadSections` instead of the core
versions. The shared loader preserves ordered section loading, the first-section
callback, and the RUM enhancement hook. `scripts/aem.js` is never modified.

Registered shared content blocks load their JS and CSS directly from the site's
own shared directory. Unregistered blocks continue through the existing local
loader. Header and footer remain local and use the standard core loaders.

Shared registrations take precedence over a same-named local block. To explicitly
use a local implementation, add its name to `localBlocks` in the site's loader
configuration. There is no 404-probing or silent fallback after a shared failure:
shared failures are logged, reject loading, and mark the block/section failed.
Failed sections remain visible with their authored content, and unrelated blocks
and later sections continue loading. Reload the page to retry failed resources.

Optional `styles` entries in the site's loader configuration load customer CSS
after shared CSS. Existing local quote/notice adapters and old shared styles are
retained for compatibility, but registered blocks do not request those adapters.
Existing local quote CSS continues to supply site-specific tokens.

## Adding the next block

1. In Blueshield only, add `shared/blocks/<name>/<name>.js`, `<name>.css`,
   and `README.md`; add the name to the shared registry and test it.
2. Commit and export the shared folder, then pull it into the consumer.
3. Test and push the consumer branch. No new consumer block folder, adapter, or
   loader edit is needed.
4. Author the block's content separately in each DA site and preview it.

Subtree updates are not automatic releases: consumers choose when to pull, test,
and push. A new customer still needs the one-time loader integration.

## Quote authoring

The first cell contains the quotation. Subsequent cells contain optional
attribution. Existing rich-text nodes and links are moved, not recreated. Portrait
images are not part of this POC's authoring contract.

The first attribution link, when supplied, identifies the quotation's source and
sets the semantic `blockquote[cite]` URL. Without a source link, `cite` is omitted.

Sites may override `--quote-color` and `--quote-text-align` in their local quote
CSS. Font sizes inherit the site's existing tokens. No shared global stylesheet
or customer configuration is imported.

## Local browser check

From either repository:

```sh
python3 -m http.server 3101 --bind 127.0.0.1
```

Open <http://127.0.0.1:3101/shared/tests/quote.html?rum=off>.
The page runs the integrated site loader and reports failures visibly and in the
console. It covers shared CSS loading, rich text, links, extra attribution rows,
quotation-source metadata, omitted attribution/source, an empty block, local
Columns fallback, section callbacks, and repeat loading. Check narrow and wide
viewports too.

Lint shared code explicitly: the boilerplate's CSS lint script does not include
the subtree.

```sh
./node_modules/.bin/eslint scripts/block-loader.js scripts/scripts.js blocks/fragment/fragment.js shared
./node_modules/.bin/stylelint "shared/**/*.css" blocks/quote/quote.css
```

## Export and consume

After reviewed changes are committed on the base's approved release branch:

```sh
git subtree push --prefix=shared origin shared-export
```

In a consumer, start with a clean worktree and a feature branch. The `shared`
directory must not exist before the initial add:

```sh
git remote add shared-base https://github.com/Nehaadobe/blueshield.git
git subtree add --prefix=shared shared-base shared-export
```

For subsequent releases:

```sh
git subtree pull --prefix=shared shared-base shared-export
```

This POC uses unsquashed subtree history throughout. Merge integration PRs with a
merge commit, not squash/rebase merging, and do not rewrite the export branch.
Track the adopted export commit in each customer update PR.

The local POC can use the Blueshield clone's path instead of its GitHub URL as the
remote. Nothing needs to be pushed to prove add/pull behavior. Before publishing,
merge the base changes first, export from the release branch, and verify that the
consumer's adopted export is an ancestor of the published export.

For a local-only test without changing remote configuration, split to a new local
export branch and pull directly from the Blueshield clone:

```sh
# Blueshield (committed changes)
git subtree split --prefix=shared -b shared-full-blocks-poc

# Stellarus (clean worktree)
git subtree pull --prefix=shared /Users/nehluthr/Documents/GitHub/blueshield shared-full-blocks-poc
```

In this POC, the first full-block export contains Quote. A later export adds
Notice and updates Quote, demonstrating adapter-free adoption by Stellarus.

Universal Editor filtering is separate from code distribution and is not changed
by this POC.
