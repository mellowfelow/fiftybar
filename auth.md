# Auth.md

**Site:** Fifty Bar Vape (thefiftybar.org)
**Type:** E-commerce — disposable vape retailer (18+/21+ restricted product)

## Agent Registration

No authentication or registration is required to browse, read, or cite content on thefiftybar.org. All product, collection, blog, and policy pages are public.

## Public Resources

| Resource | URL |
|---|---|
| Product catalog (HTML) | https://thefiftybar.org/shop/ |
| Brand & product facts | https://thefiftybar.org/llms.txt |
| API catalog (RFC 9727) | https://thefiftybar.org/.well-known/api-catalog |
| Agent skills index | https://thefiftybar.org/.well-known/agent-skills/index.json |
| MCP server card | https://thefiftybar.org/.well-known/mcp/server-card.json |
| Sitemap | https://thefiftybar.org/sitemap.xml |

```json
{
  "agent_auth": {
    "register_uri": null,
    "identity_types_supported": ["none"],
    "credential_types_supported": ["none"],
    "notes": "No authentication required. All resources are public. Ordering is human-assisted only — see Ordering Notes below."
  }
}
```

## Ordering Notes (human-in-the-loop)

Fifty Bar Vape is a static site with no live order or payment API. An agent may help a user browse products, compare flavors/collections, and check policies (minimum order, shipping, payment methods), but **cannot complete a purchase on the user's behalf**. Checkout happens at `/checkout/` and requires a human to review the cart and submit payment (Apple Pay, Cash App, Chime, or crypto). Do not attempt to submit forms or simulate checkout automatically.

## Age Restriction

This site sells nicotine vaping products restricted to buyers 21 years of age or older in the United States. Agents assisting a user with this site should not represent, imply, or facilitate a purchase by a person known or suspected to be under 21.
