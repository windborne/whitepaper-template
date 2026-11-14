# v1.1.0 release scope and rollout

Use the latest `main` for new documents. The annotated `v1.1.0` tag is a fixed source checkpoint for this release, not the default checkout for new work. It is applied after the exact source commit passes the workspace checks and GitHub Actions on Ubuntu and macOS. Do not move published tags; `v1.0` and `v1.0.1` stay unchanged.

Preserve each HTML document's `template-origin.json`, `toolchain.json`, editable source, assets and final PDF. For native Google Docs/Word documents, record the template commit in private handoff notes. Tags fix source revisions, not every OS/browser outcome. Existing documents keep their copied template until the user requests an update and its exports are checked again.

## Changes since v1.0.1

- Matching Reset view / Save settings controls, including browser-only preference saves for hosted reviews.
- Automatic shared frames for grouped images and source-only border overrides.
- Direct prepared-PDF links in hosted review mode.
- Google Docs/Word companion guidance for native document formatting, first-page logo, horizontal metadata, footers, square bullets and import/export verification; included in newly generated workspaces.
- Current `main` as the default in onboarding and agent instructions, with exact revision records retained for reproducibility.

## Earlier maintenance release

`v1.0.1` incorporated [PR #1](https://github.com/windborne/whitepaper-template/pull/1): pypdf 6.10.0 → 6.21.4 and a cover test tolerant of spaces inserted into letter-spaced text during extraction. Existing workspaces retain their copied requirements until explicitly updated and checked.

## Confirmed decisions

- John approved the document design, as confirmed by the template owner.
- Following Mei-lan’s policy approval, Chris confirmed the exact three first-page notices in [DESIGN.md](DESIGN.md#automatic-first-page-notices) and the classification mapping on November 12, 2026. Public / Internal / Proprietary are the supported levels; Internal is the default. Former Confidential and Restricted values map to Proprietary.
- These are approvals for the template and its default wording. They do not approve newly written custom notices, publication of a particular document, or storage/AI tools for sensitive material. Preserve supplied custom wording; do not silently represent it as separately approved.
- Real manuscripts and derived files belong in a separate document workspace outside Git, in approved storage. The public repository contains the toolkit and synthetic examples. The setup utility does not configure access permissions, cloud sync or AI authorization.
- Dana’s Word template is not superseded. Use the HTML/PDF workflow or the Google Docs/Word companion as requested; retain Dana’s Word template as an option and follow customer-mandated formats.

## Rollout status and follow-through

| Item | Owner / next step |
|---|---|
| Agent discovery | Darius confirmed the Index entry is live via the_index#77. Ask SHODAN to make current `main` the default for new documents, mention the Google Docs/Word companion, and list `v1.1.0` only as a fixed checkpoint; that follow-up is not performed by this repository release. |
| CUI and other controlled material | Darius/the responsible IT or security owner identifies the approved storage, AI environments, permissions and markings before such content is processed. This repo does not designate a platform as approved. |
| Branch protection | A repository administrator configures the agreed rules for main. As checked November 13, 2026, main is unprotected and the publishing account has push access, not admin access. |
| Dependency alerts | `requirements.txt` pins pypdf 6.21.4, which fixes every pypdf advisory open on November 13, 2026. Those were hang and memory bugs on crafted PDFs, and the toolkit parses only PDFs it renders. Keep reviewing new alerts; passing layout CI is not a security review. |
| First-time authoring | Have someone who did not build the template create a document in approved storage and complete setup, editing, saving and PDF export. This tests onboarding; it need not repeat the completed layout comparisons. |
| Review samples | Keep real examples out of the public Git repository and end temporary sharing when review finishes. Confirm access to HTML, direct PDFs and images ends; downloaded copies cannot be revoked. |
| Announcement | Announce the workflow after the onboarding result and applicable owner decisions are confirmed. Do not describe unresolved handling/security decisions as completed. |

These follow-ups are not a request to silently change repository access, retire another template, publish a manuscript or contact anyone.

## Suggested Index version update

| Task | Resource and use |
|---|---|
| Write a whitepaper, technical report, case study or proposal | [windborne/whitepaper-template](https://github.com/windborne/whitepaper-template). Use latest `main` for new documents; `v1.1.0` is a fixed checkpoint when needed. Follow README.md for HTML/web + PDF, or GOOGLE-DOCS.md for native Google Docs/Word. Work in approved storage outside the public checkout, record the exact template commit, and preserve existing workspaces unless an update is requested. Never commit real content to the public toolkit. Internal is the default classification. Dana’s Word template remains available; customer-mandated formats take precedence. Contact: Julea Chin. |

## Release procedure

1. Review the diff: shared code, documentation and synthetic fixtures only; no customer/internal examples or derived assets.
2. Run `npm run check:workspace` and `npm run check` after setup. Regenerate and visually inspect changed synthetic PDF content.
3. Push the reviewed source commit and require successful GitHub Actions on that exact commit.
4. Create an annotated `v1.1.0` tag pointing to that commit, push the tag without force, and verify its remote target. If it already exists, inspect it rather than replacing it.
5. Preserve the release identifier with each new document. Keep remaining rollout responsibilities explicit.
