# v1.0 release scope and rollout

The `v1.0` annotated tag identifies the reviewed HTML/web/PDF template baseline. It is applied after the exact source commit passes the workspace checks and GitHub Actions on Ubuntu and macOS. The tag fixes the source revision, not every OS/browser outcome; preserve each document’s `template-origin.json`, `toolchain.json`, editable source, assets and final PDF. Do not move a published tag; use a new version for later changes.

## Confirmed decisions

- John approved the document design, as confirmed by the template owner.
- Following Mei-lan’s policy approval, Chris confirmed the exact three first-page notices in [DESIGN.md](DESIGN.md#automatic-first-page-notices) and the classification mapping on November 12, 2026. Public / Internal / Proprietary are the supported levels; Internal is the default. Former Confidential and Restricted values map to Proprietary.
- These are approvals for the template and its default wording. They do not approve newly written custom notices, publication of a particular document, or storage/AI tools for sensitive material. Preserve supplied custom wording; do not silently represent it as separately approved.
- Real manuscripts and derived files belong in a separate document workspace outside Git, in approved storage. The public repository contains the toolkit and synthetic examples. The setup utility does not configure access permissions, cloud sync or AI authorization.
- Dana’s Word template is not superseded. Use this workflow for AI-assisted HTML/PDF; retain Word when required and follow customer-mandated formats.

## Rollout responsibilities still requiring follow-through

| Item | Owner / next step |
|---|---|
| Agent discovery | SHODAN can prepare an Index PR; Darius/the Index owner reviews it. A proposed entry is below. No Index change is implied by this release. |
| CUI and other controlled material | Darius/the responsible IT or security owner identifies the approved storage, AI environments, permissions and markings before such content is processed. This repo does not designate a platform as approved. |
| Branch protection | A repository administrator configures the agreed rules for main. As checked November 13, 2026, main is unprotected and the publishing account has push access, not admin access. |
| Dependency alerts | Review the repository’s Dependabot alerts for pypdf and update/test the relevant pinned dependencies. These alerts remain open at this documentation checkpoint; successful layout CI is not a security review. |
| First-time authoring | Have someone who did not build the template create a document in approved storage and complete setup, editing, saving and PDF export. This tests onboarding; it need not repeat the completed layout comparisons. |
| Review samples | Keep real examples out of the public Git repository and end temporary sharing when review finishes. Confirm access to HTML, direct PDFs and images ends; downloaded copies cannot be revoked. |
| Announcement | Announce the workflow after the onboarding result and applicable owner decisions are confirmed. Do not describe unresolved handling/security decisions as completed. |

These follow-ups are not a request to silently change repository access, retire another template, publish a manuscript or contact anyone.

## Proposed Index entry

| Task | Resource and use |
|---|---|
| Write a whitepaper, technical report, case study or proposal (web + PDF) | [windborne/whitepaper-template](https://github.com/windborne/whitepaper-template), reviewed baseline `v1.0`. Give the repo and source content to an agent in an approved environment. Follow README.md to create a separate document workspace outside Git, then edit and export. Never commit real content to the public toolkit. Internal is the default classification. Use Dana’s Word template when Word is needed and the customer’s template for mandated formats. Contact: Julea Chin. |

## Release procedure

1. Review the diff: shared code, documentation and synthetic fixtures only; no customer/internal examples or derived assets.
2. Run `npm run check:workspace` and `npm run check` after setup. Regenerate and visually inspect changed synthetic PDF content.
3. Push the reviewed source commit and require successful GitHub Actions on that exact commit.
4. Create an annotated `v1.0` tag pointing to that commit, push the tag without force, and verify its remote target. If it already exists, inspect it rather than replacing it.
5. Preserve the release identifier with each new document. Keep remaining rollout responsibilities explicit.
