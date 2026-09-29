# New Product Registration API — Demo Extension

This extension demonstrates the **new product registration API** (`addProduct` / `extendProduct`) introduced in Rancher UI Extensions v3. It replaces the older DSL-heavy approach (manual `product()`, `basicType()`, `virtualType()`, `configureType()` calls) with a declarative, typed configuration object.

## What this example covers

The extension registers **one new top-level product** and **extends the existing Explorer product**, both using the same API.

### 1. New top-level product — `addProduct`

Registered as **"New Product - Prod. Reg. API"** in the left-hand navigation sidebar.

The product has three sections:

| Nav entry | Type | What it shows |
|---|---|---|
| **Home** | Custom page (`ProductChildCustomPage`) | Standalone page, not inside any group |
| **Monitoring > Alerts** | Custom page inside a group | Simple placeholder page |
| **Monitoring > Mgmt clusters** | Resource page (`ProductChildResourcePage`) | Live list of `management.cattle.io.cluster` resources |
| **Administration** | Group with overview page | Clicking the group header renders a custom overview component |
| **Administration > Roles** | Custom page inside a group | Simple placeholder page |
| **Administration > Global Role Bindings** | Resource page | Live list of `management.cattle.io.globalrolebinding` resources |

The **Administration** group demonstrates a group that has its own component (an overview page). Clicking the group label in the sidebar navigates to that overview page, while the children are still accessible as individual entries below it.

### 2. Extending an existing product — `extendProduct`

The same pages are also injected into the **Explorer** product (Cluster Explorer) under a group called **"Extend Product - Prod. Reg. API"**, which appears at the top of the Explorer's sidebar (weight 1000). This shows how `extendProduct` lets you add nav entries to any built-in Rancher product without forking it.

## Where to find it in the UI

**New top-level product:**
- Look in the **left-hand global navigation** (the icon bar on the far left). A new entry labelled **"New Product - Prod. Reg. API"** will appear there. Click it to enter the product.

**Explorer extension:**
- Navigate to any cluster via **Cluster Explorer**. Scroll to the bottom of the sidebar — a group called **"Extend Product - Prod. Reg. API"** will appear with the same pages nested inside it.

## File structure

```
pkg/new-prod-reg-api/
├── index.ts          # Product registration — all addProduct / extendProduct calls live here
└── pages/
    ├── Home.vue      # Standalone home page
    ├── Alerts.vue    # Custom page inside Monitoring group
    ├── Roles.vue     # Custom page inside Administration group
    └── Overview.vue  # Overview component for the Administration group header
```
