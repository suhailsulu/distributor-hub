# Distributor Hub — Project Overview

Distributor Hub is an asset management platform for a pharmaceutical company and its distributor network. Assets are organized in folders, folders are scoped to distributor companies (domains), and access is controlled per company and user role.

## Core Concepts

### Companies (domains)

- A **company** (also referred to as a **domain**) is a distributor organization in the network.
- Users belong to a company (`users.company_id` → `companies`).
- Folders are mapped to one or more companies to control which distributors can see them.

### Folders

- Folders are the primary way assets are grouped and distributed.
- A folder can contain **multiple assets**.
- Folders are **mapped to companies (domains)** — distributors access folders assigned to their company, plus any **common folders**.
- Folders can be marked as a **common folder** via a separate flag. **Common folders are visible to all companies** — no per-company assignment needed.

### Assets

- An **asset** is a reference to content stored elsewhere (not necessarily uploaded into this platform).
- Each asset has a **fixed enum type** (`asset_type`) — not free-form or MIME-detected at runtime.
- Allowed values:

| Enum value | Description                |
| ---------- | -------------------------- |
| `image`    | Image file (e.g. PNG, JPG) |
| `pdf`      | PDF document               |
| `link`     | External website URL       |
| `youtube`  | YouTube video link         |
| `excel`    | Excel spreadsheet          |

- The **same asset can appear in multiple folders** (many-to-many relationship between assets and folders).

### Relationships (summary)

```
Company (domain) ←→ Folder ←→ Asset
                      ↑
              (many-to-many: asset can be in multiple folders)
```

- Folders are mapped to companies.
- Folders contain assets.
- Assets can belong to more than one folder.

## User Roles and Access

### Regular users (distributors)

- Belong to a company.
- Can access assets exposed through folders mapped to their company.
- Can submit feedback (see Feedback module below).

### Admins

- Manage users, folders, assets, and company mappings.
- **Approve or reject** new user registrations.
- **Block and unblock** users.
- View and respond to feedback.

### User lifecycle

User statuses: **`unverified`**, **`pending`**, **`active`**, **`blocked`**.

- There is **no `inactive` state** for users.
- **Block/unblock** maps to the `blocked` status (admin action).
- `db/schema.sql` still lists `inactive` and `suspended` — migrate to `blocked` when implementing user management.

| Status       | Meaning                                   |
| ------------ | ----------------------------------------- |
| `unverified` | Registered but email/OTP not yet verified |
| `pending`    | Verified, awaiting admin approval         |
| `active`     | Approved and can use the platform         |
| `blocked`    | Admin-blocked; cannot access the platform |

## Feedback Module

Users can submit two types of feedback:

1. **Asset-specific feedback** — tied to a particular asset.
2. **General feedback** — not tied to a specific asset.

### Visibility rules

- **Admins** can view all feedback.
- **Submitting user** can view their own feedback.
- Other users cannot view feedback they did not submit.

### Replies (threaded conversation)

- Feedback supports a **flat threaded reply chain** on the same feedback item.
- Replies are **not nested** (no reply-to-reply trees) — all messages appear in one chronological thread.
- Both the **submitting user** and **admins** can post **multiple replies** on the same feedback.

## Product Areas (app routes)

| Area           | Route(s)                                                                                                                          | Purpose                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Public / auth  | `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`                                                                 | Landing, registration, login, password flows             |
| User workspace | `/dashboard`, `/browse`, `/search`                                                                                                | Authenticated distributor experience                     |
| Admin          | `/admin`, `/admin/users`, `/admin/distributors`, `/admin/folders`, `/admin/folders/files`, `/admin/link-asets`, `/admin/feedback` | User approval, company/folder/asset management, feedback |

## Terminology

| Term in product | In codebase / DB                        |
| --------------- | --------------------------------------- |
| Domain          | Company (`companies` table)             |
| Distributor     | User associated with a company          |
| Asset           | Link/reference to external file or URL  |
| Asset type      | Fixed enum on each asset (`asset_type`) |
