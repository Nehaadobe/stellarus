# Shared quote POC

Blueshield owns this subtree. Consumer sites update it deliberately; browsers never
fetch code from the base site's domain. Do not edit imported shared files in a
consumer repository.

## Integration

The reusable decorator lives in `scripts/quote.js`, not another site's block, to
respect the repositories' rule against cross-block imports. Each site keeps a
thin `blocks/quote/quote.js` adapter that awaits `styles/quote.css` using the AEM
`loadCSS` helper, then runs the decorator. The core `scripts/aem.js` is unchanged.

The first cell contains the quotation. Subsequent cells contain optional
attribution. Existing rich-text nodes and links are moved, not recreated. Portrait
images are not part of this POC's authoring contract.

The first attribution link, when supplied, identifies the quotation's source and
sets the semantic `blockquote[cite]` URL. Without a source link, `cite` is omitted.
This is the POC's second shared release: it makes the update observable without
changing customer styling.

Sites may override `--quote-color` and `--quote-text-align` in their local quote
CSS. Font sizes inherit the site's existing tokens. No shared global stylesheet
or customer configuration is imported.

## Local browser check

From either repository:

```sh
python3 -m http.server 3101 --bind 127.0.0.1
```

Open <http://127.0.0.1:3101/shared/tests/quote.html?rum=off>.
The page runs the real EDS block loader and reports failures visibly and in the
console. It covers shared CSS loading, rich text, links, extra attribution rows,
quotation-source metadata, omitted attribution/source, and an empty block. Check
narrow and wide viewports too.

Lint shared code explicitly: the boilerplate's CSS lint script does not include
the subtree.

```sh
./node_modules/.bin/eslint blocks/quote/quote.js shared/scripts/quote.js shared/tests/quote.test.js
./node_modules/.bin/stylelint blocks/quote/quote.css shared/styles/quote.css
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

Universal Editor filtering is separate from code distribution and is not changed
by this POC.
