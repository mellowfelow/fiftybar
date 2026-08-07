(function () {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return;

  navigator.modelContext.provideContext({
    tools: [
      {
        name: "browse_products",
        description: "Browse Fifty Bar Vape products by collection (original-series, white-series, black-series, fruitia, humble, hidden-hills, midnight-series)",
        inputSchema: {
          type: "object",
          properties: {
            collection: { type: "string", description: "Collection slug to browse, or omit for the full shop" }
          }
        },
        execute: async ({ collection }) => {
          const url = collection
            ? `https://thefiftybar.org/shop/${collection}/`
            : `https://thefiftybar.org/shop/`;
          window.location.href = url;
          return { url };
        }
      },
      {
        name: "get_order_policies",
        description: "View minimum order, free shipping threshold, payment methods, and crypto discount",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = `https://thefiftybar.org/how-to-order/`;
          return { url: `https://thefiftybar.org/how-to-order/` };
        }
      },
      {
        name: "get_wholesale_info",
        description: "Get wholesale partner information for retailers",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = `https://thefiftybar.org/wholesale/`;
          return { url: `https://thefiftybar.org/wholesale/` };
        }
      },
      {
        name: "contact",
        description: "Contact Fifty Bar Vape for order support or product questions",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          window.location.href = `https://thefiftybar.org/contact/`;
          return { url: `https://thefiftybar.org/contact/` };
        }
      }
    ]
  });
})();
